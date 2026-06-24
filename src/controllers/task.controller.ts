import { Response, NextFunction } from "express"
import { prisma } from "../lib/prisma"
import { AuthRequest } from "../middleware/auth.middleware"
import { TaskStatus, Priority } from "@prisma/client"

export async function getTasks(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, priority, page, limit } = req.query as unknown as {
      status?: TaskStatus
      priority?: Priority
      page: number
      limit: number
    }

    const where = {
      userId: req.userId!,
      ...(status && { status }),
      ...(priority && { priority }),
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.task.count({ where }),
    ])

    res.json({
      data: tasks,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    })
  } catch (err) {
    next(err)
  }
}

export async function getTaskById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.userId! },
    })

    if (!task) {
      res.status(404).json({ error: "Task not found" })
      return
    }

    res.json({ data: task })
  } catch (err) {
    next(err)
  }
}

export async function createTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await prisma.task.create({
      data: { ...req.body, userId: req.userId! },
    })

    res.status(201).json({ data: task })
  } catch (err) {
    next(err)
  }
}

export async function updateTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.userId! },
    })

    if (!existing) {
      res.status(404).json({ error: "Task not found" })
      return
    }

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: req.body,
    })

    res.json({ data: task })
  } catch (err) {
    next(err)
  }
}

export async function deleteTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.userId! },
    })

    if (!existing) {
      res.status(404).json({ error: "Task not found" })
      return
    }

    await prisma.task.delete({ where: { id: req.params.id } })

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function getStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const [todo, inProgress, done, total] = await Promise.all([
      prisma.task.count({ where: { userId: req.userId!, status: "TODO" } }),
      prisma.task.count({ where: { userId: req.userId!, status: "IN_PROGRESS" } }),
      prisma.task.count({ where: { userId: req.userId!, status: "DONE" } }),
      prisma.task.count({ where: { userId: req.userId! } }),
    ])

    res.json({
      data: { total, todo, inProgress, done, completionRate: total ? Math.round((done / total) * 100) : 0 },
    })
  } catch (err) {
    next(err)
  }
}
