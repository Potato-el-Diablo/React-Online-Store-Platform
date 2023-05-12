import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from './firebase';

const OrderDetails = () => {
    const { orderNumber } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            const orderQuery = query(
                collection(db, 'Orders'),
                where('orderNumber', '==', Number(orderNumber))
            );
            const querySnapshot = await getDocs(orderQuery);
            const fetchedOrder = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }))[0];
            setOrderDetails(fetchedOrder);
        };
        fetchOrderDetails();
    }, [orderNumber]);

    if (!orderDetails) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>Order Details</h2>
            <h3>Order Number: {orderDetails.orderNumber}</h3>
            <p>Order Date: {orderDetails.createdAt.toDate().toLocaleDateString()}</p>
            <div className="orderItems">
                {orderDetails.items.map((item) => (
                    <div key={item.id} className="orderItem">
                        <img src={item.image} alt={item.name} style={{ width: '50px' }} />
                        <p>{item.name}</p>
                        <p>Quantity: {item.quantity}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderDetails;
