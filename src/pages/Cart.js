// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import BreadCrumb from '../components/BreadCrumb';
import Meta from '../components/Meta';
//import { AiFillDelete } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';

const Cart = () => {
    const [subtotal, setSubtotal] = useState(0);

    //array of items in the cart
    //this array should be used for the
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            image: '/images/watch.jpg',
            title: 'title',
            color: 'color',
            size: 'size',
            price: 100,
        },
        {
            id: 2,
            image: '/images/watch.jpg',
            title: 'title',
            color: 'color',
            size: 'size',
            price: 120,
        }
        // Add more cart items here
    ]);

    const handleUpdateSubtotal = (amount, action) => {
        if (action === 'add') {
            setSubtotal((prevSubtotal) => prevSubtotal + amount);
        } else if (action === 'subtract') {
            setSubtotal((prevSubtotal) => prevSubtotal - amount);
        }
    };

    const handleRemoveCartItem = (itemId) => {
        setCartItems((prevCartItems) => prevCartItems.filter((item) => item.id !== itemId));
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
