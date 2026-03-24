import { Router, type IRouter } from "express";
import { db, leadsTable, servicesTable, providersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { SubmitLeadBody, UpdateLeadBody } from "@workspace/api-zod";
import { sendLeadNotification } from "../gmail";

const router: IRouter = Router();

async function enrichLead(l: typeof leadsTable.$inferSelect) {
  const [service] = await db.select({ name: servicesTable.name })
    .from(servicesTable)
    .where(eq(servicesTable.id, l.serviceId));
  let assignedProviderName: string | undefined;
  if (l.assignedProviderId) {
    const [provider] = await db.select({ name: providersTable.name })
      .from(providersTable)
      .where(eq(providersTable.id, l.assignedProviderId));
    assignedProviderName = provider?.name;
  }
  return {
    id: l.id,
    serviceId: l.serviceId,
    serviceName: service?.name ?? "Unknown",
    customerName: l.customerName,
    customerEmail: l.customerEmail,
    customerPhone: l.customerPhone,
    address: l.address,
    description: l.description,
    status: l.status,
    adminNotes: l.adminNotes ?? undefined,
    assignedProviderId: l.assignedProviderId ?? undefined,
    assignedProviderName,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  };
}

router.get("/leads", async (_req, res) => {
  const leads = await db.select().from(leadsTable).orderBy(leadsTable.createdAt);
  const enriched = await Promise.all(leads.map(enrichLead));
  res.json(enriched);
});

router.post("/leads", async (req, res) => {
  const body = SubmitLeadBody.parse(req.body);
  const [lead] = await db.insert(leadsTable).values({
    serviceId: body.serviceId,
    customerName: body.customerName,
    customerEmail: body.customerEmail,
    customerPhone: body.customerPhone,
    address: body.address,
    description: body.description,
    status: "new",
  }).returning();
  const enriched = await enrichLead(lead);

  // Send email notification (non-blocking)
  sendLeadNotification({
    customerName: enriched.customerName,
    customerEmail: enriched.customerEmail,
    customerPhone: enriched.customerPhone,
    address: enriched.address,
    description: enriched.description,
    serviceName: enriched.serviceName,
  });

  res.status(201).json(enriched);
});

router.patch("/leads/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const body = UpdateLeadBody.parse(req.body);
  const updates: Partial<typeof leadsTable.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (body.status !== undefined) updates.status = body.status;
  if (body.adminNotes !== undefined) updates.adminNotes = body.adminNotes;
  if (body.assignedProviderId !== undefined) updates.assignedProviderId = body.assignedProviderId;
  const [lead] = await db.update(leadsTable).set(updates).where(eq(leadsTable.id, id)).returning();
  res.json(await enrichLead(lead));
});

router.delete("/leads/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await db.delete(leadsTable).where(eq(leadsTable.id, id));
  res.status(204).send();
});

export default router;
