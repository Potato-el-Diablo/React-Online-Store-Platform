import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import CartItem from "./CartItem";
import '@testing-library/jest-dom/extend-expect';


//temporary mock item to be displayed in cart for testing
const mockItem = {
    id: 1,
    image: "/images/watch.jpg",
    title: "title",
    color: "color",
    size: "size",
    price: 100,
};

// Create mock functions for onUpdateSubtotal and onRemove
const mockOnUpdateSubtotal = jest.fn((subtotal, operation) => {
    console.log('mockOnUpdateSubtotal called with subtotal:', subtotal, 'and operation:', operation);
});

const mockOnRemove = jest.fn();

describe("CartItem component", () => {
    // Test if CartItem component renders correctly with the given props
    test("renders CartItem component correctly", () => {
        render(
            <CartItem
                item={mockItem}
                onUpdateSubtotal={mockOnUpdateSubtotal}
                onRemove={mockOnRemove}
            />
        );

        expect(screen.getByText("title")).toBeInTheDocument();
        expect(screen.getByText("color")).toBeInTheDocument();
        expect(screen.getByText("size")).toBeInTheDocument();
    });
    // Rendering ends here

    // Test if onRemove function is called when remove button is clicked
    test("calls onRemove when remove button is clicked", () => {
        render(
            <CartItem
                item={mockItem}
                onUpdateSubtotal={mockOnUpdateSubtotal}
                onRemove={mockOnRemove}
            />
        );

        // Click on the remove button
        const removeButton = screen.getByRole("img", { name: /remove/i });
        fireEvent.click(removeButton);

        // Check if the onRemove function is called with the correct item id
        expect(mockOnRemove).toHaveBeenCalledTimes(1);
        expect(mockOnRemove).toHaveBeenCalledWith(mockItem.id);
    });

    // Test if the default quantity is set to 1
    test("default quantity is set to 1", () => {
        render(
            <CartItem
                item={mockItem}
                onUpdateSubtotal={mockOnUpdateSubtotal}
                onRemove={mockOnRemove}
            />
        );

        const quantityInput = screen.getByRole("spinbutton");
        expect(quantityInput.value).toBe("1");
    });

    // Test if changing the quantity updates the total price
    test("quantity change updates the total price", () => {
        render(
            <CartItem
                item={mockItem}
                onUpdateSubtotal={mockOnUpdateSubtotal}
                onRemove={mockOnRemove}
            />
        );

        // Change the quantity input field value to 2
        const quantityInput = screen.getByRole("spinbutton");
        fireEvent.change(quantityInput, { target: { value: "2" } });

        // Check if the total price is updated to 200
        const totalPrice = screen.getByText(/R200.00/);
        expect(totalPrice).toBeInTheDocument();
    });

    // Test if onUpdateSubtotal function is called when the quantity changes
    test("onUpdateSubtotal is called when quantity changes", () => {
        render(
            <CartItem
                item={mockItem}
                onUpdateSubtotal={mockOnUpdateSubtotal}
                onRemove={mockOnRemove}
            />
        );
        // Change the quantity input field value to 2
        const quantityInput = screen.getByRole("spinbutton");
        fireEvent.change(quantityInput, { target: { value: "2" } });


        // Check if the onUpdateSubtotal function is called with the correct arguments
        expect(mockOnUpdateSubtotal).toHaveBeenCalledTimes(3);
        expect(mockOnUpdateSubtotal).toHaveBeenNthCalledWith(1, 100, "add");
        expect(mockOnUpdateSubtotal).toHaveBeenNthCalledWith(2, 100, "subtract");
    });

    // Test if onUpdateSubtotal function is called when the component is unmounted
    test("onUpdateSubtotal is called when the component is unmounted", () => {
        const { unmount } = render(
            <CartItem
                item={mockItem}
                onUpdateSubtotal={mockOnUpdateSubtotal}
                onRemove={mockOnRemove}
            />
        );

        // Unmount the CartItem component
        unmount();

        // Check if the onUpdateSubtotal function is called with the correct arguments
        expect(mockOnUpdateSubtotal).toHaveBeenCalledTimes(2);
        expect(mockOnUpdateSubtotal).toHaveBeenNthCalledWith(1, 100, "add");
        expect(mockOnUpdateSubtotal).toHaveBeenNthCalledWith(2, 100, "subtract");
    });


    // Add more tests for CartItem component
});