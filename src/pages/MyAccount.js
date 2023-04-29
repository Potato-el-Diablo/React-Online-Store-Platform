import React, { useState, useEffect } from 'react';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import ReactStars from 'react-rating-stars-component';

const MyAccount = () => {
    const [userId, setUserId] = useState('');
    const [userReviews, setUserReviews] = useState([]);
    const [showReviews, setShowReviews] = useState(false);

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
    };

    return (
        <div>
            <h2>My Account</h2>
            <button onClick={handleClick}>{showReviews ? 'Hide reviews' : 'Show your reviews'}</button>
            {showReviews && (
                <>
                    {userReviews.length === 0 ? (
                        <p>You have not submitted any reviews yet.</p>
                    ) : (
                        <ul>
                            {userReviews.map((review, index) => (
                                <li key={index}>
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
    );
};

export default MyAccount;
