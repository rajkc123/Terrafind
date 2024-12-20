import request from "supertest";
import app from "../app"; // Adjusted path based on your file structure

describe("Auth Controller", () => {
  it("should return 200 for a successful login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        username: "testuser",
        password: "testpassword",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should return 401 for an incorrect login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        username: "wronguser",
        password: "wrongpassword",
      });

    expect(res.statusCode).toEqual(401);
  });
});
