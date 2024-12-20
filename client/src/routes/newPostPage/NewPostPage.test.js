import React from 'react';

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import NewPostPage from "./NewPostPage";
import apiRequest from "../../lib/apiRequest";

// Mock the apiRequest module
jest.mock("../../lib/apiRequest");

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("NewPostPage Component", () => {
  beforeEach(() => {
    render(
      <Router>
        <NewPostPage />
      </Router>
    );
  });

  it("renders the form elements", () => {
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("handles form submission successfully", async () => {
    const mockPostData = { id: "12345" };
    apiRequest.post.mockResolvedValueOnce({ data: mockPostData });

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: "500000" },
    });
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: "Test City" },
    });
    fireEvent.change(screen.getByLabelText(/bedroom/i), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByLabelText(/bathroom/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText(/latitude/i), {
      target: { value: "40.7128" },
    });
    fireEvent.change(screen.getByLabelText(/longitude/i), {
      target: { value: "-74.0060" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() => {
      expect(apiRequest.post).toHaveBeenCalledWith("/posts", expect.any(Object));
      expect(mockNavigate).toHaveBeenCalledWith("/12345");
    });
  });

  it("displays an error message when submission fails", async () => {
    apiRequest.post.mockRejectedValueOnce(new Error("Failed to create post"));

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: "500000" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() =>
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    );
  });
});
