// useCart.js
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from "./firebase";
import { toast } from 'react-toastify';

export const useCart = (userId) => {
    const handleAddToCart = async (productId, quantity) => {
        try {
            const userCartRef = doc(db, 'Carts', userId);
            const cartSnapshot = await getDoc(userCartRef);

            if (cartSnapshot.exists()) {
                const existingProducts = cartSnapshot.data().products;
                const productIndex = existingProducts.findIndex(
                    (product) => product.productId === productId
                );

                if (productIndex !== -1) {
                    existingProducts[productIndex].quantity += quantity;
                } else {
                    existingProducts.push({ productId, quantity });
                }

                await updateDoc(userCartRef, { products: existingProducts });
            } else {
                await setDoc(userCartRef, {
                    products: [{ productId, quantity }],
                });
            }

            toast.success('Product added to cart successfully', {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        } catch (error) {
            toast.error('Failed to add product to cart', {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
            console.error('Error adding product to cart:', error);
        }
    };

    return { handleAddToCart };
};