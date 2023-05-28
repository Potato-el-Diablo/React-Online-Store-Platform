import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "./Footer";

describe("Footer Component", () => {
  it("renders without crashing", () => {
    render(<Footer />);
  });

  it("displays the correct content", () => {
    render(<Footer />);
    const newsletterText = screen.getByText("Sign up for newsletter");
    expect(newsletterText).toBeInTheDocument();

    const footerElement = screen.getByTestId("footer");
    expect(footerElement).toBeInTheDocument();

    const inputElement = screen.getByPlaceholderText("Enter email address here");
    expect(inputElement).toBeInTheDocument();

    const subscribeButton = screen.getByText("Subscribe");
    expect(subscribeButton).toBeInTheDocument();

    const currentYear = new Date().getFullYear();
    const poweredByText = screen.getByText(`© ${currentYear} Powered by Potato El Diablo`);
    expect(poweredByText).toBeInTheDocument();
  });

  it("renders multiple footer sections", () => {
    render(<Footer />);

    const footerSections = screen.getAllByTestId("footer");
    expect(footerSections.length).toBeGreaterThanOrEqual(2);
  });

  it("renders alternative UI when email address is invalid", () => {
    render(<Footer />);

    const inputElement = screen.getByPlaceholderText("Enter email address here");
    const subscribeButton = screen.getByText("Subscribe");

    // Trigger an invalid email address scenario
    fireEvent.change(inputElement, { target: { value: "invalidEmail" } });
    fireEvent.click(subscribeButton);

    // Add assertions for the alternative UI, such as displaying an error message
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });

  // Add more test cases to cover different scenarios or edge cases
});
