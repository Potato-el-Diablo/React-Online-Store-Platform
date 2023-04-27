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
        const copyrightText = screen.getByText(`© ${currentYear} Powered by Potato El Diablo`);
        expect(copyrightText).toBeInTheDocument();
    });
});
