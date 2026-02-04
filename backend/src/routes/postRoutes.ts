// src/routes/postRoutes.ts
import { Router } from "express";
import multer from "multer";
import { uploadPost, getPosts, clearPosts } from "../controllers/postController";

const router = Router();
const upload = multer({ dest: "uploads/" });

// Define routes
router.post("/upload", upload.single("file"), uploadPost); // Route -> Middleware -> Controller
router.get("/posts", getPosts);
router.delete("/posts", clearPosts);

export default router;