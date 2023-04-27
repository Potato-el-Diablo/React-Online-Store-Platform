import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Add this line
import Contact from "./Contact";

describe("Contact Component", () => {
    it("renders without crashing", () => {
        render(<Contact />);
    });

    it("displays the correct content", () => {
        render(<Contact />);
        const contactElement = screen.getByText("Contact");
        expect(contactElement).toBeInTheDocument();
    });
});
