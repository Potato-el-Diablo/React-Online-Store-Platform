import React from "react";
import { render, screen } from "@testing-library/react";
import Contact from "./Contact";

describe("Contact Component", () => {
    it("renders without crashing", () => {
        render(<Contact />);
    });
});
