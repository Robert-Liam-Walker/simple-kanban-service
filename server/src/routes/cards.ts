import { FastifyInstance } from "fastify";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

async function getCardWithOwner(cardId: number, userId: number) {
  return prisma.card.findFirst({
    where: { id: cardId, column: { board: { userId } } },
  });
}

export async function cardRoutes(app: FastifyInstance) {
  app.post("/api/columns/:columnId/cards", { preHandler: requireAuth }, async (req, reply) => {
    const columnId = parseInt((req.params as { columnId: string }).columnId);
    const { title } = req.body as { title: string };
    if (!title) return reply.status(400).send({ error: "Title required" });
    const column = await prisma.column.findFirst({ where: { id: columnId }, include: { board: true } });
    if (!column || column.board.userId !== req.session.userId!) {
      return reply.status(404).send({ error: "Column not found" });
    }
    const last = await prisma.card.findFirst({ where: { columnId }, orderBy: { position: "desc" } });
    const card = await prisma.card.create({
      data: { title, position: (last?.position ?? -1) + 1, columnId },
    });
    await prisma.activity.create({ data: { cardId: card.id, action: "created" } });
    return reply.status(201).send(card);
  });

  app.get("/api/cards/:id", { preHandler: requireAuth }, async (req, reply) => {
    const id = parseInt((req.params as { id: string }).id);
    const card = await prisma.card.findFirst({
      where: { id, column: { board: { userId: req.session.userId! } } },
      include: {
        labels: { include: { label: true } },
        comments: { orderBy: { createdAt: "asc" }, include: { user: { select: { id: true, username: true } } } },
        activity: { orderBy: { createdAt: "asc" } },
      },
    });
    if (!card) return reply.status(404).send({ error: "Card not found" });
    return reply.send(card);
  });

  app.patch("/api/cards/:id", { preHandler: requireAuth }, async (req, reply) => {
    const id = parseInt((req.params as { id: string }).id);
    const card = await getCardWithOwner(id, req.session.userId!);
    if (!card) return reply.status(404).send({ error: "Card not found" });
    const { title, description, dueDate } = req.body as {
      title?: string;
      description?: string;
      dueDate?: string | null;
    };
    const updated = await prisma.card.update({
      where: { id },
      data: { title, description, dueDate: dueDate ? new Date(dueDate) : dueDate === null ? null : undefined },
    });
    await prisma.activity.create({ data: { cardId: id, action: "updated" } });
    return reply.send(updated);
  });

  app.patch("/api/cards/:id/move", { preHandler: requireAuth }, async (req, reply) => {
    const id = parseInt((req.params as { id: string }).id);
    const card = await getCardWithOwner(id, req.session.userId!);
    if (!card) return reply.status(404).send({ error: "Card not found" });
    const { columnId, position } = req.body as { columnId: number; position: number };
    const updated = await prisma.card.update({ where: { id }, data: { columnId, position } });
    await prisma.activity.create({ data: { cardId: id, action: "moved", detail: `to column ${columnId}` } });
    return reply.send(updated);
  });

  app.patch("/api/cards/:id/archive", { preHandler: requireAuth }, async (req, reply) => {
    const id = parseInt((req.params as { id: string }).id);
    const card = await getCardWithOwner(id, req.session.userId!);
    if (!card) return reply.status(404).send({ error: "Card not found" });
    const updated = await prisma.card.update({ where: { id }, data: { archived: true } });
    return reply.send(updated);
  });

  app.delete("/api/cards/:id", { preHandler: requireAuth }, async (req, reply) => {
    const id = parseInt((req.params as { id: string }).id);
    const card = await getCardWithOwner(id, req.session.userId!);
    if (!card) return reply.status(404).send({ error: "Card not found" });
    await prisma.card.delete({ where: { id } });
    return reply.send({ ok: true });
  });

  // Labels on cards
  app.post("/api/cards/:id/labels", { preHandler: requireAuth }, async (req, reply) => {
    const cardId = parseInt((req.params as { id: string }).id);
    const { labelId } = req.body as { labelId: number };
    const card = await getCardWithOwner(cardId, req.session.userId!);
    if (!card) return reply.status(404).send({ error: "Card not found" });
    await prisma.cardLabel.upsert({
      where: { cardId_labelId: { cardId, labelId } },
      update: {},
      create: { cardId, labelId },
    });
    return reply.send({ ok: true });
  });

  app.delete("/api/cards/:id/labels/:labelId", { preHandler: requireAuth }, async (req, reply) => {
    const cardId = parseInt((req.params as { id: string; labelId: string }).id);
    const labelId = parseInt((req.params as { id: string; labelId: string }).labelId);
    const card = await getCardWithOwner(cardId, req.session.userId!);
    if (!card) return reply.status(404).send({ error: "Card not found" });
    await prisma.cardLabel.delete({ where: { cardId_labelId: { cardId, labelId } } });
    return reply.send({ ok: true });
  });
}
