import { Router, type IRouter } from "express";
import { db, servicesTable, insertServiceSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateServiceBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/services", async (_req, res) => {
  const services = await db.select().from(servicesTable).orderBy(servicesTable.id);
  res.json(services.map(s => ({
    id: s.id,
    name: s.name,
    description: s.description,
    icon: s.icon,
    active: s.active,
    createdAt: s.createdAt.toISOString(),
  })));
});

router.post("/services", async (req, res) => {
  const body = CreateServiceBody.parse(req.body);
  const [service] = await db.insert(servicesTable).values({
    name: body.name,
    description: body.description,
    icon: body.icon ?? "wrench",
    active: body.active ?? true,
  }).returning();
  res.status(201).json({
    id: service.id,
    name: service.name,
    description: service.description,
    icon: service.icon,
    active: service.active,
    createdAt: service.createdAt.toISOString(),
  });
});

router.delete("/services/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await db.delete(servicesTable).where(eq(servicesTable.id, id));
  res.status(204).send();
});

export default router;
