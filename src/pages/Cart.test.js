import React from "react";
import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import  Cart  from "./Cart";
import { CartProvider, useCart } from "./CartContext";
import { BrowserRouter as Router } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import CartItem from "../components/CartItem";


//Mock the necessary dependancies
jest.mock('./CartContext'); // mock the module

jest.mock('./firebase', () => ({
    auth: {
        currentUser: {
            uid: 'testUserId',
            onAuthStateChanged: jest.fn()
        }
    },
    db: {}
}));

jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    getDoc: jest.fn(),
    updateDoc: jest.fn()
}));

const mockedCartItem = {
    id: '1',
    price: 100,
    quantity: 2,
};

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

    //Mocks and checks if the quantity is correctly updated with the subtotal also updating
    test('updates quantity when user changes quantity input', () => {
        // Arrange
        const mockItem = {
            id: 'item1',
            name: 'Test Item',
            price: 100,
            image: '/path/to/image.jpg',
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

    //Checks if items in cart are successfully removed
    test('removes item from the cart', async () => {

        const mockItem = {
            id: 'item1',
            name: 'Test Item',
            price: 100,
            image: '/path/to/image.jpg',
        };
        const mockUpdateSubtotal = jest.fn();
        const mockUpdateQuantity = jest.fn();
        const mockRemove = jest.fn();
        const initialQuantity = 1;

        render(
            <CartItem
                item={mockItem}
                quantity={initialQuantity}
                onUpdateSubtotal={mockUpdateSubtotal}
                onRemove={mockRemove}
                onUpdateQuantity={mockUpdateQuantity}
            />
        );
        fireEvent.click(screen.getByText('Delete'));

        // Wait for changes to propagate through useEffects
        // eslint-disable-next-line testing-library/no-unnecessary-act
        await act(async () => {
            await waitFor(() => expect(updateDoc).toHaveBeenCalled());
        });
    });



});




