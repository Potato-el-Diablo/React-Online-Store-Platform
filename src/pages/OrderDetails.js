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

    //Calculates the subtotal of the ordered products
    const calculateSubTotal = (items) => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };
    //Gets the individual order details from the database
    useEffect(() => {

        const fetchOrderDetails = async () => {
            console.log("OrderNumber: "+orderNumber)
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
    const calculateOrderStatus = (createdAt, deliveryOption) => {
        const orderDate = createdAt.toDate();
        const currentDate = new Date();

        // Reset hours for accurate comparison
        orderDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        const diffInDays = Math.floor((currentDate - orderDate) / (1000 * 60 * 60 * 24));

        switch(diffInDays) {
            case 0:
                return "Processing order";
            case 1:
                return "Order in transit";
            case 2:
                return deliveryOption === "delivery" ? "Delivered" : "Collected";
            default:
                return "Order status unknown";
        }
    }
    //Displays the ordered details
    return (
        <>
            <Meta title={'Order Details'} />
            <BreadCrumb title="Order Details" />
            <div className="store-wrapper home-wrapper-2 py-5">
                <div className="row">
                    <div className="col-9">
                        <h2 style={{textAlign: "center"}}>Order Details</h2>
                        <h3 style={{textAlign: "center"}}>Order Number: {orderDetails.orderNumber}</h3>
                        <p style={{textAlign: "center", marginBottom: '50px'}}>Order Date: {orderDetails.createdAt.toDate().toLocaleDateString()}</p>
                        <h3
                            style={{
                                textAlign: "center",
                                marginTop: '30px',
                                color:
                                    calculateOrderStatus(orderDetails.createdAt, orderDetails.deliveryOption) === 'Processing order'
                                        ? 'orange'
                                        : calculateOrderStatus(orderDetails.createdAt, orderDetails.deliveryOption) === 'Order in transit'
                                            ? 'yellow'
                                            : 'green'
                            }}
                        >
                            Order Status: {calculateOrderStatus(orderDetails.createdAt, orderDetails.deliveryOption)}
                        </h3>
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
                        <h3 style={{textAlign: "center", marginTop: '30px'}}>Subtotal: R{calculateSubTotal(orderDetails.items).toFixed(2)}</h3>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetails;

