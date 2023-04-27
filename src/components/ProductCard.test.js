import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "./ProductCard";

const defaultProps = {
    grid: "col-3",
    productImage: "test-image.jpg",
    brand: "Test Brand",
    productName: "Test Product",
    productDescription: "Test Description",
    productPrice: "100",
    productStock: "10",
};

describe("ProductCard Component", () => {
    it("renders the product card with given props", () => {
        render(
            <MemoryRouter>
                <ProductCard {...defaultProps} />
            </MemoryRouter>
        );

        expect(screen.getByText(defaultProps.brand)).toBeInTheDocument();
        expect(screen.getByText(defaultProps.productName)).toBeInTheDocument();
        expect(screen.getByText(`R ${defaultProps.productPrice}`)).toBeInTheDocument();
    });

    it("renders the product image with correct src and alt attributes", () => {
        render(
            <MemoryRouter>
                <ProductCard {...defaultProps} />
            </MemoryRouter>
        );
        const productImageElement = screen.getByAltText(defaultProps.productName);
        expect(productImageElement).toBeInTheDocument();
        expect(productImageElement).toHaveAttribute("src", defaultProps.productImage);
    });

    it("renders truncated product name if it's too long", () => {
        const longProductName = "This is a very long product name that should be truncated";
        render(
            <MemoryRouter>
                <ProductCard {...defaultProps} productName={longProductName} />
            </MemoryRouter>
        );
        const truncatedProductName = screen.getByText(longProductName.substring(0, 25) + "...");
        expect(truncatedProductName).toBeInTheDocument();
    });
    it("renders the add to cart label", () => {
        render(
            <MemoryRouter>
                <ProductCard {...defaultProps} />
            </MemoryRouter>
        );

        expect(screen.getByText("Add to Cart")).toBeInTheDocument();
    });

    it("renders the wishlist icon", () => {
        render(
            <MemoryRouter>
                <ProductCard {...defaultProps} />
            </MemoryRouter>
        );

        const wishlistIcon = screen.getByAltText("wishlist");
        expect(wishlistIcon).toBeInTheDocument();
    });

    it("renders the product card with the correct grid class", () => {
        render(
            <MemoryRouter>
                <ProductCard {...defaultProps} />
            </MemoryRouter>
        );

        const productCard = screen.getByTestId("product-card");
        expect(productCard).toHaveClass(`${defaultProps.grid}`);
    });
});
