// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import BreadCrumb from '../components/BreadCrumb';
import Meta from '../components/Meta';
//import { AiFillDelete } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';

import { db, auth } from './firebase';
import { collection, doc, getDocs, query, where } from 'firebase/firestore';


const Cart = () => {
    const [subtotal, setSubtotal] = useState(0);
    const [cartItems, setCartItems] = useState([]);

    const handleUpdateSubtotal = (amount, action) => {/* existing code */};
    const handleRemoveCartItem = (itemId) => {/* existing code */};

    const fetchUserCartItems = async () => {
        if (!auth.currentUser) return;

        const userCartRef = collection(db, 'Cart', auth.currentUser.uid, 'Items');
        const userCartSnapshot = await getDocs(userCartRef);

        const fetchedItems = [];
        userCartSnapshot.forEach((doc) => {
            fetchedItems.push({ id: doc.id, ...doc.data() });
        });
        console.log(fetchedItems);
        setCartItems(fetchedItems);
    };

    useEffect(() => {
        fetchUserCartItems();
    }, []);

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
                                    onUpdateSubtotal={handleUpdateSubtotal}
                                    onRemove={handleRemoveCartItem}
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
