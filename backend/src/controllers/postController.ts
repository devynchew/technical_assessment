import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import fs from "fs";
import csvParser from "csv-parser";

const prisma = new PrismaClient();

// Validation Schema
const RowSchema = z.object({
  postId: z.coerce.number(),
  id: z.coerce.number(),
  name: z.string().min(1),
  email: z.string().email(),
  body: z.string().optional(),
});

// Define the exact keys expected
const EXPECTED_HEADERS = ["postId", "id", "name", "email", "body"];

// Upload csv endpoint
export const uploadPost = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const results: any[] = [];
  const errors: any[] = [];

  // Guard Flag to check if csv file is correct
  let validationError: string | null = null;

  const stream = fs.createReadStream(req.file.path).pipe(
    csvParser({
      mapHeaders: ({ header }) =>
        header
          .trim()
          .replace(/^"|"$/g, "")
          .replace(/^\uFEFF/, ""),
    }),
  );

  stream
    .on("headers", (headers: string[]) => {
      // Check if headers match expected
      const missing = EXPECTED_HEADERS.filter((h) => !headers.includes(h));
      if (missing.length > 0) {
        validationError = `Invalid CSV. Missing columns: ${missing.join(", ")}`;

        // Stop reading the file immediately
        stream.destroy();

        // Delete the temp file
        fs.unlinkSync(req.file!.path);

        return res.status(400).json({
          error: validationError,
          detail: "Please use the sample CSV format provided.",
        });
      }
    })
    .on("data", (rawRow) => {
      // Stop processing if we already failed
      if (validationError) return;

      // Validate row
      const validation = RowSchema.safeParse(rawRow);

      if (validation.success) {
        // Map CSV fields to prisma fields
        results.push({
          externalId: validation.data.id, // Map CSV 'id' to 'externalId'
          postId: validation.data.postId,
          name: validation.data.name,
          email: validation.data.email,
          body: validation.data.body || "",
        });
      } else {
        errors.push({ row: rawRow, error: validation.error });
      }
    })
    .on("end", async () => {
      // Don't save to DB if we failed
      if (validationError) return;

      // Pause for 3 seconds to see the upload progress
      if (process.env.NODE_ENV !== "test") {
        console.log("Simulating slow processing...");
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      try {
        const BATCH_SIZE = 1000;
        for (let i = 0; i < results.length; i += BATCH_SIZE) {
          const batch = results.slice(i, i + BATCH_SIZE);
          await prisma.post.createMany({ data: batch });
        }

        fs.unlinkSync(req.file!.path);

        res.json({
          message: "Upload processed",
          successCount: results.length,
          errorCount: errors.length,
        });
      } catch (e) {
        // Only cleanup if file still exists
        if (fs.existsSync(req.file!.path)) fs.unlinkSync(req.file!.path);
        res.status(500).json({ error: "Database error" });
      }
    })
    // Handle Stream Errors (e.g. if destroy() triggers an error event)
    .on("error", (err) => {
      if (!validationError) res.status(500).json({ error: "Stream error" });
    });
};

// List & Search Endpoint
export const getPosts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const search = (req.query.search as string) || "";
  const limit = 20;

  const whereClause = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { body: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [data, total] = await prisma.$transaction([
    prisma.post.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: "asc" },
    }),
    prisma.post.count({ where: whereClause }),
  ]);

  res.json({ data, total, page, pages: Math.ceil(total / limit) });
};

// Clear data endpoint
export const clearPosts = async (req: Request, res: Response) => {
  await prisma.post.deleteMany({});
  res.json({ message: "All data cleared" });
};
