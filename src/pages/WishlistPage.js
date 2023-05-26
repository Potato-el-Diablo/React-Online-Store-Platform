import React, { useState, useEffect } from 'react';
import {getDocs, collection, query, updateDoc, doc, getDoc} from 'firebase/firestore';
import {auth, db} from './firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { NavLink } from 'react-router-dom';
import {useCart} from "./useCart";
import '../App.js';
import useUserAuth from "./useUserAuth";

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [showWishlist, setShowWishlist] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { userId, isSeller } = useUserAuth();
    const { handleAddToCart } = useCart(userId);
    const handleWishlistClick = async () => {
        setIsLoading(true); // start loading
        if (!showWishlist && userId) {
            const userWishlistDoc = doc(db, 'Wishlist', userId);
            const docSnapshot = await getDoc(userWishlistDoc);
            if (docSnapshot.exists) {
                const userWishlistData = docSnapshot.data();
                const productIds = userWishlistData.products;
                const notifyIds = userWishlistData.Notify || [];

                const wishlistWithProductData = await Promise.all(
                    productIds.map(async (productId) => {
                        const productDoc = doc(db, 'Products', productId);
                        const productSnapshot = await getDoc(productDoc);
                        return {
                            id: productId,
                            notifySale: notifyIds.includes(productId), // Add this line
                            ...productSnapshot.data()
                        };
                    })
                );

                setWishlist(wishlistWithProductData);
                console.log("Items in wishlist", wishlistWithProductData);
                setIsLoading(false); // stop loading
            }
        }
    };

    useEffect(() => {
        const fetchWishlist = async () => {
            await handleWishlistClick();
        };
        fetchWishlist();
    }, [userId]);

    const handleDeleteFromWishlist = async (productId) => {
        console.log("The product id being deleted:", productId)
        if (userId) {
            const userWishlistDoc = doc(db, 'Wishlist', userId);
            const docSnapshot = await getDoc(userWishlistDoc);
            if (docSnapshot.exists()) {
                const userWishlistData = docSnapshot.data();
                const productIds = userWishlistData.products;
                const updatedProductIds = productIds.filter(id => id !== productId);

                await updateDoc(userWishlistDoc, { products: updatedProductIds });
                await handleWishlistClick(); // Update wishlist after deletion
            }
        }
    };

    const handleNotifySaleToggle = async (productId) => {
        console.log("Toggling notification for product id:", productId)
        if (userId) {
            const userWishlistDoc = doc(db, 'Wishlist', userId);
            const docSnapshot = await getDoc(userWishlistDoc);
            if (docSnapshot.exists()) {
                const userWishlistData = docSnapshot.data();
                const notifyIds = userWishlistData.Notify || [];

                let updatedNotifyIds;
                if (notifyIds.includes(productId)) {
                    // If it's currently in the notify array, remove it
                    updatedNotifyIds = notifyIds.filter(id => id !== productId);
                } else {
                    // If it's not currently in the notify array, add it
                    updatedNotifyIds = [...notifyIds, productId];
                }

                await updateDoc(userWishlistDoc, { Notify: updatedNotifyIds });
                await handleWishlistClick(); // Update wishlist after updating notification preference
            }
        }
    };


    return (
        // ...only return statement code related to wishlist
        <>
            {isLoading ? (
                    <p>Loading...</p>
            ) : wishlist.length === 0 ? (
                <p>Your wishlist is empty.</p>
            ) : (
                <div>
                    <h3>Items in wishlist</h3>
                    <ul>
                        {wishlist.map((item, index) => (
                            <li key={index} className="wishlistItem">
                                <img className="wishlistItemImg" src={item.image} alt={item.name} />
                                <div className="wishlistItemDetails">
                                    <h3>{item.name}</h3>
                                    <p className="price" style={{ textDecoration: item.sale ? 'line-through' : 'none'}}>Price: R{item.price}</p>
                                    {item.sale && <p className="sale-price">On Sale: R{item.sale}</p>}
                                    <label>
                                        <input
                                            type="checkbox"
                                            onChange={() => handleNotifySaleToggle(item.id)}
                                            checked={item.notifySale}
                                        />
                                        Notify me when this goes on sale
                                    </label>
                                    <div className={item.stock > 0 ? "in-stock" : "out-of-stock"}>
                                        <p>{item.stock > 0 ? "In Stock" : "Out of Stock"}</p>
                                    </div>
                                </div>
                                <div className="buttonContainer">
                                    <button className="wishlistItemBtn button" disabled={item.stock <= 0} onClick={() => handleAddToCart(item)}>Add to Cart</button>
                                    <button className="button deleteItemBtn" onClick={() => handleDeleteFromWishlist(item.id)}>
                                        <img src="/images/trash.svg" alt="delete" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default WishlistPage;
