import { Router, type IRouter } from "express";
import { db, servicesTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import { CreateServiceBody, UpdateServiceBody } from "@workspace/api-zod";

const router: IRouter = Router();

const toDto = (s: typeof servicesTable.$inferSelect) => ({
  id: s.id,
  name: s.name,
  description: s.description,
  icon: s.icon,
  active: s.active,
  sortOrder: s.sortOrder,
  createdAt: s.createdAt.toISOString(),
});

router.get("/services", async (_req, res) => {
  const services = await db.select().from(servicesTable).orderBy(asc(servicesTable.sortOrder));
  res.json(services.map(toDto));
});

router.post("/services", async (req, res) => {
  const body = CreateServiceBody.parse(req.body);
  const [service] = await db.insert(servicesTable).values({
    name: body.name,
    description: body.description,
    icon: body.icon ?? "wrench",
    active: body.active ?? true,
    sortOrder: body.sortOrder ?? 999,
  }).returning();
  res.status(201).json(toDto(service));
});

router.patch("/services/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const body = UpdateServiceBody.parse(req.body);
  const updates: Partial<typeof servicesTable.$inferInsert> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.description !== undefined) updates.description = body.description;
  if (body.icon !== undefined) updates.icon = body.icon;
  if (body.active !== undefined) updates.active = body.active;
  if (body.sortOrder !== undefined) updates.sortOrder = body.sortOrder;
  const [service] = await db.update(servicesTable).set(updates).where(eq(servicesTable.id, id)).returning();
  res.json(toDto(service));
});

router.delete("/services/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await db.delete(servicesTable).where(eq(servicesTable.id, id));
  res.status(204).send();
});

export default router;
