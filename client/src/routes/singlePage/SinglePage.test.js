import React from 'react';

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import SinglePage from "./singlePage";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useLoaderData } from "react-router-dom";

// Mock the apiRequest module
jest.mock("../../lib/apiRequest");

// Mock the useLoaderData hook to return a post
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLoaderData: () => ({
    id: "1",
    title: "Test Post",
    address: "123 Test St",
    price: 500000,
    images: ["/image1.png", "/image2.png"],
    isSaved: false,
    bedroom: 3,
    bathroom: 2,
    user: {
      avatar: "/avatar.jpg",
      username: "testuser",
    },
    postDetail: {
      desc: "<p>Test description</p>",
      utilities: "owner",
      pet: "allowed",
      income: "No restrictions",
      size: 1500,
      school: 500,
      bus: 200,
      restaurant: 300,
    },
  }),
}));

describe("SinglePage Component", () => {
  const currentUser = {
    id: "123",
    username: "currentuser",
  };

  beforeEach(() => {
    render(
      <Router>
        <AuthContext.Provider value={{ currentUser }}>
          <SinglePage />
        </AuthContext.Provider>
      </Router>
    );
  });

  it("renders the post details", () => {
    expect(screen.getByText(/test post/i)).toBeInTheDocument();
    expect(screen.getByText(/123 test st/i)).toBeInTheDocument();
    expect(screen.getByText(/\$ 500000/i)).toBeInTheDocument();
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /testuser/i })).toHaveAttribute(
      "src",
      "/avatar.jpg"
    );
    expect(screen.getByText(/test description/i)).toBeInTheDocument();
    expect(screen.getByText(/owner is responsible/i)).toBeInTheDocument();
    expect(screen.getByText(/pets allowed/i)).toBeInTheDocument();
  });

  it("handles saving the post", async () => {
    apiRequest.post.mockResolvedValueOnce({});

    fireEvent.click(screen.getByText(/save the place/i));

    await waitFor(() => {
      expect(apiRequest.post).toHaveBeenCalledWith("/users/save", {
        postId: "1",
      });
    });

    expect(screen.getByText(/place saved/i)).toBeInTheDocument();
  });

  it("handles sending a message", async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);

    fireEvent.click(screen.getByText(/send a message/i));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/profile", {
        state: { chatUserId: "123" },
      });
    });
  });

  it("redirects to login when trying to save a post without being logged in", async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);

    render(
      <Router>
        <AuthContext.Provider value={{ currentUser: null }}>
          <SinglePage />
        </AuthContext.Provider>
      </Router>
    );

    fireEvent.click(screen.getByText(/save the place/i));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("redirects to login when trying to send a message without being logged in", async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);

    render(
      <Router>
        <AuthContext.Provider value={{ currentUser: null }}>
          <SinglePage />
        </AuthContext.Provider>
      </Router>
    );

    fireEvent.click(screen.getByText(/send a message/i));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
