// cartHooks.js
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

export const useCartInfo = () => {
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);

    // This function fetches the user's cart items from Firebase
    const fetchUserCartItems = async () => {
        if (!auth.currentUser) return;

        const userCartRef = doc(db, 'Carts', auth.currentUser.uid);
        const userCartSnapshot = await getDoc(userCartRef);

        if (!userCartSnapshot.exists()) {
            console.log('No cart data found for the user');
            return;
        }
        console.log("cart data found")
        const cartProducts = userCartSnapshot.data().products;

        const validCartProducts = cartProducts.filter(
            (cartProduct) => typeof cartProduct === 'object' && cartProduct !== null
        );

        setCartItems(validCartProducts);
    };

    // This effect will update the subtotal whenever cartItems state changes
    useEffect(() => {
        const newSubtotal = cartItems.reduce(
            (accumulator, item) => accumulator + (item.price * item.quantity),
            0
        );
        setSubtotal(newSubtotal);
    }, [cartItems]);

    // This effect fetches the user's cart items when the component is mounted
    useEffect(() => {
        fetchUserCartItems();
    }, []);

    return { cartItems, subtotal };
};
