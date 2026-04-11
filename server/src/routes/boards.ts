import { FastifyInstance } from "fastify";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export async function boardRoutes(app: FastifyInstance) {
  app.get("/api/boards", { preHandler: requireAuth }, async (req, reply) => {
    const boards = await prisma.board.findMany({
      where: { userId: req.session.userId! },
      orderBy: { createdAt: "asc" },
      include: { _count: { select: { columns: true } } },
    });
    return reply.send(boards);
  });

  app.post("/api/boards", { preHandler: requireAuth }, async (req, reply) => {
    const { title, color } = req.body as { title: string; color?: string };
    if (!title) return reply.status(400).send({ error: "Title required" });
    const board = await prisma.board.create({
      data: { title, color: color ?? "#0052cc", userId: req.session.userId! },
    });
    // Create default columns
    await prisma.column.createMany({
      data: [
        { title: "To Do", position: 0, boardId: board.id },
        { title: "In Progress", position: 1, boardId: board.id },
        { title: "Done", position: 2, boardId: board.id },
      ],
    });
    return reply.status(201).send(board);
  });

  app.get("/api/boards/:id", { preHandler: requireAuth }, async (req, reply) => {
    const id = parseInt((req.params as { id: string }).id);
    const board = await prisma.board.findFirst({
      where: { id, userId: req.session.userId! },
      include: {
        labels: true,
        columns: {
          orderBy: { position: "asc" },
          include: {
            cards: {
              where: { archived: false },
              orderBy: { position: "asc" },
              include: { labels: { include: { label: true } } },
            },
          },
        },
      },
    });
    if (!board) return reply.status(404).send({ error: "Board not found" });
    return reply.send(board);
  });

  app.patch("/api/boards/:id", { preHandler: requireAuth }, async (req, reply) => {
    const id = parseInt((req.params as { id: string }).id);
    const { title, color } = req.body as { title?: string; color?: string };
    const board = await prisma.board.findFirst({ where: { id, userId: req.session.userId! } });
    if (!board) return reply.status(404).send({ error: "Board not found" });
    const updated = await prisma.board.update({ where: { id }, data: { title, color } });
    return reply.send(updated);
  });

  app.delete("/api/boards/:id", { preHandler: requireAuth }, async (req, reply) => {
    const id = parseInt((req.params as { id: string }).id);
    const board = await prisma.board.findFirst({ where: { id, userId: req.session.userId! } });
    if (!board) return reply.status(404).send({ error: "Board not found" });
    await prisma.board.delete({ where: { id } });
    return reply.send({ ok: true });
  });
}
