import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { useCart } from './CartContext';

const Success = () => {
    // Get cartItems from the context
    const { cartItems, setCartItems } = useCart();

    useEffect(() => {
        // Get the cartItems data from localStorage and convert it back to an array
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        const handleSuccessfulCheckout = async () => {
            // Begin a batch write operation
            const batch = writeBatch(db);

            // Iterate over each item in the cart
            for (let item of cartItems) {
                // Get a reference to the product document in Firestore
                const productRef = doc(db, 'Products', item.id);

                // Get the current product document
                const productSnapshot = await getDoc(productRef);

                if (productSnapshot.exists()) {
                    // Calculate the new stock value
                    const newStock = productSnapshot.data().stock - item.quantity;

                    // Use the batch operation to update the 'stock' field of the product document
                    batch.update(productRef, { stock: newStock });
                }
            }

            // Commit the batch operation to Firestore
            await batch.commit();

            // Clear the cart items from localStorage and localstate
            setCartItems([]);
            localStorage.removeItem('cartItems');
        };

        // Call the function to handle successful checkout
        handleSuccessfulCheckout();
    }, []);

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
