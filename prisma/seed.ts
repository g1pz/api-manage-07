import { PrismaClient, TaskStatus, Priority } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("seeding...")

  await prisma.task.deleteMany()
  await prisma.user.deleteMany()

  const hashed = await bcrypt.hash("password123", 12)

  const alice = await prisma.user.create({
    data: { email: "alice@example.com", name: "Alice Johnson", password: hashed },
  })

  const bob = await prisma.user.create({
    data: { email: "bob@example.com", name: "Bob Smith", password: hashed },
  })

  const tasks = [
    { title: "Set up CI/CD pipeline", description: "Configure GitHub Actions for automated deploys", status: TaskStatus.DONE, priority: Priority.HIGH, userId: alice.id },
    { title: "Write API documentation", description: "Document all endpoints using Swagger", status: TaskStatus.IN_PROGRESS, priority: Priority.HIGH, userId: alice.id },
    { title: "Add rate limiting", description: "Protect endpoints from abuse", status: TaskStatus.TODO, priority: Priority.MEDIUM, userId: alice.id },
    { title: "Refactor auth middleware", status: TaskStatus.DONE, priority: Priority.LOW, userId: alice.id },
    { title: "Add unit tests", description: "Cover controllers with jest tests", status: TaskStatus.TODO, priority: Priority.HIGH, userId: alice.id },
    { title: "Database indexing", description: "Add indexes on userId and status fields", status: TaskStatus.IN_PROGRESS, priority: Priority.MEDIUM, userId: alice.id },
    { title: "Design dashboard mockup", status: TaskStatus.TODO, priority: Priority.LOW, userId: bob.id },
    { title: "Migrate to TypeScript", description: "Convert remaining JS files to TS", status: TaskStatus.DONE, priority: Priority.MEDIUM, userId: bob.id },
    { title: "Fix login bug", description: "Token expiry not handled correctly", status: TaskStatus.DONE, priority: Priority.HIGH, userId: bob.id },
    { title: "Update dependencies", status: TaskStatus.TODO, priority: Priority.LOW, userId: bob.id },
  ]

  for (const task of tasks) {
    await prisma.task.create({ data: task })
  }

  console.log(`created 2 users and ${tasks.length} tasks`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
