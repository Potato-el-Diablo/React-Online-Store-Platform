import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from './firebase';
import {doc, getDoc, updateDoc, addDoc, collection, setDoc, query, where, getDocs} from 'firebase/firestore';
import { useCart } from './CartContext';
import emailjs from '@emailjs/browser'

const Success = () => {
    // Get cartItems from the context
    const { setCartItems } = useCart();
    const [orderNumber, setOrderNumber] = useState(1);

    const handleSuccessfulCheckout = async () => {
        // Retrieve the cartItems data from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let subtotal = 0;
        let currentOrderNumber;

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
            const orderNumberRef = doc(db, 'OrderNumber', 'lastOrderNumber');
            const orderNumberSnapshot = await getDoc(orderNumberRef);

            if (orderNumberSnapshot.exists()) {
                currentOrderNumber = orderNumberSnapshot.data().lastOrder + 1;
                await updateDoc(orderNumberRef, { lastOrder: currentOrderNumber});
            } else {
                currentOrderNumber = 1;
                await setDoc(orderNumberRef, { lastOrder: currentOrderNumber });
            }

            const ordersRef = collection(db, 'Orders');

            // Create an array of objects, each containing id, name, image, price, and quantity
            const itemDetails = cartItems.map(item => ({
                id: item.id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
            }));

            await addDoc(ordersRef, {
                createdAt: new Date(),
                items: itemDetails,  // Save the itemDetails instead of cartItems
                subtotal: subtotal,
                userId: auth.currentUser.uid,
                orderNumber: currentOrderNumber,
            });
            setOrderNumber(currentOrderNumber);
        }
        //This is used to send an email to the user about their order details
        if (auth.currentUser) {
            console.log(`Current user ID: ${auth.currentUser.uid}`);

            const userQuery = query(
                collection(db, 'buyers'),
                where('uid', '==', auth.currentUser.uid)
            );

            const querySnapshot = await getDocs(userQuery);
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const user = userDoc.data();

                if (user.email) {
                    const userEmail = user.email;
                    const itemsString = cartItems.map(item => `${item.quantity} of ${item.name}`).join(', ');
                    console.log(itemsString);  // Add this line
                    await emailjs.send('service_himaqlr', 'template_ds431qf', {
                        orderNumber: currentOrderNumber,
                        subtotal: subtotal.toString(),
                        items: itemsString,
                        orderDate: new Date().toLocaleDateString(),
                        to_email: userEmail,
                    }, '0tHoysH7w4GDDDWkS');

                    console.log(`Success! Email sent to ${userEmail}`);
                } else {
                    console.error('Error: user.email is undefined');
                }
            } else {
                console.error('No matching documents.');
            }
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
            <p>Order Number: {orderNumber}</p>
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
