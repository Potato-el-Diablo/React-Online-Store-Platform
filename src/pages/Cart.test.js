import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {BrowserRouter, BrowserRouter as Router} from 'react-router-dom';
import { db, auth } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Cart from './Cart';
import { act } from 'react-dom/test-utils';
import SignupBuyer from "./SignupBuyer";
import {ToastContainer} from "react-toastify";
import userEvent from '@testing-library/user-event';

jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    getDoc: jest.fn(),
    updateDoc: jest.fn()
}));

jest.mock('./firebase', () => ({
    auth: {
        currentUser: {
            uid: 'testUid'
        },
        onAuthStateChanged: jest.fn().mockImplementation((callback) => callback({}))
    },
    db: {}
}));

jest.mock('../components/CartItem', () => (props) => {
    const { item, onUpdateQuantity } = props;
    return (
        <div>
            <input data-testid="quantity-input" type="number" defaultValue={item.quantity} onChange={(e) => onUpdateQuantity(item.id, Number(e.target.value))} />
        </div>
    );
});

describe('Cart Component', () => {
    beforeEach(() => {
        getDoc.mockResolvedValue({
            exists: true,
            data: () => ({
                products: [{
                    productId: 'product1',
                    quantity: 1,
                    price: 100
                }]
            })
        });
    });

    it('renders correctly', async () => {
        render(
            <Router>
                <Cart />
            </Router>
        );

        //expect(screen.getByText('Cart')).toBeInTheDocument();
        expect(screen.getByText('Product')).toBeInTheDocument();
        expect(screen.getByText('Price')).toBeInTheDocument();
        expect(screen.getByText('Quantity')).toBeInTheDocument();
        expect(screen.getByText('Total')).toBeInTheDocument();
        expect(screen.getByText('Subtotal: R 0')).toBeInTheDocument();
        expect(screen.getByText('Taxes and Shipping Calculated at checkout')).toBeInTheDocument();
        expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
        expect(screen.getByText('Checkout')).toBeInTheDocument();
    });
    it('should start with subtotal equal to zero', () => {
        render(
            <Router>
                <Cart />
            </Router>
        );
        expect(screen.getByText(/Subtotal: R 0/i)).toBeInTheDocument();
    });

});
