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

    it('updates subtotal when quantity is updated', async () => {
        render(
            <BrowserRouter>
                <Cart />
            </BrowserRouter>
        );
        const updateButtons = screen.getAllByText('Update Quantity');
        fireEvent.click(updateButtons[0]);

        await waitFor(() => {
            const updatedSubtotal = (mockCartItems[0].price * (mockCartItems[0].quantity + 1) + mockCartItems[1].price * mockCartItems[1].quantity).toFixed(2);
            expect(screen.getByText(`Subtotal: R ${updatedSubtotal}`)).toHaveTextContent(`Subtotal: R ${updatedSubtotal}`);
        });
    });



    it('displays correct subtotal', () => {
        render(
            <BrowserRouter>
                <Cart />
            </BrowserRouter>
        );
        expect(screen.getByText(`Subtotal: R ${(mockCartItems[0].price * mockCartItems[0].quantity + mockCartItems[1].price * mockCartItems[1].quantity).toFixed(2)}`)).toBeInTheDocument();
    });

    it('deletes a cart item when delete button is clicked', async () => {
        render(
            <BrowserRouter>
                <Cart />
            </BrowserRouter>
        );
        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(screen.getAllByTestId('cart-item').length).toBe(mockCartItems.length - 1);
        });
    });

    it('displays the voucher dropdown and handles voucher selection', () => {
        render(
            <BrowserRouter>
                <Cart />
            </BrowserRouter>
        );
        expect(screen.getByText('Select a voucher')).toBeInTheDocument();

        // assuming you have a mock voucher with id 'voucher1' and discount 10%
        fireEvent.change(screen.getByText('Select a voucher'), { target: { value: 'voucher1' } });

        expect(screen.getByText('voucher1 - 10%')).toBeInTheDocument();
    });
});