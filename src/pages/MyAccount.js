import React, { useState, useEffect } from 'react';
import {getDocs, collection, query, where, updateDoc, doc, getDoc} from 'firebase/firestore';
import {auth, db} from './firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import ReactStars from 'react-rating-stars-component';
import { NavLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useLocation } from "react-router-dom";
import {useCart} from "./useCart";
import useUserAuth from './useUserAuth';
import '../App.js';
import { getFirestore, setDoc } from "firebase/firestore";




const MyAccount = () => {
    const location = useLocation();
    const [userReviews, setUserReviews] = useState([]);
    const [showReviews, setShowReviews] = useState(false);
    const [userOrders, setUserOrders] = useState([]);
    const [showOrders, setShowOrders] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [showUserInfo, setShowUserInfo] = useState(false);
    // State to track if the user is logged in
    const [loggedIn, setLoggedIn] = useState(false);
    // Add a new state variable to handle editing mode
    const [isEditing, setIsEditing] = useState(false);
    const db = getFirestore();


// Form handling
    const { register, handleSubmit, setValue } = useForm();

    const { userId, isSeller } = useUserAuth();

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
        // Reset editing state whenever user info is toggled
        setIsEditing(false);
    };

    const updateUserDetails = async (data) => {
        const userRef = doc(db, isSeller ? "sellers" : "buyers", userInfo.uid);

        // Prepare update data.
        const updateData = {
            mobileNumber: data.mobileNumber,
        };

        if (isSeller) {
            updateData.firstName = data.firstName;
            updateData.lastName = data.lastName;
            updateData.companyName = data.companyName;
            updateData.companyTelephone = data.companyTelephone;
        } else {
            updateData.name = data.name;
        }
        setUserInfo(prevState => ({ ...prevState, ...updateData }));
        try {
            await updateDoc(userRef, updateData);
            console.log('Document successfully updated');
        } catch (error) {
            if (error.code === 'not-found') {
                console.error('No document found to update at the specified path:', error);
            } else {
                console.error('Error updating document:', error);
            }
        }

    };


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
                    <form onSubmit={handleSubmit(onSubmit)} data-testid="review-form">
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
                                    {isEditing ? (
                                        <form
                                            onSubmit={handleSubmit((data) => {
                                                updateUserDetails(data);
                                                setIsEditing(false);
                                            })}
                                            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} // Add this style
                                        >
                                            {isSeller && (
                                                <>
                                                    <label>
                                                        First Name: <input className='form-control'
                                                        {...register('firstName', { required: true })}
                                                        placeholder="First Name"
                                                        defaultValue={userInfo.firstName}
                                                    />
                                                    </label>
                                                    <label>
                                                        Last Name: <input className='form-control'
                                                        {...register('lastName', { required: true })}
                                                        placeholder="Last Name"
                                                        defaultValue={userInfo.lastName}
                                                    />
                                                    </label>
                                                </>
                                            )}
                                            {!isSeller && (
                                                <label>
                                                    Name: <input className='form-control'
                                                    {...register('name', { required: true })}
                                                    placeholder="Name"
                                                    defaultValue={userInfo.name}
                                                />
                                                </label>
                                            )}
                                            <label>
                                                Mobile Number: <input className="form-control" defaultValue={userInfo.mobileNumber} {...register('mobileNumber')} />
                                            </label>
                                            {isSeller && (
                                                <>
                                                    <label>
                                                        Company Name: <input className="form-control" defaultValue={userInfo.companyName} {...register('companyName')} />
                                                    </label>
                                                    <label>
                                                        Company Telephone: <input className="form-control" defaultValue={userInfo.companyTelephone} {...register('companyTelephone')} />
                                                    </label>
                                                </>
                                            )}
                                            <input className="button"
                                                   type="submit"
                                                   value="Save"
                                                   style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '200px', width: '100%' }}
                                            />
                                        </form>
                                    ) : (
                                        <>
                                            <p>Name: {isSeller ? `${userInfo.firstName} ${userInfo.lastName}` : userInfo.name}</p>
                                            <p>Email: {isSeller ? userInfo.companyEmail : userInfo.email}</p>
                                            <p>Mobile Number: {userInfo.mobileNumber}</p>

                                            <div>
                                                {isSeller && (
                                                    <>
                                                        <p>Company Name: {userInfo.companyName}</p>
                                                        <p>Company Telephone: {userInfo.companyTelephone}</p>
                                                    </>
                                                )}
                                            </div>
                                            <button className="button"  onClick={() => setIsEditing(true)}>Update Profile</button>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <p>No user information available.</p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyAccount;