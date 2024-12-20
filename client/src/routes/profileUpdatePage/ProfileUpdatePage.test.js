import React from 'react';

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ProfileUpdatePage from "./profileUpdatePage";
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

describe("ProfileUpdatePage Component", () => {
  const currentUser = {
    id: "123",
    username: "testuser",
    email: "testuser@example.com",
    avatar: "/avatar.jpg",
  };

  beforeEach(() => {
    render(
      <Router>
        <AuthContext.Provider value={{ currentUser, updateUser: mockUpdateUser }}>
          <ProfileUpdatePage />
        </AuthContext.Provider>
      </Router>
    );
  });

  it("renders the update form with the current user's details", () => {
    expect(screen.getByLabelText(/username/i)).toHaveValue("testuser");
    expect(screen.getByLabelText(/email/i)).toHaveValue("testuser@example.com");
    expect(screen.getByRole("img")).toHaveAttribute("src", "/avatar.jpg");
  });

  it("handles form submission successfully", async () => {
    const mockResponseData = {
      ...currentUser,
      username: "updateduser",
      email: "updated@example.com",
    };
    apiRequest.put.mockResolvedValueOnce({ data: mockResponseData });

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "updateduser" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "updated@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "newpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(apiRequest.put).toHaveBeenCalledWith(`/users/${currentUser.id}`, {
        username: "updateduser",
        email: "updated@example.com",
        password: "newpassword",
        avatar: undefined,
      });
      expect(mockUpdateUser).toHaveBeenCalledWith(mockResponseData);
      expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });
  });

  it("displays an error message when the update fails", async () => {
    apiRequest.put.mockRejectedValueOnce({
      response: { data: { message: "Failed to update profile" } },
    });

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() =>
      expect(screen.getByText(/failed to update profile/i)).toBeInTheDocument()
    );
  });

  it("handles avatar upload", async () => {
    const uploadWidget = screen.getByRole("img");

    fireEvent.change(uploadWidget, {
      target: { files: ["new-avatar.jpg"] },
    });

    // Simulate avatar upload (mocking UploadWidget functionality)
    await waitFor(() => {
      expect(screen.getByRole("img")).toHaveAttribute("src", "new-avatar.jpg");
    });
  });
});
