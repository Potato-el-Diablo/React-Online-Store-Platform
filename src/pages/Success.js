import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from './firebase';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { useCart } from './CartContext';

const Success = () => {
    // Get cartItems from the context
    const { setCartItems } = useCart();

    const handleSuccessfulCheckout = async () => {
        // Retrieve the cartItems data from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let subtotal = 0;

        // For each item in the cart, update the corresponding document in Firestore
        for (const item of cartItems) {
            const itemRef = doc(db, 'Products', item.id);
            const itemSnapshot = await getDoc(itemRef);

            if (itemSnapshot.exists()) {
                const newStock = itemSnapshot.data().stock - item.quantity;
                await updateDoc(itemRef, { stock: newStock });
            }
            subtotal += item.price * item.quantity;
        }

        // Clear the cart in Firestore
        if (auth.currentUser) {
            const userCartRef = doc(db, 'Carts', auth.currentUser.uid);
            await updateDoc(userCartRef, { products: [] });
        }

        if (auth.currentUser) {
            const ordersRef = collection(db, 'Orders');
            await addDoc(ordersRef, {
                createdAt: new Date(),
                items: cartItems,
                subtotal: subtotal,
                userId: auth.currentUser.uid,
            });
        }

        // Clear the cart items both in local state and localStorage
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };

    useEffect(() => {
        handleSuccessfulCheckout();
    }, []); // Run once on mount

    return (
        <div>
            <h1>Payment Successful!</h1>
            <p>Your payment was processed successfully. Thank you for your purchase!</p>

            {/* Order details */}
            <h2>Order Details</h2>
            <p>Order Number: 12345</p>
            <p>Order Date: {new Date().toLocaleDateString()}</p>

            {/* Thank you message */}
            <h2>Thank You!</h2>
            <p>We appreciate your business and hope you enjoy your purchase.
                If you have any questions, please email <a href="DiabloPOTATO@gmail.com"> DiabloPOTATO@gmail.com </a>.
            </p>

            {/* Button to go back to the homepage */}
            <Link to="/" className="button">Back to Homepage</Link>
        </div>
    );
};

export default Success;
