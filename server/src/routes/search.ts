import { FastifyInstance } from "fastify";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export async function searchRoutes(app: FastifyInstance) {
  app.get("/api/search", { preHandler: requireAuth }, async (req, reply) => {
    const q = ((req.query as { q?: string }).q ?? "").trim();
    if (!q) return reply.send([]);
    const cards = await prisma.card.findMany({
      where: {
        archived: false,
        title: { contains: q },
        column: { board: { userId: req.session.userId! } },
      },
      include: {
        column: { include: { board: { select: { id: true, title: true } } } },
      },
      take: 20,
    });
    return reply.send(cards);
  });
}
