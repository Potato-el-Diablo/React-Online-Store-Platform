import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { Link } from 'react-router-dom';
import { db, auth } from './firebase';
import {doc, getDoc, updateDoc, addDoc, collection, setDoc, query, where, getDocs, writeBatch, deleteDoc} from 'firebase/firestore';
import { useCart } from './CartContext';
import emailjs from '@emailjs/browser'

const Success = async () => {
    // Get cartItems from the context
    const {setCartItems} = useCart();
    const [orderNumber, setOrderNumber] = useState(1);

    const location = useLocation();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            const orderId = location.state.orderId;
            const docRef = doc(db, 'AddressDetails', orderId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setOrderDetails(docSnap.data());
            } else {
                console.log('No such document!');
            }
        };

        fetchOrderDetails();
    }, [location]);



    const getSellerIdByEmail = async (sellerEmail) => {
        const sellerQuery = query(
            collection(db, 'sellers'),
            where('companyEmail', '==', sellerEmail.toLowerCase())  // Convert to lowercase for comparison
        );
        const querySnapshot = await getDocs(sellerQuery);
        if (!querySnapshot.empty) {
            const sellerDoc = querySnapshot.docs[0];
            return sellerDoc.id;
        }
        throw new Error(`Seller not found for email: ${sellerEmail}`);
    }


    const addToSellerAnalytics = async (cartItems) => {
        const date = getDate(new Date());

        // Create a map to hold all updates for each seller
        let updates = new Map();

        for (const item of cartItems) {
            const sellerId = await getSellerIdByEmail(item.sellerEmail);
            const sellerRef = doc(db, 'sellers', sellerId);
            const dateRef = doc(sellerRef, 'analytics', date);

            // Combine sellerId and date to create a unique key for each seller/date pair
            let key = `${sellerId}_${date}`;

            // Get the existing data for this seller/date or create a new object if it doesn't exist
            let dateData = updates.get(key);
            if (!dateData) {
                const dateSnapshot = await getDoc(dateRef);
                dateData = dateSnapshot.exists() ? dateSnapshot.data() : {};
                updates.set(key, dateData);
            }

            if (item.id in dateData) {
                dateData[item.id] += item.quantity;
            } else {
                dateData[item.id] = item.quantity;
            }
        }

        // Create a batch to hold all the updates
        let batch = writeBatch(db);

        // Set the data for each document in the batch
        for (let [key, data] of updates.entries()) {
            // Split the key back into sellerId and date
            let [sellerId, date] = key.split("_");
            const ref = doc(db, 'sellers', sellerId, 'analytics', date);
            batch.set(ref, data);
        }

        // Commit the batch
        await batch.commit();
    };


    function getDate(d) {
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = d.getFullYear();

        return dd + '-' + mm + '-' + yyyy;
    }

    function getWeekNumber(d) {
        // Copy date so don't modify original
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        // Get first day of year
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        // Return array of year and week number
        return weekNo;
    }


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
                await updateDoc(itemRef, {stock: newStock});
            }
            subtotal += item.price * item.quantity;
        }

        // Remove the selected voucher from Firestore
        if (auth.currentUser) {
            const voucherId = localStorage.getItem('selectedVoucher');
            if (voucherId) {
                const voucherRef = doc(db, 'Vouchers', voucherId);
                await deleteDoc(voucherRef);
                localStorage.removeItem('selectedVoucher'); // also remove the voucher from localStorage
            }
        }

        // Clear the cart in Firestore
        if (auth.currentUser) {
            const userCartRef = doc(db, 'Carts', auth.currentUser.uid);
            await updateDoc(userCartRef, {products: []});
        }

        if (auth.currentUser) {
            const orderNumberRef = doc(db, 'OrderNumber', 'lastOrderNumber');
            const orderNumberSnapshot = await getDoc(orderNumberRef);

            if (orderNumberSnapshot.exists()) {
                currentOrderNumber = orderNumberSnapshot.data().lastOrder + 1;
                await updateDoc(orderNumberRef, {lastOrder: currentOrderNumber});
            } else {
                currentOrderNumber = 1;
                await setDoc(orderNumberRef, {lastOrder: currentOrderNumber});
            }

            const ordersRef = collection(db, 'Orders');

            // Create an array of objects, each containing id, name, image, price, and quantity
            const itemDetails = cartItems.map(item => ({
                id: item.id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
                sellerEmail: item.sellerEmail,
            }));

            await addDoc(ordersRef, {
                createdAt: new Date(),
                items: itemDetails,  // Save the itemDetails instead of cartItems
                subtotal: subtotal,
                userId: auth.currentUser.uid,
                orderNumber: currentOrderNumber,
            });
            setOrderNumber(currentOrderNumber);
            await addToSellerAnalytics(itemDetails);
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
        const checkout = async () => {
            await handleSuccessfulCheckout();
        };

        checkout();
    }, [setCartItems]);


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
