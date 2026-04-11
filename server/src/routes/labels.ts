import { FastifyInstance } from "fastify";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export async function labelRoutes(app: FastifyInstance) {
  app.get("/api/boards/:boardId/labels", { preHandler: requireAuth }, async (req, reply) => {
    const boardId = parseInt((req.params as { boardId: string }).boardId);
    const board = await prisma.board.findFirst({ where: { id: boardId, userId: req.session.userId! } });
    if (!board) return reply.status(404).send({ error: "Board not found" });
    const labels = await prisma.label.findMany({ where: { boardId } });
    return reply.send(labels);
  });

  app.post("/api/boards/:boardId/labels", { preHandler: requireAuth }, async (req, reply) => {
    const boardId = parseInt((req.params as { boardId: string }).boardId);
    const { name, color } = req.body as { name: string; color: string };
    if (!name || !color) return reply.status(400).send({ error: "Name and color required" });
    const board = await prisma.board.findFirst({ where: { id: boardId, userId: req.session.userId! } });
    if (!board) return reply.status(404).send({ error: "Board not found" });
    const label = await prisma.label.create({ data: { name, color, boardId } });
    return reply.status(201).send(label);
  });

  app.delete("/api/labels/:id", { preHandler: requireAuth }, async (req, reply) => {
    const id = parseInt((req.params as { id: string }).id);
    const label = await prisma.label.findFirst({ where: { id }, include: { board: true } });
    if (!label || label.board.userId !== req.session.userId!) {
      return reply.status(404).send({ error: "Label not found" });
    }
    await prisma.label.delete({ where: { id } });
    return reply.send({ ok: true });
  });
}
