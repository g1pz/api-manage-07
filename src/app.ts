import express from "express"
import cors from "cors"
import helmet from "helmet"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./swagger"
import authRoutes from "./routes/auth.routes"
import taskRoutes from "./routes/task.routes"
import userRoutes from "./routes/user.routes"
import { errorHandler } from "./middleware/error.middleware"

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(helmet({ contentSecurityPolicy: false })) // csp off so swagger ui loads fine
app.use(express.json())

app.get("/", (req, res) => {
  res.json({
    name: "Task Manager API",
    version: "1.0.0",
    docs: "/api/docs",
    endpoints: {
      auth: ["/api/auth/register", "/api/auth/login"],
      tasks: ["/api/tasks", "/api/tasks/:id", "/api/tasks/stats"],
      users: ["/api/users/me"],
    },
  })
})

app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/users", userRoutes)
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
  console.log(`Docs: http://localhost:${PORT}/api/docs`)
})

export default app
