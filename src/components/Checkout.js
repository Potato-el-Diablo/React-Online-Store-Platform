// src/components/Checkout.js

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Link } from 'react-router-dom';

const Checkout = () => {
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);

        // Mock payment processing
        setTimeout(() => {
            setProcessing(false);
            setError('Payment successful!');
        }, 2000);
    };

    return (
        <>
            <h2>Checkout</h2>
            <form onSubmit={handleSubmit}>
                <CardElement />
                <button type="submit" disabled={!stripe || processing}>
                    Confirm Purchase
                </button>
            </form>
            {error && <div>{error}</div>}
            <Link to="/cart" className="button">
                Back to Cart
            </Link>
        </>
    );
};

export default {Checkout};
