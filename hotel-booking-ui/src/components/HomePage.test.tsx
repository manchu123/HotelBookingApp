import { render, screen } from "@testing-library/react";
import HomePage from "./HomePage";
import { axiosInstance } from "../service/axiosInstance"; // Ensure axiosInstance is properly imported
import userEvent from "@testing-library/user-event";
import React from "react";
import '@testing-library/jest-dom'; 

// Mocking Axios
jest.mock('../service/axiosInstance', () => ({
  axiosInstance: {
    get: jest.fn(),
  },
}));
// Test: Renders HomePage component
test("renders HomePage component", () => {
  render(<HomePage />);
  expect(screen.getByText(/Hotels/i)).toBeInTheDocument();
});

// Test: Location Dropdown renders correctly
test("renders location dropdown", () => {
  render(<HomePage />);
  expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
});

// Test: Clicking the "Search" button when fields are empty shows an error
test("shows error if required fields are empty", async () => {
  render(<HomePage />);

  userEvent.click(screen.getByRole("button", { name: /Search/i }));

  expect(screen.getByText(/Please fill all the required fields/i)).toBeInTheDocument();
});

// Test: Simulate API call and check if hotels are rendered
test("fetches hotels on search", async () => {
  const mockHotels = [
    { id: 1, name: "Hotel 1", location: "New York" },
    { id: 2, name: "Hotel 2", location: "Los Angeles" }
  ];

  axiosInstance.get.mockResolvedValueOnce({ data: mockHotels });

  render(<HomePage />);

  // Fill in the form
  userEvent.selectOptions(screen.getByLabelText(/Location/i), "New York");
  userEvent.type(screen.getByLabelText(/Check-in Date/i), "2023-01-01");
  userEvent.type(screen.getByLabelText(/Check-out Date/i), "2023-01-02");
  userEvent.selectOptions(screen.getByLabelText(/No of rooms/i), "1");

  userEvent.click(screen.getByRole("button", { name: /Search/i }));

  // Assert that the hotels are displayed
  expect(await screen.findByText(/Hotel 1/i)).toBeInTheDocument();
  expect(await screen.findByText(/Hotel 2/i)).toBeInTheDocument();
});
