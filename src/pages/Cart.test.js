import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Cart from './Cart';
import { useCart } from './CartContext';
import { BrowserRouter } from 'react-router-dom';
import CartItem from '../components/CartItem';
import '@testing-library/jest-dom'


jest.mock('./CartContext', () => ({
    useCart: jest.fn(),
}));

jest.mock('./firebase', () => ({
    auth: {
        currentUser: {
            uid: 'testUserId',
        },
        onAuthStateChanged: jest.fn(),
    },
    db: {},
}));

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    updateDoc: jest.fn(),
    query: jest.fn(),
    getDocs: jest.fn(() => Promise.resolve({
        forEach: jest.fn(),
    })),
}));


jest.mock('../components/CartItem', () => (props) => (
    <div data-testid="cart-item">
        <button onClick={() => props.onRemove(props.item.id)}>Delete</button>
        <button onClick={() => props.onUpdateQuantity(props.item.id, props.item.quantity + 1, props.item.price)}>Update Quantity</button>
        <button onClick={() => props.onUpdateSubtotal(props.item.id, props.item.quantity * props.item.price)}>Update Subtotal</button>
    </div>
));

describe('Cart Component', () => {
    const mockCartItems = [
        {
            id: 'item1',
            quantity: 2,
            originalPrice: 20,
            price: 20,
            productData: {}
        },
        {
            id: 'item2',
            quantity: 3,
            originalPrice: 10,
            price: 10,
            productData: {}
        }
    ];

    beforeEach(() => {
        useCart.mockImplementation(() => ({
            cartItems: mockCartItems,
            setCartItems: jest.fn(),
        }));
    });

    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <Cart />
            </BrowserRouter>
        );
        expect(screen.getByText('Product')).toBeInTheDocument();
    });

    it('renders correct number of cart items', () => {
        render(
            <BrowserRouter>
                <Cart />
            </BrowserRouter>
        );
        expect(screen.getAllByTestId('cart-item').length).toBe(mockCartItems.length);
    });
});