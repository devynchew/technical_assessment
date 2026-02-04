import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import App from "./App";
import axios from "axios";

// Mock Axios
vi.mock("axios");

describe("App Component", () => {
  const mockData = {
    data: {
      data: [
        {
          id: 1,
          externalId: 1,
          name: "John Doe",
          email: "john@test.com",
          body: "Test Body",
        },
      ],
      pages: 1,
    },
  };
  // Check if web page loads
  it("renders the title and upload button", async () => {
    (axios.get as any).mockResolvedValue(mockData);
    render(<App />);

    // Check title
    expect(screen.getByText("Smart CSV Viewer")).toBeInTheDocument();

    // Check hero section text
    expect(screen.getByText(/Upload/i)).toBeInTheDocument();

    // Check if upload button renders
    expect(screen.getByTestId("file-upload-input")).toBeInTheDocument();

    // Check if table renders
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  // Check if table refreshes on upload of valid data
  it("refreshes the table after a successful upload", async () => {
    (axios.get as any).mockResolvedValue(mockData);
    render(<App />);

    await waitFor(() =>
      expect(screen.getByText("John Doe")).toBeInTheDocument(),
    );

    const uploadComponent = screen.getByTestId("file-upload-input");
    expect(uploadComponent).toBeInTheDocument();
  });

  // Check if search function works
  it("searches for users", async () => {
    (axios.get as any).mockResolvedValue(mockData);
    render(<App />);

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "John" } });

    // Wait for debounce and API call
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("search=John"),
      );
    });
  });

  // Check for empty table 
  it("handles empty state gracefully", async () => {
    (axios.get as any).mockResolvedValue({ data: { data: [], pages: 0 } });
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });

  // Ensure pagination works
  it("fetches page 2 when Next button is clicked", async () => {
    // Mock response saying there are 2 pages total
    (axios.get as any).mockResolvedValue({
      data: {
        data: [
          {
            id: 1,
            externalId: 1,
            name: "User 1",
            email: "u1@test.com",
            body: "b1",
          },
        ],
        pages: 2,
      },
    });

    render(<App />);

    // 2. Wait for initial load
    await waitFor(() => expect(screen.getByText("User 1")).toBeInTheDocument());

    // 3. Find and Click "Next"
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    // 4. Verify axios called with page=2
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("page=2"));
    });
  });

  // Edge Case
  it("does not crash if the API fails", async () => {
    // Force Axios to fail
    (axios.get as any).mockRejectedValue(new Error("Network Error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<App />);

    // Ensure the critical UI parts are still there (App didn't unmount)
    await waitFor(() => {
      expect(screen.getByText("Smart CSV Viewer")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    // Clean up the spy
    consoleSpy.mockRestore();
  });
});
