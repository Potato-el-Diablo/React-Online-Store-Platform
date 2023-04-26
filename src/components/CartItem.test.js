import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import CartItem from "./CartItem";
import '@testing-library/jest-dom/extend-expect';

const mockItem = {
    id: 1,
    image: "/images/watch.jpg",
    title: "title",
    color: "color",
    size: "size",
    price: 100,
};

const mockOnUpdateSubtotal = jest.fn((subtotal, operation) => {
    console.log('mockOnUpdateSubtotal called with subtotal:', subtotal, 'and operation:', operation);
});

const mockOnRemove = jest.fn();

describe("CartItem component", () => {
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

    test("calls onRemove when remove button is clicked", () => {
        render(
            <CartItem
                item={mockItem}
                onUpdateSubtotal={mockOnUpdateSubtotal}
                onRemove={mockOnRemove}
            />
        );

        const removeButton = screen.getByRole("img", { name: /remove/i });
        fireEvent.click(removeButton);

        expect(mockOnRemove).toHaveBeenCalledTimes(1);
        expect(mockOnRemove).toHaveBeenCalledWith(mockItem.id);
    });

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

    test("quantity change updates the total price", () => {
        render(
            <CartItem
                item={mockItem}
                onUpdateSubtotal={mockOnUpdateSubtotal}
                onRemove={mockOnRemove}
            />
        );

        const quantityInput = screen.getByRole("spinbutton");
        fireEvent.change(quantityInput, { target: { value: "2" } });

        const totalPrice = screen.getByText(/R200.00/);
        expect(totalPrice).toBeInTheDocument();
    });

    test("onUpdateSubtotal is called when quantity changes", () => {
        render(
            <CartItem
                item={mockItem}
                onUpdateSubtotal={mockOnUpdateSubtotal}
                onRemove={mockOnRemove}
            />
        );

        const quantityInput = screen.getByRole("spinbutton");
        fireEvent.change(quantityInput, { target: { value: "2" } });

        expect(mockOnUpdateSubtotal).toHaveBeenCalledTimes(3);
        expect(mockOnUpdateSubtotal).toHaveBeenNthCalledWith(1, 100, "add");
        expect(mockOnUpdateSubtotal).toHaveBeenNthCalledWith(2, 100, "subtract");
    });

    test("onUpdateSubtotal is called when the component is unmounted", () => {
        const { unmount } = render(
            <CartItem
                item={mockItem}
                onUpdateSubtotal={mockOnUpdateSubtotal}
                onRemove={mockOnRemove}
            />
        );

        unmount();

        expect(mockOnUpdateSubtotal).toHaveBeenCalledTimes(2);
        expect(mockOnUpdateSubtotal).toHaveBeenNthCalledWith(1, 100, "add");
        expect(mockOnUpdateSubtotal).toHaveBeenNthCalledWith(2, 100, "subtract");
    });


    // Add more tests for CartItem component
});