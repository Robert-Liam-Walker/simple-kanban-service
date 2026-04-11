import { FastifyInstance } from "fastify";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export async function columnRoutes(app: FastifyInstance) {
  app.post("/api/boards/:boardId/columns", { preHandler: requireAuth }, async (req, reply) => {
    const boardId = parseInt((req.params as { boardId: string }).boardId);
    const { title } = req.body as { title: string };
    if (!title) return reply.status(400).send({ error: "Title required" });
    const board = await prisma.board.findFirst({ where: { id: boardId, userId: req.session.userId! } });
    if (!board) return reply.status(404).send({ error: "Board not found" });
    const last = await prisma.column.findFirst({ where: { boardId }, orderBy: { position: "desc" } });
    const column = await prisma.column.create({ data: { title, position: (last?.position ?? -1) + 1, boardId } });
    return reply.status(201).send(column);
  });

  app.patch("/api/columns/:id", { preHandler: requireAuth }, async (req, reply) => {
    const id = parseInt((req.params as { id: string }).id);
    const { title, position } = req.body as { title?: string; position?: number };
    const column = await prisma.column.findFirst({
      where: { id },
      include: { board: true },
    });
    if (!column || column.board.userId !== req.session.userId!) {
      return reply.status(404).send({ error: "Column not found" });
    }
    const updated = await prisma.column.update({ where: { id }, data: { title, position } });
    return reply.send(updated);
  });

  app.delete("/api/columns/:id", { preHandler: requireAuth }, async (req, reply) => {
    const id = parseInt((req.params as { id: string }).id);
    const column = await prisma.column.findFirst({ where: { id }, include: { board: true } });
    if (!column || column.board.userId !== req.session.userId!) {
      return reply.status(404).send({ error: "Column not found" });
    }
    await prisma.column.delete({ where: { id } });
    return reply.send({ ok: true });
  });
}
