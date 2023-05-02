import React, { useState, useEffect } from 'react';
import BreadCrumb from '../components/BreadCrumb';
import Meta from '../components/Meta';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { db, auth } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Cart = () => {
    const [subtotal, setSubtotal] = useState(0);
    const [cartItems, setCartItems] = useState([]);

    const [itemSubtotals, setItemSubtotals] = useState({});

    // Updates subtotal in cart page
    const handleUpdateSubtotal = (itemId, amount) => {
        setItemSubtotals((prevState) => ({
            ...prevState,
            [itemId]: amount,
        }));
    };
    // updates a cart Item's quantity
    const handleUpdateQuantity = async (itemId, newQuantity) => {
        const userCartRef = doc(db, 'Carts', auth.currentUser.uid);
        const userCartSnapshot = await getDoc(userCartRef);
        const cartProducts = userCartSnapshot.data().products;

        const updatedProducts = cartProducts.map((cartProduct) => {
            if (typeof cartProduct === 'object' && cartProduct !== null && cartProduct.productId === itemId) {
                return { ...cartProduct, quantity: newQuantity };
            }
            return cartProduct;
        });

        await updateDoc(userCartRef, {
            products: updatedProducts,
        });
    };

    useEffect(() => {
        const newSubtotal = Object.values(itemSubtotals).reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
        );
        setSubtotal(newSubtotal);
    }, [itemSubtotals]);

    useEffect(() => {
        const newItemSubtotals = cartItems.reduce((accumulator, item) => {
            accumulator[item.id] = item.price * item.quantity;
            return accumulator;
        }, {});
        setItemSubtotals(newItemSubtotals);
    }, [cartItems]);


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

        const validCartProducts = cartProducts.filter(
            (cartProduct) => typeof cartProduct === 'object' && cartProduct !== null
        );

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

        // Update the itemSubtotals state with initial values for fetched items
        const initialItemSubtotals = validItems.reduce((accumulator, item) => {
            accumulator[item.id] = item.price * item.quantity;
            return accumulator;
        }, {});
        setItemSubtotals(initialItemSubtotals);
    };

    useEffect(() => {
        let isMounted = true;

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user && isMounted) {
                fetchUserCartItems();
            } else {
                setCartItems([]);
            }
        });

        return () => {
            isMounted = false;
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    const handleRemoveItem = async (itemId) => {
        const userCartRef = doc(db, 'Carts', auth.currentUser.uid);
        const userCartSnapshot = await getDoc(userCartRef);
        const cartProducts = userCartSnapshot.data().products;

        const updatedProducts = cartProducts.filter((cartProduct) => {
            if (typeof cartProduct === 'object' && cartProduct !== null) {
                return cartProduct.productId !== itemId;
            }
            return true;
        });

        await updateDoc(userCartRef, {
            products: updatedProducts,
        });

        // Remove the item from the cartItems state
        setCartItems((prevCartItems) => prevCartItems.filter((item) => item.id !== itemId));

        // Update the subtotal
        setSubtotal((prevSubtotal) => {
            const newSubtotal = prevSubtotal - (itemSubtotals[itemId] || 0);
            console.log("Updated subtotal:", newSubtotal); // Debugging line
            return newSubtotal;
        });

        // Remove the item from the itemSubtotals state
        setItemSubtotals((prevState) => {
            const updatedSubtotals = { ...prevState };
            delete updatedSubtotals[itemId];
            console.log("Updated itemSubtotals:", updatedSubtotals); // Debugging line
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
                                    onUpdateQuantity={handleUpdateQuantity} // Pass the handleUpdateQuantity function as a prop
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
