import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import UpdateProductModal from "./UpdateProductModal";
import {updateDoc, doc} from 'firebase/firestore';
import {auth, db} from "../pages/firebase";

// mock Firestore and Firebase Auth
jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    updateDoc: jest.fn(),
}));

jest.mock('../pages/firebase', () => ({
    auth: {
        currentUser: {email: 'test@test.com'}
    },
    db: jest.fn(),
}));

const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onProductUpdate: jest.fn(),
    productId: "1",
    productImage: "test-image.jpg",
    brand: "Test Brand",
    productName: "Test Product",
    productDescription: "Test Description",
    productTags: ["tag1", "tag2"],
    productPrice: "R100",
    productStock: "10",
};

describe("UpdateProductModal Component", () => {
    it("renders correctly", () => {
        render(
            <MemoryRouter>
                <UpdateProductModal {...defaultProps} />
            </MemoryRouter>
        );
        expect(screen.getByText("Product Brand:")).toBeInTheDocument();
        expect(screen.getByText("Product Name:")).toBeInTheDocument();
        expect(screen.getByText("Product Description")).toBeInTheDocument();
        expect(screen.getByText("Available Stock:")).toBeInTheDocument();
        expect(screen.getByText("Price R*:")).toBeInTheDocument();
    });

    it("populates the form fields with the initial props", () => {
        render(
            <MemoryRouter>
                <UpdateProductModal {...defaultProps} />
            </MemoryRouter>
        );
        expect(screen.getByDisplayValue(defaultProps.brand)).toBeInTheDocument();
        expect(screen.getByDisplayValue(defaultProps.productName)).toBeInTheDocument();
        expect(screen.getByDisplayValue(defaultProps.productDescription)).toBeInTheDocument();
        expect(screen.getByDisplayValue(defaultProps.productPrice)).toBeInTheDocument();
        expect(screen.getByDisplayValue(defaultProps.productStock)).toBeInTheDocument();
        // expect(screen.getByText("tag1")).toBeInTheDocument();
        // expect(screen.getByText("tag2")).toBeInTheDocument();
    });

    it("updates the state when form fields change", () => {
        render(
            <MemoryRouter>
                <UpdateProductModal {...defaultProps} />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Product Brand"), {
            target: { value: 'New Brand' },
        });

        fireEvent.change(screen.getByPlaceholderText("Product Name"), {
            target: { value: 'New Product' },
        });

        fireEvent.change(screen.getByPlaceholderText("XXX.cc"), {
            target: { value: 'R200' },
        });

        fireEvent.change(screen.getByLabelText("Product Description"), {
            target: { value: 'New Description' },
        });

        fireEvent.change(screen.getByLabelText("Available Stock:"), {
            target: { value: '20' },
        });

        expect(screen.getByDisplayValue('New Brand')).toBeInTheDocument();
        expect(screen.getByDisplayValue('New Product')).toBeInTheDocument();
        expect(screen.getByDisplayValue('New Description')).toBeInTheDocument();
        expect(screen.getByDisplayValue('R200')).toBeInTheDocument();
        expect(screen.getByDisplayValue('20')).toBeInTheDocument();
    });

    it("calls Firestore update and callbacks when 'Update Product' button is clicked", async () => {
        render(
            <MemoryRouter>
                <UpdateProductModal {...defaultProps} />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Update Product"));

        expect(doc).toHaveBeenCalledWith(db, 'Products', defaultProps.productId);
        expect(updateDoc).toHaveBeenCalled();

        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
        expect(defaultProps.onProductUpdate).toHaveBeenCalledTimes(1);
    });

    it("closes modal when 'Cancel' button is clicked", () => {
        render(
            <MemoryRouter>
                <UpdateProductModal {...defaultProps} />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Cancel"));

        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("does not render when open prop is false", () => {
        render(
            <MemoryRouter>
                <UpdateProductModal {...{...defaultProps, open: false}} />
            </MemoryRouter>
        );

        expect(screen.queryByText("Product Brand:")).toBeNull();
        expect(screen.queryByText("Product Name:")).toBeNull();
    });


    // continue with other tests...
});
