import React, { useState, useEffect } from 'react';
import {getDocs, collection, query, where, updateDoc, doc, getDoc} from 'firebase/firestore';
import {auth, db} from './firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import ReactStars from 'react-rating-stars-component';
import { NavLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useLocation } from "react-router-dom";
import {useCart} from "./useCart";
import '../App.js';


const MyAccount = () => {
    const location = useLocation();
    const [userId, setUserId] = useState('');
    const [userReviews, setUserReviews] = useState([]);
    const [showReviews, setShowReviews] = useState(false);
    const [userOrders, setUserOrders] = useState([]);
    const [showOrders, setShowOrders] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [showUserInfo, setShowUserInfo] = useState(false);
    // State to track if the user is logged in
    const [loggedIn, setLoggedIn] = useState(false);

    // State to track if the user is a seller
    // eslint-disable-next-line no-unused-vars
    const [isSeller, setIsSeller] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [showWishlist, setShowWishlist] = useState(false);

    // UseEffect hook to user authentication state changes such as logging in
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setLoggedIn(true);
                // Check if the user is a seller
                const sellerRef = collection(db, "sellers");
                const q = query(sellerRef, where("uid", "==", user.uid));
                const querySnapshot = await getDocs(q);

                // If the user is a seller, set isSeller to true and store their first name
                if (!querySnapshot.empty) {
                    const sellerData = querySnapshot.docs[0];
                    setIsSeller(true);
                } else {
                    setIsSeller(false);
                    // If the user is not a seller, check if they are a buyer
                    const buyerRef = collection(db, "buyers");
                    const q = query(buyerRef, where("uid", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    // If the user is a buyer, store their first name
                    if (!querySnapshot.empty) {
                        const buyerData = querySnapshot.docs[0];
                        const fullName = buyerData.data().name;
                        const firstName = fullName.split(" ")[0];

                    }
                }
            } else {
                // If the user is not logged in, reset states
                setLoggedIn(false);
                setIsSeller(false);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);
    //Authorizes that a user is logged in
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId('');
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);
    //Fetches and displays the users reviews
    const handleClick = async () => {
        if (!showReviews && userId) {
            const userReviewsQuery = query(
                collection(db, 'reviews'),
                where('userId', '==', userId)
            );
            const querySnapshot = await getDocs(userReviewsQuery);
            const fetchedReviews = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setUserReviews(fetchedReviews);
        }
        setShowReviews(!showReviews);
        setShowOrders(false);
        setShowUserInfo(false);
    };
    //Fetches and displays the users Order History
    const handleOrderClick = async () => {
        if (!showOrders && userId) {
            const userOrdersQuery = query(
                collection(db, 'Orders'),
                where('userId', '==', userId)
            );
            const querySnapshot = await getDocs(userOrdersQuery);
            const fetchedOrders = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setUserOrders(fetchedOrders);
        }
        setShowOrders(!showOrders);
        setShowReviews(false);
        setShowUserInfo(false);
    };
    // When "show customer info" is clicked, this function will handle the request
    const handleUserInfoClick = async () => {
        if (!showUserInfo && userId) {
            console.log("seller bool on my acc:", isSeller)
            let userQuery;
            if(isSeller) {
                userQuery = query(
                    collection(db, 'sellers'),
                    where('uid', '==', userId)
                );
            } else {
                userQuery = query(
                    collection(db, 'buyers'),
                    where('uid', '==', userId)
                );
            }

            const querySnapshot = await getDocs(userQuery);
            const fetchedUser = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            setUserInfo(fetchedUser[0]);  // assuming one user will be returned
        }
        setShowUserInfo(!showUserInfo);
        setShowOrders(false);
        setShowReviews(false);
    };

    const handleWishlistClick = async () => {
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
            }
        }
        setShowWishlist(!showWishlist);
        setShowOrders(false);
        setShowReviews(false);
    };

    const { handleAddToCart } = useCart(userId);


    //Allows the user to edit reviews from My Account
    const EditableReview = ({ review, onEdit }) => {
        const [isEditing, setIsEditing] = useState(false);
        const { register, handleSubmit, control, formState: { errors } } = useForm();

        const handleEdit = () => {
            setIsEditing(!isEditing);
        };

        const onSubmit = async (data) => {
            const reviewRef = doc(db, 'reviews', review.id);
            await updateDoc(reviewRef, {
                rating: data.rating,
                comment: data.comment
            });
            onEdit();
            handleEdit();
        };
        // Displays an editable review when "edit" is clicked
        return (
            <div className="reviewBox">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>Review for {review.productName}</h3>
                    <button onClick={handleEdit}>Edit Review</button>
                </div>
                {isEditing ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label>
                                Rating:
                                <Controller
                                    name="rating"
                                    control={control}
                                    defaultValue={review.rating}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <ReactStars
                                            count={5}
                                            value={field.value}
                                            onChange={field.onChange}
                                            size={24}
                                            activeColor="#ffd700"
                                        />
                                    )}
                                />
                            </label>
                            {errors.rating && <p>Rating is required</p>}
                        </div>
                        <div>
                            <label>
                                Comment:
                                <textarea {...register("comment", { required: true })} defaultValue={review.comment} />
                            </label>
                            {errors.comment && <p>Comment is required</p>}
                        </div>
                        <div>
                            <input type="submit" />
                        </div>
                    </form>
                ) : (
                    <>
                        <ReactStars
                            count={5}
                            value={review.rating}
                            edit={false}
                            size={24}
                            activeColor="#ffd700"
                        />
                        <p>{review.comment}</p>
                    </>
                )}
            </div>
        );
    };

    //Displays either the users order history or review history
    return (
        <div>
            <h2>My Account</h2>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                    <button className="button" onClick={handleUserInfoClick}>{showUserInfo ? 'Hide Personal Info' : 'Show personal info'}</button>
                    <button className="button" onClick={handleOrderClick}>{showOrders ? 'Hide order history' : 'View order history'}</button>
                    <button className="button" onClick={handleClick}>{showReviews ? 'Hide reviews' : 'Show your reviews'}</button>
                    <button className="button" onClick={handleWishlistClick}>{showWishlist ? 'Hide Wishlist' : 'View Wishlist'}</button>

                </div>
                <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px', width: '80%' }}>
                    {showOrders && (
                        <>
                            {userOrders.length === 0 ? (
                                <p>You have not placed any orders yet.</p>
                            ) : (
                                <ul>
                                    {userOrders.map((order, index) => (
                                        <li key={index} className="orderBox">
                                            <div className="orderHeader">
                                                <h3>Order Number: {order.orderNumber}</h3>
                                                <NavLink className="button" to={`/OrderDetails/${order.orderNumber}`}>Order Details</NavLink>
                                            </div>
                                            <p>Order Date: {order.createdAt.toDate().toLocaleDateString()}</p>
                                            <div className="orderItems">
                                                {order.items.map((item) => (
                                                    <div key={item.id} className="orderItem">
                                                        <img src={item.image} alt={item.name} style={{ width: '50px' }} />
                                                    </div>
                                                ))}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}

                    {showReviews && (
                        <>
                            {userReviews.length === 0 ? (
                                <p>You have not submitted any reviews yet.</p>
                            ) : (
                                <ul>
                                    {userReviews.map((review, index) => (
                                        <EditableReview
                                            key={index}
                                            review={review}
                                            onEdit={handleClick}
                                        />
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                    {showUserInfo && (
                        <>
                            {userInfo ? (
                                <div>
                                    <h3>User Information</h3>
                                    <p>Name: {isSeller ? `${userInfo.firstName} ${userInfo.lastName}` : userInfo.name}</p>
                                    <p>Email: {isSeller ? userInfo.companyEmail : userInfo.email}</p>
                                    <p>Mobile Number: {userInfo.mobileNumber}</p>
                                    {isSeller && (
                                        <>
                                            <p>Company Name: {userInfo.companyName}</p>
                                            <p>Company Telephone: {userInfo.companyTelephone}</p>
                                        </>
                                    )}
                                    <div className="button" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '200px', width: '100%' }}>Update profile</div>

                                </div>
                            ) : (
                                <p>No user information available.</p>
                            )}
                        </>
                    )}
                    {showWishlist && (
                        <>
                            {wishlist.length === 0 ? (
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyAccount;