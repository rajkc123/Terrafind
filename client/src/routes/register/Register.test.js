import React from 'react';

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Register from "./register";
import apiRequest from "../../lib/apiRequest";

// Mock the apiRequest module
jest.mock("../../lib/apiRequest");

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Register Component", () => {
  beforeEach(() => {
    render(
      <Router>
        <Register />
      </Router>
    );
  });

  it("renders the registration form", () => {
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  it("handles form submission successfully", async () => {
    apiRequest.post.mockResolvedValueOnce({});

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "newuser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(apiRequest.post).toHaveBeenCalledWith("/auth/register", {
        username: "newuser",
        email: "newuser@example.com",
        password: "password123",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("displays an error message when registration fails", async () => {
    apiRequest.post.mockRejectedValueOnce({
      response: { data: { message: "Registration failed" } },
    });

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "newuser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() =>
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument()
    );
  });

  it("disables the register button while loading", async () => {
    apiRequest.post.mockReturnValue(new Promise(() => {})); // Mock a pending promise

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "newuser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(screen.getByRole("button", { name: /register/i })).toBeDisabled();
  });
});
