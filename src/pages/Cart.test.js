import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import  Cart  from "./Cart";
import { CartProvider, useCart } from "./CartContext";
import { BrowserRouter as Router } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import CartItem from "../components/CartItem";


jest.mock('./CartContext'); // mock the module

describe("Cart", () => {
    test("renders Cart component", () => {
        render(
            <CartProvider>
                <Router>
                    <Cart />
                </Router>
            </CartProvider>
        );
    });

});

test('updates quantity when user changes quantity input', () => {
    // Arrange
    const mockItem = {
        id: 'item1',
        name: 'Test Item',
        price: 100,
        image: '/path/to/image.jpg',
        color: 'Blue',
        size: 'M'
    };
    const mockUpdateSubtotal = jest.fn();
    const mockUpdateQuantity = jest.fn();
    const mockRemove = jest.fn();
    const initialQuantity = 1;

    // Act
    render(
        <CartItem
            item={mockItem}
            quantity={initialQuantity}
            onUpdateSubtotal={mockUpdateSubtotal}
            onRemove={mockRemove}
            onUpdateQuantity={mockUpdateQuantity}
        />
    );
    const quantityInput = screen.getByRole('spinbutton');
    fireEvent.change(quantityInput, { target: { value: '2' } });

    // Assert
    expect(mockUpdateSubtotal).toHaveBeenCalledWith(mockItem.id, mockItem.price * 2);
    expect(mockUpdateQuantity).toHaveBeenCalledWith(mockItem.id, 2);
});
