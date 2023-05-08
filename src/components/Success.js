import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
    return (
        <div>
            <h1>Payment Successful!</h1>
            <p>Your payment was processed successfully. Thank you for your purchase!</p>

            {/* Order details */}
            <h2>Order Details</h2>
            <p>Order Number: 12345</p>
            <p>Order Date: {new Date().toLocaleDateString()}</p>
            <p>Items Purchased:</p>
            <ul>
                <li>Item 1 - Quantity: 2</li>
                <li>Item 2 - Quantity: 1</li>
            </ul>

            {/* Thank you message */}
            <h2>Thank You!</h2>
            <p>We appreciate your business and hope you enjoy your purchase.
                If you have any questions, please email
                <a href="DiabloPOTATO@gmail.com">orders@example.com</a>.
            </p>

            {/* Button to go back to the homepage */}
            <Link to="/" className="button">Back to Homepage</Link>
        </div>
    );
};

export default Success;

