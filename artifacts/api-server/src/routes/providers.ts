import { Router, type IRouter } from "express";
import { db, providersTable, servicesTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import { CreateProviderBody, UpdateProviderBody } from "@workspace/api-zod";

const router: IRouter = Router();

async function enrichProvider(p: typeof providersTable.$inferSelect) {
  const serviceIds = (p.serviceIds as number[]) ?? [];
  let serviceNames: string[] = [];
  if (serviceIds.length > 0) {
    const svcs = await db.select({ id: servicesTable.id, name: servicesTable.name })
      .from(servicesTable)
      .where(inArray(servicesTable.id, serviceIds));
    const map = Object.fromEntries(svcs.map(s => [s.id, s.name]));
    serviceNames = serviceIds.map(id => map[id] ?? "Unknown");
  }
  return {
    id: p.id,
    name: p.name,
    contactName: p.contactName,
    email: p.email,
    phone: p.phone,
    serviceIds,
    serviceNames,
    rating: p.rating ?? undefined,
    active: p.active,
    notes: p.notes ?? undefined,
    createdAt: p.createdAt.toISOString(),
  };
}

router.get("/providers", async (_req, res) => {
  const providers = await db.select().from(providersTable).orderBy(providersTable.id);
  const enriched = await Promise.all(providers.map(enrichProvider));
  res.json(enriched);
});

router.post("/providers", async (req, res) => {
  const body = CreateProviderBody.parse(req.body);
  const [provider] = await db.insert(providersTable).values({
    name: body.name,
    contactName: body.contactName,
    email: body.email,
    phone: body.phone,
    serviceIds: body.serviceIds ?? [],
    rating: body.rating,
    notes: body.notes,
  }).returning();
  res.status(201).json(await enrichProvider(provider));
});

router.patch("/providers/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const body = UpdateProviderBody.parse(req.body);
  const updates: Partial<typeof providersTable.$inferInsert> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.contactName !== undefined) updates.contactName = body.contactName;
  if (body.email !== undefined) updates.email = body.email;
  if (body.phone !== undefined) updates.phone = body.phone;
  if (body.serviceIds !== undefined) updates.serviceIds = body.serviceIds;
  if (body.rating !== undefined) updates.rating = body.rating;
  if (body.active !== undefined) updates.active = body.active;
  if (body.notes !== undefined) updates.notes = body.notes;
  const [provider] = await db.update(providersTable).set(updates).where(eq(providersTable.id, id)).returning();
  res.json(await enrichProvider(provider));
});

router.delete("/providers/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await db.delete(providersTable).where(eq(providersTable.id, id));
  res.status(204).send();
});

export default router;
