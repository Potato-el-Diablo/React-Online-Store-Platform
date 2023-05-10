import React, { useState, useEffect } from 'react';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import ReactStars from 'react-rating-stars-component';

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

    return (
        <div>
            <h2>My Account</h2>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
                    <button onClick={handleOrderClick}>{showOrders ? 'Hide order history' : 'View order history'}</button>
                    <button onClick={handleClick}>{showReviews ? 'Hide reviews' : 'Show your reviews'}</button>
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
                                        <button className="orderDetailsButton" className="button">Order Details</button>
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
                                <li key={index} className="reviewBox">
                                    <h3>Review for {review.productName}</h3>
                                    <ReactStars
                                        count={5}
                                        value={review.rating}
                                        edit={false}
                                        size={24}
                                        activeColor="#ffd700"
                                    />
                                    <p>{review.comment}</p>
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