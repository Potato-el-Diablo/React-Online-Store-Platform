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
            if (docSnapshot.exists()) {
                const userWishlistData = docSnapshot.data();
                const productIds = userWishlistData.products;

                const wishlistWithProductData = await Promise.all(
                    productIds.map(async (productId) => {
                        const productDoc = doc(db, 'Products', productId);
                        const productSnapshot = await getDoc(productDoc);
                        if (productSnapshot.exists()) {
                            return productSnapshot.data();
                        }
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


    return (
        // ...only return statement code related to wishlist
        <>
            {isLoading ? (
                    <p>Loading...</p>
            ) : wishlist.length === 0 ? (
                <p>Your wishlist is empty.</p>
            ) : (
                <ul>
                    {wishlist.map((item, index) => (
                        <li key={index} className="wishlistItem">
                            <img className="wishlistItemImg" src={item.image} alt={item.name} />
                            <div className="wishlistItemDetails">
                                <h3>{item.name}</h3>
                                <p className="price" style={{ textDecoration: item.sale ? 'line-through' : 'none'}}>Price: R{item.price}</p>
                                {item.sale && <p className="sale-price">On Sale: R{item.sale}</p>}
                                <div className={item.stock > 0 ? "in-stock" : "out-of-stock"}>
                                    <p>{item.stock > 0 ? "In Stock" : "Out of Stock"}</p>
                                </div>
                            </div>
                            <button className="wishlistItemBtn button" disabled={item.stock <= 0} onClick={() => handleAddToCart(item)}>Add to Cart</button>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default WishlistPage;
