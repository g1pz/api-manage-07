import { Response, NextFunction } from "express"
import bcrypt from "bcryptjs"
import { prisma } from "../lib/prisma"
import { AuthRequest } from "../middleware/auth.middleware"

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      select: { id: true, email: true, name: true, createdAt: true },
    })

    if (!user) {
      res.status(404).json({ error: "User not found" })
      return
    }

    res.json({ data: user })
  } catch (err) {
    next(err)
  }
}

export async function updateMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, password } = req.body
    const updateData: { name?: string; password?: string } = {}

    if (name) updateData.name = name
    if (password) updateData.password = await bcrypt.hash(password, 12)

    const user = await prisma.user.update({
      where: { id: req.userId! },
      data: updateData,
      select: { id: true, email: true, name: true, createdAt: true },
    })

    res.json({ data: user })
  } catch (err) {
    next(err)
  }
}
