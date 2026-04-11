import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/api/auth/register", async (req, reply) => {
    const { username, password } = req.body as { username: string; password: string };
    if (!username || !password) {
      return reply.status(400).send({ error: "Username and password required" });
    }
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return reply.status(409).send({ error: "Username already taken" });
    }
    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { username, password: hash } });
    req.session.userId = user.id;
    return reply.status(201).send({ id: user.id, username: user.username });
  });

  app.post("/api/auth/login", async (req, reply) => {
    const { username, password } = req.body as { username: string; password: string };
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }
    req.session.userId = user.id;
    return reply.send({ id: user.id, username: user.username });
  });

  app.post("/api/auth/logout", async (req, reply) => {
    await req.session.destroy();
    return reply.send({ ok: true });
  });

  app.get("/api/auth/me", async (req, reply) => {
    if (!req.session.userId) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: { id: true, username: true },
    });
    return reply.send(user);
  });
}
