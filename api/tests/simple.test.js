import express from "express";
import request from "supertest";

const app = express();

app.post("/test", (req, res) => {
  res.status(200).send("Test route working!");
});

describe("Simple Test", () => {
  it("should return 200 on /test route", async () => {
    const res = await request(app).post("/test");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Test route working!");
  });
});
