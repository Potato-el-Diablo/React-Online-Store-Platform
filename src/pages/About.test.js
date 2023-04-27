import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import About from "./About";

describe("About Component", () => {
    it("renders without crashing", () => {
        render(<About />);
    });

    it("displays the correct content", () => {
        render(<About />);
        const aboutElement = screen.getByText("About");
        expect(aboutElement).toBeInTheDocument();
    });
});
