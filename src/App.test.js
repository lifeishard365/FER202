import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the home page and navigation", () => {
  render(<App />);

  expect(screen.getByText(/Trang chủ/i)).toBeInTheDocument();
  expect(screen.getByText(/Class 1234/i)).toBeInTheDocument();
});
