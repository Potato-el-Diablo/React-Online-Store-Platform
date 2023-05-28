import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import {doc, updateDoc} from 'firebase/firestore';
import { MemoryRouter } from "react-router-dom";
import SellerProductCard from "./SellerProductCard";

const defaultProps = {
    grid: "col3",
    productImage: "test-image.jpg",
    brand: "Test Brand",
    productName: "Test Product",
    productDescription: "Test Description",
    productPrice: "R100",
    productStock: "10",
    editOnClick: jest.fn(),
    removeOnClick: jest.fn(),
    viewOnClick: jest.fn(),
};

describe("SellerProductCard Component", () => {
    it("renders without crashing", () => {
        render(
            <MemoryRouter>
                <SellerProductCard {...defaultProps} />
            </MemoryRouter>
        );
    });

    it("handles sale creation and removal", async () => {
        render(
            <MemoryRouter>
                <SellerProductCard {...defaultProps} />
            </MemoryRouter>
        );

        // try to create a sale
        const createSaleButton = screen.getByText("Create Sale");
        fireEvent.click(createSaleButton);

        const salePriceInput = screen.getByPlaceholderText("Sale price:");
        fireEvent.change(salePriceInput, { target: { value: '50' } });

        const submitSaleButton = screen.getByText("Submit Sale");
        fireEvent.click(submitSaleButton);

        // Check if the Firestore updateDoc method was called correctly
        expect(updateDoc).toHaveBeenCalledWith(doc(), { sale: '50' });

        // Now, remove the sale
        const removeSaleButton = screen.getByText("Remove Sale");
        fireEvent.click(removeSaleButton);

        // Check if the Firestore updateDoc method was called correctly
        expect(updateDoc).toHaveBeenCalledWith(doc(), { sale: '' });
    });

    //Tests for rendering all the correct items
    it("displays the correct content", () => {
        render(
            <MemoryRouter>
                <SellerProductCard {...defaultProps} />
            </MemoryRouter>
        );
        const brandElement = screen.getByText("Test Brand");
        expect(brandElement).toBeInTheDocument();

        const productNameElement = screen.getByText("Test Product");
        expect(productNameElement).toBeInTheDocument();

        const productDescriptionElement = screen.getByText("Test Description");
        expect(productDescriptionElement).toBeInTheDocument();

        const productPriceElement = screen.getByText(`R${defaultProps.productPrice}`);
        expect(productPriceElement).toBeInTheDocument();

        const productStockElement = screen.getByText(`Stock Available: ${defaultProps.productStock}`);
        expect(productStockElement).toBeInTheDocument();

        const viewAnalyticsButton = screen.getByText("View Analytics");
        expect(viewAnalyticsButton).toBeInTheDocument();

        const updateProductButton = screen.getByText("Update Product");
        expect(updateProductButton).toBeInTheDocument();

        const removeProductButton = screen.getByText("Remove Product");
        expect(removeProductButton).toBeInTheDocument();
    });

    //the product's image is correctly adjusted
    it("renders the product image with correct src and alt attributes", () => {
        render(
            <MemoryRouter>
                <SellerProductCard {...defaultProps} />
            </MemoryRouter>
        );
        const productImageElement = screen.getByAltText("product image");
        expect(productImageElement).toBeInTheDocument();
        expect(productImageElement).toHaveAttribute("src", "test-image.jpg");
    });

    it("calls the onClick handlers when buttons are clicked", () => {
        render(
            <MemoryRouter>
                <SellerProductCard {...defaultProps} />
            </MemoryRouter>
        );
        const viewAnalyticsButton = screen.getByText("View Analytics");
        fireEvent.click(viewAnalyticsButton);
        expect(defaultProps.viewOnClick).toHaveBeenCalledTimes(1);

        const updateProductButton = screen.getByText("Update Product");
        fireEvent.click(updateProductButton);
        expect(defaultProps.editOnClick).toHaveBeenCalledTimes(1);

        const removeProductButton = screen.getByText("Remove Product");
        fireEvent.click(removeProductButton);
        expect(defaultProps.removeOnClick).toHaveBeenCalledTimes(1);
    });
});
