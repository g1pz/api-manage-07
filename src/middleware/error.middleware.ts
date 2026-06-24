import { Request, Response, NextFunction } from "express"
import { Prisma } from "@prisma/client"

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  // prisma unique constraint (e.g. duplicate email)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(409).json({ error: "Already exists", field: (err.meta?.target as string[])?.[0] })
      return
    }
    if (err.code === "P2025") {
      res.status(404).json({ error: "Not found" })
      return
    }
  }

  if (err instanceof Error) {
    console.error(err.message)
    res.status(500).json({ error: "Internal server error" })
    return
  }

  res.status(500).json({ error: "Internal server error" })
}
