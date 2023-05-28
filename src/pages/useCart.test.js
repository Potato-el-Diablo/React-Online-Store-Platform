import { renderHook, act } from '@testing-library/react-hooks';
import { useCart } from './useCart';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

jest.mock('firebase/firestore');
jest.mock('react-toastify');

describe('useCart', () => {
    const userId = 'user1';
    const productId = 'product1';
    const quantity = 1;

    beforeEach(() => {
        getDoc.mockClear();
        setDoc.mockClear();
        updateDoc.mockClear();
        toast.success.mockClear();
        toast.error.mockClear();
    });

    it('should add new product to cart', async () => {
        getDoc.mockResolvedValueOnce({ exists: false });

        const { result } = renderHook(() => useCart(userId));

        await act(() => result.current.handleAddToCart(productId, quantity));

        expect(setDoc).toHaveBeenCalledWith(
            expect.anything(),
            { products: [{ productId, quantity }] }
        );

        expect(toast.success).toHaveBeenCalledWith(
            'Product added to cart successfully',
            { position: toast.POSITION.BOTTOM_RIGHT }
        );
    });

    it('should increment quantity of existing product in cart', async () => {
        const existingProducts = [{ productId, quantity }];
        getDoc.mockResolvedValueOnce({ exists: true, data: () => ({ products: existingProducts }) });

        const { result } = renderHook(() => useCart(userId));

        await act(() => result.current.handleAddToCart(productId, quantity));

        expect(updateDoc).toHaveBeenCalledWith(
            expect.anything(),
            { products: [{ productId, quantity: quantity * 2 }] }
        );

        expect(toast.success).toHaveBeenCalledWith(
            'Product added to cart successfully',
            { position: toast.POSITION.BOTTOM_RIGHT }
        );
    });

    it('should handle error when adding product to cart', async () => {
        const error = new Error('Failed to add product to cart');
        getDoc.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useCart(userId));

        await act(() => result.current.handleAddToCart(productId, quantity));

        expect(toast.error).toHaveBeenCalledWith(
            'Failed to add product to cart',
            { position: toast.POSITION.BOTTOM_RIGHT }
        );
    });
});
