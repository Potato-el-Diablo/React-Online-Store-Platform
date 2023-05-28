import { renderHook, act } from '@testing-library/react-hooks';
import { useCartInfo } from './UseCartInfo';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    getDoc: jest.fn()
}));

jest.mock('./firebase', () => ({
    db: {},
    auth: {
        currentUser: {
            uid: 'user123'
        }
    }
}));

describe('useCartInfo', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return initial cartItems and subtotal', () => {
        const { result } = renderHook(() => useCartInfo());

        expect(result.current.cartItems).toEqual([]);
        expect(result.current.subtotal).toBe(0);
    });

    test('fetches user cart items and updates cartItems state', async () => {
        const mockCartData = {
            exists: jest.fn(() => true),
            data: jest.fn(() => ({
                products: [
                    { id: 'product1', price: 10, quantity: 2 },
                    { id: 'product2', price: 20, quantity: 1 }
                ]
            }))
        };

        getDoc.mockResolvedValueOnce(mockCartData);

        const { result, waitForNextUpdate } = renderHook(() => useCartInfo());

        expect(getDoc).toHaveBeenCalledWith(doc(db, 'Carts', 'user123'));
        expect(result.current.cartItems).toEqual([]);

        await waitForNextUpdate();

        expect(result.current.cartItems).toEqual([
            { id: 'product1', price: 10, quantity: 2 },
            { id: 'product2', price: 20, quantity: 1 }
        ]);
    });

    test('does not fetch user cart items if user is not authenticated', async () => {
        auth.currentUser = null;

        const { result } = renderHook(() => useCartInfo());

        expect(getDoc).not.toHaveBeenCalled();
        expect(result.current.cartItems).toEqual([]);
    });

    test('updates subtotal when cartItems state changes', () => {
        const { result } = renderHook(() => useCartInfo());

        expect(result.current.subtotal).toBe(0);

        act(() => {
            result.current.setCartItems([
                { id: 'product1', price: 10, quantity: 2 },
                { id: 'product2', price: 20, quantity: 1 }
            ]);
        });

        expect(result.current.subtotal).toBe(40);
    });
});
