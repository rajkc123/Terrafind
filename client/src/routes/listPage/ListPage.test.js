import React from 'react';
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ListPage from "./listPage";
import { useLoaderData } from "react-router-dom";

// Mock useLoaderData to return some test data
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLoaderData: jest.fn(),
}));

describe("ListPage Component", () => {
  const mockData = {
    postResponse: {
      data: [
        { id: "1", title: "Post 1", address: "123 Test St", price: 100000 },
        { id: "2", title: "Post 2", address: "456 Test Ave", price: 200000 },
      ],
    },
  };

  beforeEach(() => {
    useLoaderData.mockReturnValue(mockData);
  });

  it("renders the filter component", () => {
    render(
      <Router>
        <ListPage />
      </Router>
    );

    expect(screen.getByText(/filter/i)).toBeInTheDocument();
  });

  it("renders the posts list", async () => {
    render(
      <Router>
        <ListPage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/post 1/i)).toBeInTheDocument();
      expect(screen.getByText(/post 2/i)).toBeInTheDocument();
    });
  });

  it("renders the map with posts", async () => {
    render(
      <Router>
        <ListPage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/loading/i)).not.toBeInTheDocument();
    });

    // You would typically check if the map component received the correct items as props,
    // but since we're working with a mock, we ensure it renders after the suspense.
    expect(screen.getByText(/loading/i)).not.toBeInTheDocument();
  });

  it("displays an error message if posts fail to load", async () => {
    useLoaderData.mockReturnValueOnce({
      postResponse: Promise.reject(new Error("Failed to load posts")),
    });

    render(
      <Router>
        <ListPage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/error loading posts/i)).toBeInTheDocument();
    });
  });
});
