import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';
import OrderProductCard from '../components/OrderProductCard';
import { db } from './firebase';

const OrderDetails = () => {
    const { orderNumber } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {

        const fetchOrderDetails = async () => {
            const orderQuery = query(
                collection(db, 'Orders'),
                where('orderNumber', '==', orderNumber)
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

    console.log(orderDetails)
    if (!orderDetails) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Meta title={'Order Details'} />
            <BreadCrumb title="Order Details" />
            <div className="store-wrapper home-wrapper-2 py-5">
                <div className="row">
                    <div className="col-9">
                        <h2>Order Details</h2>
                        <h3>Order Number: {orderDetails.orderNumber}</h3>
                        <p>Order Date: {orderDetails.createdAt.toDate().toLocaleDateString()}</p>
                        <div className="orderItems">
                            <div className="d-flex gap-10 flex-wrap">
                                {orderDetails.items.map((item) => (
                                    <OrderProductCard
                                        key={item.id}
                                        productImage={item.image}
                                        productName={item.name}
                                        productQuantity={item.quantity}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetails;
