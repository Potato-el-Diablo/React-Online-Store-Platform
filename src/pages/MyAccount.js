import React, { useState, useEffect } from 'react';
import {getDocs, collection, query, where, updateDoc, doc} from 'firebase/firestore';
import { db } from './firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import ReactStars from 'react-rating-stars-component';
import { NavLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';



const MyAccount = ({isSeller}) => {
    const [userId, setUserId] = useState('');
    const [userReviews, setUserReviews] = useState([]);
    const [showReviews, setShowReviews] = useState(false);
    const [userOrders, setUserOrders] = useState([]);
    const [showOrders, setShowOrders] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [showUserInfo, setShowUserInfo] = useState(false);

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
    };
    // When "show customer info" is clicked, this function will handle the request
    const handleUserInfoClick = async () => {
        if (!showUserInfo && userId) {
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