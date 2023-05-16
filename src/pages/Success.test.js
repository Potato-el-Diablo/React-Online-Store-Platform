import { BrowserRouter as Router } from 'react-router-dom';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { CartContext } from './CartContext';
import Success from './Success';
import { doc, getDoc, updateDoc, addDoc, collection, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import '@testing-library/jest-dom/extend-expect';

jest.mock('./firebase', () => ({
    auth: {
        currentUser: { uid: '123' },
    },
    db: {},
}));
jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    getDoc: jest.fn(),
    updateDoc: jest.fn(),
    addDoc: jest.fn(),
    collection: jest.fn(),
    setDoc: jest.fn()
}));


// Mock data
const cartItems = [
    { id: '1', name: 'Item 1', image: 'image1', price: 10, quantity: 2 },
    { id: '2', name: 'Item 2', image: 'image2', price: 20, quantity: 1 },
];

localStorage.setItem('cartItems', JSON.stringify(cartItems));

beforeEach(() => {
    doc.mockClear();
    getDoc.mockClear();
    updateDoc.mockClear();
    addDoc.mockClear();
    collection.mockClear();
    setDoc.mockClear();

    // Set up mock implementations
    getDoc.mockImplementation(() => ({
        exists: () => true,
        data: () => ({ stock: 5, lastOrder: 1 }),
    }));
    updateDoc.mockResolvedValue({});
    addDoc.mockResolvedValue({});
    setDoc.mockResolvedValue({});
    collection.mockReturnValue({});
});

// Mock the CartContext
const mockSetCartItems = jest.fn();


describe('Success Page', () => {
    afterEach(cleanup);

    test('it renders without crashing', () => {
        render(
            <CartContext.Provider value={{ setCartItems: mockSetCartItems }}>
                <Success />
            </CartContext.Provider>
        );
        expect(screen.getByText(/Payment Successful!/i)).toBeInTheDocument();
    });

test('renders success message', async () => {
    render(
        <Router>
            <Success />
        </Router>
    );

    // Check if the success message is displayed
    expect(await screen.findByText('Payment Successful!')).toBeInTheDocument();

    // Check if the order number and date are displayed
    expect(await screen.findByText(/Order Number: 2/)).toBeInTheDocument();
    expect(await screen.findByText(/Order Date:/)).toBeInTheDocument();
});

test('updates Firestore and localStorage correctly', async () => {
    render(
        <Router>
            <Success />
        </Router>
    );

    // Wait for component to update
    await screen.findByText('Payment Successful!');

    // Check if Firestore functions were called with correct parameters
    expect(doc).toHaveBeenCalledWith(db, 'Products', '1');
    expect(doc).toHaveBeenCalledWith(db, 'Products', '2');
    expect(doc).toHaveBeenCalledWith(db, 'Carts', auth.currentUser.uid);
    expect(doc).toHaveBeenCalledWith(db, 'OrderNumber', 'lastOrderNumber');
    expect(collection).toHaveBeenCalledWith(db, 'Orders');
    expect(getDoc).toHaveBeenCalledTimes(4 + cartItems.length);
    expect(updateDoc).toHaveBeenCalledTimes(2 + cartItems.length);
    expect(addDoc).toHaveBeenCalledTimes(1);
    expect(setDoc).toHaveBeenCalledTimes(1);

    // Check if localStorage was cleared
    expect(localStorage.getItem('cartItems')).toBeNull();
});

});