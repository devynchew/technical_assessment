import request from "supertest";
import express from "express";

import app from "../index";

describe("POST /upload", () => {
  // Normal Case
  it("should successfully upload a valid CSV and save data", async () => {
    const validCsv = `postId,id,name,email,body
    1,101,Test User,test@user.com,This is a test body`;

    const res = await request(app)
      .post("/upload")
      .attach("file", Buffer.from(validCsv), "valid.csv");

    expect(res.status).toBe(200);
    expect(res.body.successCount).toBe(1);

    // Verify it exists in the API
    const check = await request(app).get("/posts?search=Test User");
    expect(check.body.data[0].email).toBe("test@user.com");
  });

  it("should reject requests with no file", async () => {
    const res = await request(app).post("/upload");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("No file uploaded");
  });

  // Edge Case: Uploading a text file instead of CSV
  it("should handle non-csv files gracefully (or process them if logic permits)", async () => {
    const res = await request(app)
      .post("/upload")
      .attach("file", Buffer.from("just text"), "test.txt");

    // Depending on your multer config, this might pass 200 but process 0 rows
    // This asserts that the server doesn't CRASH
    expect(res.status).not.toBe(500);
  });

  // Edge Case: Uploading a csv file with incorrect headers
  it("should reject a CSV with incorrect headers", async () => {
    const invalidCsv = "Product,Price\nApple,100"; // Wrong headers

    const res = await request(app)
      .post("/upload")
      .attach("file", Buffer.from(invalidCsv), "bad_headers.csv");

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Missing columns/); // Checks for your specific error message
  });
});

describe("GET /posts", () => {
  it("should return a list of posts", async () => {
    const res = await request(app).get("/posts");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should handle search queries", async () => {
    const res = await request(app).get("/posts?search=xyz_nonexistent");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]); // Should be empty
  });
});
