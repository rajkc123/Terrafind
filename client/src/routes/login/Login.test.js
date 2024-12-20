import React from 'react';

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "./login";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

// Mock the apiRequest module
jest.mock("../../lib/apiRequest");

const mockUpdateUser = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Login Component", () => {
  beforeEach(() => {
    render(
      <Router>
        <AuthContext.Provider value={{ updateUser: mockUpdateUser }}>
          <Login />
        </AuthContext.Provider>
      </Router>
    );
  });

  it("renders the login form", () => {
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("displays an error when the login fails", async () => {
    apiRequest.post.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    );
  });

  it("navigates to the home page on successful login", async () => {
    const mockUserData = { id: 1, username: "testuser" };
    apiRequest.post.mockResolvedValueOnce({ data: mockUserData });

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "correctpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith(mockUserData);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("shows a loading state while logging in", () => {
    apiRequest.post.mockReturnValue(new Promise(() => {})); // Mock a pending promise

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "correctpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();
  });
});
