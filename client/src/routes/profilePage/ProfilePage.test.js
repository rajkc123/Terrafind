import React from 'react';

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ProfilePage from "./profilePage";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

// Mock the apiRequest module
jest.mock("../../lib/apiRequest");

const mockUpdateUser = jest.fn();
const mockNavigate = jest.fn();
const mockData = {
  postResponse: {
    data: {
      userPosts: [{ id: "1", title: "Post 1" }],
      savedPosts: [{ id: "2", title: "Saved Post 1" }],
    },
  },
  chatResponse: {
    data: [{ id: "1", message: "Chat 1" }],
  },
};

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLoaderData: () => mockData,
}));

describe("ProfilePage Component", () => {
  const currentUser = {
    username: "testuser",
    email: "testuser@example.com",
    avatar: "/avatar.jpg",
  };

  beforeEach(() => {
    render(
      <Router>
        <AuthContext.Provider value={{ updateUser: mockUpdateUser, currentUser }}>
          <ProfilePage />
        </AuthContext.Provider>
      </Router>
    );
  });

  it("renders user information", () => {
    expect(screen.getByText(/user information/i)).toBeInTheDocument();
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
    expect(screen.getByText(/testuser@example.com/i)).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "/avatar.jpg");
  });

  it("handles logout", async () => {
    apiRequest.post.mockResolvedValueOnce();

    fireEvent.click(screen.getByText(/logout/i));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith(null);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("renders the user's posts and saved posts", async () => {
    await waitFor(() => {
      expect(screen.getByText(/post 1/i)).toBeInTheDocument();
      expect(screen.getByText(/saved post 1/i)).toBeInTheDocument();
    });
  });

  it("renders the user's chats", async () => {
    await waitFor(() => {
      expect(screen.getByText(/chat 1/i)).toBeInTheDocument();
    });
  });

  it("displays error messages if posts or chats fail to load", async () => {
    const errorMockData = {
      postResponse: Promise.reject(new Error("Failed to load posts")),
      chatResponse: Promise.reject(new Error("Failed to load chats")),
    };

    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useLoaderData: () => errorMockData,
    }));

    render(
      <Router>
        <AuthContext.Provider value={{ updateUser: mockUpdateUser, currentUser }}>
          <ProfilePage />
        </AuthContext.Provider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/error loading posts/i)).toBeInTheDocument();
      expect(screen.getByText(/error loading chats/i)).toBeInTheDocument();
    });
  });
});
