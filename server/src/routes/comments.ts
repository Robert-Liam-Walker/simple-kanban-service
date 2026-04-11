import { FastifyInstance } from "fastify";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export async function commentRoutes(app: FastifyInstance) {
  app.get("/api/cards/:cardId/comments", { preHandler: requireAuth }, async (req, reply) => {
    const cardId = parseInt((req.params as { cardId: string }).cardId);
    const comments = await prisma.comment.findMany({
      where: { cardId, card: { column: { board: { userId: req.session.userId! } } } },
      orderBy: { createdAt: "asc" },
      include: { user: { select: { id: true, username: true } } },
    });
    return reply.send(comments);
  });

  app.post("/api/cards/:cardId/comments", { preHandler: requireAuth }, async (req, reply) => {
    const cardId = parseInt((req.params as { cardId: string }).cardId);
    const { body } = req.body as { body: string };
    if (!body) return reply.status(400).send({ error: "Body required" });
    const card = await prisma.card.findFirst({ where: { id: cardId, column: { board: { userId: req.session.userId! } } } });
    if (!card) return reply.status(404).send({ error: "Card not found" });
    const comment = await prisma.comment.create({
      data: { body, cardId, userId: req.session.userId! },
      include: { user: { select: { id: true, username: true } } },
    });
    await prisma.activity.create({ data: { cardId, action: "commented" } });
    return reply.status(201).send(comment);
  });

  app.delete("/api/comments/:id", { preHandler: requireAuth }, async (req, reply) => {
    const id = parseInt((req.params as { id: string }).id);
    const comment = await prisma.comment.findFirst({ where: { id, userId: req.session.userId! } });
    if (!comment) return reply.status(404).send({ error: "Comment not found" });
    await prisma.comment.delete({ where: { id } });
    return reply.send({ ok: true });
  });
}
