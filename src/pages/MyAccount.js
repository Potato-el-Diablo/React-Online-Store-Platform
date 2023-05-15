import React, { useState, useEffect } from 'react';
import {getDocs, collection, query, where, updateDoc, doc} from 'firebase/firestore';
import { db } from './firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import ReactStars from 'react-rating-stars-component';
import { NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const MyAccount = () => {
    const [userId, setUserId] = useState('');
    const [userReviews, setUserReviews] = useState([]);
    const [showReviews, setShowReviews] = useState(false);
    const [userOrders, setUserOrders] = useState([]);
    const [showOrders, setShowOrders] = useState(false);

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

    const EditableReview = ({ review, onEdit }) => {
        const [isEditing, setIsEditing] = useState(false);
        const { register, handleSubmit, formState: { errors } } = useForm();

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

        return (
            <div className="reviewBox">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>Review for {review.productName}</h3>
                    <button onClick={handleEdit}>Edit Review</button>
                </div>
                {isEditing ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label>
                            Rating:
                            <input {...register("rating", { required: true })} defaultValue={review.rating} />
                        </label>
                        {errors.rating && <p>Rating is required</p>}
                        <label>
                            Comment:
                            <textarea {...register("comment", { required: true })} defaultValue={review.comment} />
                        </label>
                        {errors.comment && <p>Comment is required</p>}
                        <input type="submit" />
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


    return (
        <div>
            <h2>My Account</h2>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
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
                </div>
            </div>
        </div>
    );
};

export default MyAccount;