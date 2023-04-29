// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import BreadCrumb from '../components/BreadCrumb';
import Meta from '../components/Meta';
//import { AiFillDelete } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';

import { db, auth } from './firebase';
import {collection, doc, getDoc, getDocs, query, updateDoc, where, arrayRemove} from 'firebase/firestore';


const Cart = () => {
    const [subtotal, setSubtotal] = useState(0);
    const [cartItems, setCartItems] = useState([]);

    const [itemSubtotals, setItemSubtotals] = useState({});

    const handleUpdateSubtotal = (itemId, amount) => {
        setItemSubtotals((prevState) => ({
            ...prevState,
            [itemId]: amount,
        }));
    };
    useEffect(() => {
        const newSubtotal = Object.values(itemSubtotals).reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
        );
        setSubtotal(newSubtotal);
    }, [itemSubtotals]);

    const fetchUserCartItems = async () => {
        if (!auth.currentUser) return;

        const userCartRef = doc(db, 'Carts', auth.currentUser.uid);
        const userCartSnapshot = await getDoc(userCartRef);

        if (!userCartSnapshot.exists()) {
            console.log('No cart data found for the user');
            return;
        }

        const cartProducts = userCartSnapshot.data().products;
        console.log('Fetched cart data:', cartProducts);

        // Filter out invalid cart items before mapping
        const validCartProducts = cartProducts.filter((cartProduct) => typeof cartProduct === 'object' && cartProduct !== null);

        const fetchedItemsPromises = validCartProducts.map(async (cartProduct) => {
            const productRef = doc(db, 'Products', cartProduct.productId);
            const productSnapshot = await getDoc(productRef);

            if (productSnapshot.exists()) {
                return { id: productSnapshot.id, quantity: cartProduct.quantity, ...productSnapshot.data() };
            } else {
                console.error(`Product not found for ID: ${cartProduct.productId}`);
                return null;
            }
        });


        const fetchedItems = await Promise.all(fetchedItemsPromises);
        const validItems = fetchedItems.filter((item) => item !== null);
        console.log(validItems);
        setCartItems(validItems);
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchUserCartItems();
            } else {
                setCartItems([]);
            }
        });

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    const handleRemoveItem = async (itemId) => {
        const userCartRef = doc(db, 'Carts', auth.currentUser.uid);

        await updateDoc(userCartRef, {
            products: arrayRemove(itemId),
        });

        // Remove the item from the cartItems state
        setCartItems((prevCartItems) => prevCartItems.filter((item) => item.id !== itemId));

        // Update the subtotal
        setSubtotal((prevSubtotal) => prevSubtotal - (itemSubtotals[itemId] || 0));

        // Remove the item from the itemSubtotals state
        setItemSubtotals((prevState) => {
            const updatedSubtotals = { ...prevState };
            delete updatedSubtotals[itemId];
            return updatedSubtotals;
        });
    };

    return (
        <>
            <Meta title={'Cart'} />
            <BreadCrumb title="Cart" />
            <section className="cart-wrapper home-wrapper-2 py-5">
                <div className="container-xxl">
                    <div className="row">
                        <div className="col-12">
                            <div className="cart-header py-3 d-flex justify-content-between align-items-center">
                                <h4 className="cart-col-1">Product</h4>
                                <h4 className="cart-col-2">Price</h4>
                                <h4 className="cart-col-3">Quantity</h4>
                                <h4 className="cart-col-4">Total</h4>
                            </div>
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    quantity={item.quantity} // Pass the quantity as a prop
                                    onUpdateSubtotal={handleUpdateSubtotal}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                        </div>
                        <div className="col-12 py-2 mt-4"></div>
                        <div className="d-flex justify-content-between align-items-baseline">
                            <Link to="/product" className="button">
                                Continue Shopping
                            </Link>
                            <div className="d-flex flex-column align-items-end">
                                <h4>Subtotal: R {subtotal}</h4>
                                <p>Taxes and Shipping Calculated at checkout</p>
                                <Link to="/Checkout" className="button">
                                    Checkout
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Cart;
