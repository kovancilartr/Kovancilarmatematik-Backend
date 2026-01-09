import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import subjectRoutes from "./routes/subject.routes";
import lessonRoutes from "./routes/lesson.routes";
import materialRoutes from "./routes/material.routes";
import learningObjectiveRoutes from "./routes/learningObjective.routes";
import questionRoutes from "./routes/question.routes";
import testRoutes from "./routes/test.routes";
import testAssignmentRoutes from "./routes/testAssignment.routes"; // NEW
import userRoutes from "./routes/user.routes"; // NEW: User Management
import uploadRoutes from "./routes/uploadRoutes";

// Import middleware
import { errorHandler } from "./middleware/error.middleware";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan("combined")); // Logging
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Static files - uploads klasörünü serve et
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "KovancilarMatematik Backend API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API routes
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "KovancilarMatematik API v1.0.0",
    endpoints: {
      health: "/health",
      api: "/api",
      auth: "/api/auth",
      categories: "/api/categories",
      subjects: "/api/subjects",
      lessons: "/api/lessons",
      materials: "/api/materials",
      learningObjectives: "/api/learning-objectives",
      questions: "/api/questions",
      tests: "/api/tests",
      assignments: "/api/assignments", // NEW
      users: "/api/users", // NEW
      upload: "/api/upload",
    },
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Category routes
app.use("/api/categories", categoryRoutes);

// Subject routes
app.use("/api/subjects", subjectRoutes);

// Lesson routes
app.use("/api/lessons", lessonRoutes);

// Material routes
app.use("/api/materials", materialRoutes);

// Learning Objective routes
app.use("/api/learning-objectives", learningObjectiveRoutes);

// Question routes
app.use("/api/questions", questionRoutes);

// Test routes
app.use("/api/tests", testRoutes);

// Test Assignment routes // NEW
app.use("/api/assignments", testAssignmentRoutes);

// User Management routes // NEW
app.use("/api/users", userRoutes);

// Upload routes
app.use("/api/upload", uploadRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Endpoint ${req.method} ${req.originalUrl} not found`,
    },
    timestamp: new Date().toISOString(),
  });
});

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 KovancilarMatematik Backend server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`📚 Categories endpoints: http://localhost:${PORT}/api/categories`);
  console.log(`💡 Subjects endpoints: http://localhost:${PORT}/api/subjects`);
  console.log(`🎓 Lessons endpoints: http://localhost:${PORT}/api/lessons`);
  console.log(`📄 Materials endpoints: http://localhost:${PORT}/api/materials`);
  console.log(`🎯 Learning Objectives endpoints: http://localhost:${PORT}/api/learning-objectives`);
  console.log(`❓ Questions endpoints: http://localhost:${PORT}/api/questions`);
  console.log(`📝 Tests endpoints: http://localhost:${PORT}/api/tests`);
  console.log(`📨 Assignments endpoints: http://localhost:${PORT}/api/assignments`); // NEW
  console.log(`👥 Users endpoints: http://localhost:${PORT}/api/users`); // NEW
  console.log(`📁 Upload routes: http://localhost:${PORT}/api/upload`);
  console.log(`🖼️  Static files: http://localhost:${PORT}/uploads`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;