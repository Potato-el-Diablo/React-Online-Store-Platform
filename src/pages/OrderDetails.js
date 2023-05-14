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
            console.log("OrderNumber"+orderNumber)
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

    console.log(orderDetails)
    if (!orderDetails) {
        return <p>Loading...</p>;
    }
    const calculateSubTotal = (items) => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };


    return (
        <>
            <Meta title={'Order Details'} />
            <BreadCrumb title="Order Details" />
            <div className="store-wrapper home-wrapper-2 py-5">
                <div className="row">
                    <div className="col-9">
                        <h2 style={{textAlign: "center"}}>Order Details</h2>
                        <h3 style={{textAlign: "center"}}>Order Number: {orderDetails.orderNumber}</h3>
                        <p style={{textAlign: "center"}}>Order Date: {orderDetails.createdAt.toDate().toLocaleDateString()}</p>
                        <div className="orderItems justify-content-center">
                            <div className="d-flex gap-10 flex-wrap">
                                {orderDetails.items.map((item) => (
                                    <OrderProductCard
                                        key={item.id}
                                        productPrice={item.price}
                                        productImage={item.image}
                                        productName={item.name}
                                        productQuantity={item.quantity}
                                    />
                                ))}
                            </div>
                        </div>
                        <h3 style={{textAlign: "center"}}>Subtotal: R {calculateSubTotal(orderDetails.items).toFixed(2)}</h3>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetails;

