import React, { useEffect, useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';
import { Link, useLocation } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';
import { useHistory } from 'react-router-dom';
import { useCart } from './CartContext'; // Import the useCart hook

const stripePromise = loadStripe('pk_test_51N4dpfECtnw33ZKc2BL6hUXmq8UzHP8oGpP71gWeNOHrLsuDfQWATvS64pJVrke4JIPvqAgZjps0IuxOqfFsE5VJ00HarVDp2R');


const DeliveryPage = () => {

  // Use the useCart hook to access cartItems and setCartItems
  const cartItems = JSON.parse(localStorage.getItem('cartItems'));

  //Calls the stripe checkout page once delivery is completed
  const handleButtonClick = () => {
    fetch("https://evening-sands-70201.herokuapp.com/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Send along all the information about the items
      body: JSON.stringify({
        items: cartItems.map((item) => ({
          id: item.id,
          // Check if sale field exists and is not null
          // If so, use sale as price. Otherwise, use price
          priceInCents: (item.sale !== null && item.sale !== undefined) ? item.sale * 100 : item.price * 100,
          name: item.name,
          quantity: item.quantity,
        })),
      }),
    })
        .then((res) => {
          if (res.ok) return res.json();
          // If there is an error then make sure we catch that
          return res.json().then((e) => Promise.reject(e));
        })
        .then(({ url }) => {
          // On success redirect the customer to the Stripe page
          window.location = url;
        })
        .catch((e) => {
          console.error(e.error);
        });
  };


  const [deliveryOption, setDeliveryOption] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState({
    houseNumber: null,
    streetName: null,
    suburb: null,
    city: null,
    postalCode: null,
    collection: null
  });
  const [deliveryCost, setDeliveryCost] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);

  const handleDeliveryOptionChange = (event) => {
    setDeliveryOption(event.target.value);
  };

  const handleDeliveryAddressChange = (event) => {
    const { name, value } = event.target;
    setDeliveryAddress(prevState => ({ ...prevState, [name]: value }));
  };
  //Calculates the delivery cost and estimated shipping date
  const handleSubmitAddress = () => {
    
    const now = new Date();
    let randomInteger = Math.floor(Math.random() *2) + 1;
    setDeliveryCost(randomInteger*100 + 50);
    randomInteger = Math.floor(Math.random() *5) + 1;
    const deliveryDate = new Date(now.getTime() + (randomInteger * 24 * 60 * 60 * 1000));
    setDeliveryDate(deliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
  };

  const [estimatedTime, setEstimatedTime] = useState('2-3 days');

  const handleCollectionCenterChange = (value) => {
    // update estimated time
    if (value === 'wits') {
      setEstimatedTime('1-2 days');
    } else if (value === 'field') {
      setEstimatedTime('3-4 days');
    } else if (value === 'orange') {
      setEstimatedTime('2-5 days');
    }

    // update collection center
    setDeliveryAddress(prevState => ({ ...prevState, collection: value }));
  };

  //If there are issues with proceeding to checkout, uncomment this to look at the console logs
 /* const handleProceedToCheckout = () => {
    if (deliveryOption === 'delivery' && deliveryAddress !== '') {
      console.log('Proceeding to checkout');
    } else if (deliveryOption === 'collection' && estimatedTime !== '') {
      console.log('Proceeding to checkout');
    } else {
      console.log('Please submit delivery address or select a collection center before proceeding to checkout');
    }
  };  */


    // submits the user delivery details to the database

  const handleFormSubmit = async (event) => {
    // event.preventDefault();
    if ((deliveryOption === 'delivery' && (!deliveryAddress.houseNumber || !deliveryAddress.streetName || !deliveryAddress.suburb || !deliveryAddress.city || !deliveryAddress.postalCode))
        || (deliveryOption === 'collection' && !deliveryAddress.collection)) {
      console.log('Please fill out all fields!');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'AddressDetails'), {
        deliveryAddress: {
          houseNumber: deliveryAddress.houseNumber,
          streetName: deliveryAddress.streetName,
          suburb: deliveryAddress.suburb,
          city: deliveryAddress.city,
          postalCode: deliveryAddress.postalCode,
          collection: deliveryAddress.collection,
        },
        // also store the selected delivery method
        deliveryMethod: deliveryOption,
        // other fields for the order
      });
      console.log('Order submitted successfully!', docRef.id);
      console.log('Order submitted successfully!');
      localStorage.setItem('deliveryOption', JSON.stringify(deliveryOption));
      console.log("The delivery option is: ", deliveryOption)
    } catch (error) {
      console.error('Error writing order to Firestore: ', error);
      console.log('Error submitting order. Please try again later.');
    }
  };
  
  

  //Renders the delivery page
  return (
    <div align="center">
      <h2 className="section-heading" align="center">Choose a delivery option</h2>
      <div>
        <input type="radio" id="delivery" name="deliveryOption" value="delivery" checked={deliveryOption === 'delivery'} onChange={handleDeliveryOptionChange} />
        <label htmlFor="delivery">Delivery</label>
      </div>
      <div>
        <input type="radio" id="collection" name="deliveryOption" value="collection" checked={deliveryOption === 'collection'} onChange={handleDeliveryOptionChange} />
        <label htmlFor="collection">Collection</label>
      </div>
      {deliveryOption === 'delivery' && (
        <div>
          <h3 className="section-heading">Delivery Address</h3>

          <div>
    <table>
      <tbody>
        <tr>
          <td><label id="address" className='form-input' htmlFor="houseNumber">House/Apartment Number:</label></td>
          <td><textarea className="form-container" id="houseNumber" name="houseNumber" value={deliveryAddress.houseNumber} onChange={handleDeliveryAddressChange} /></td>
        </tr>
        <tr>
          <td><label className='form-input' htmlFor="streetName">Street Name:</label></td>
          <td><textarea className="form-container" id="streetName" name="streetName" value={deliveryAddress.streetName} onChange={handleDeliveryAddressChange}  /></td>
        </tr>
        <tr>
          <td><label className='form-input' htmlFor="suburb">Suburb:</label></td>
          <td><textarea className="form-container" id="suburb" name="suburb" value={deliveryAddress.suburb} onChange={handleDeliveryAddressChange} /></td>
        </tr>
        <tr>
          <td><label className='form-input' htmlFor="city">City:</label></td>
          <td><textarea className="form-container" id="city" name="city" value={deliveryAddress.city} onChange={handleDeliveryAddressChange} /></td>
        </tr>
        <tr>
          <td><label className='form-input' htmlFor="postalCode">Postal Code:</label></td>
          <td><textarea className="form-container" id="postalCode" name="postalCode" value={deliveryAddress.postalCode} onChange={handleDeliveryAddressChange} /></td>
        </tr>
      </tbody>
    </table>
    <button className="form-submit"  onClick={(e) => handleSubmitAddress(e.target.value)} >Submit Address</button>
  </div>
  

          {deliveryCost && (
            <p><b>Delivery cost:</b> R{deliveryCost}</p>
          )}
          {deliveryDate && (
            <p><b>Estimated delivery date:</b> {deliveryDate}</p>
          )}
        </div>
      )}
      {deliveryOption === 'collection' && (
        <div>
            <h3 className="section-heading">Collection Centres</h3>
            <select id="collection" data-testid="collection" onChange={(e) => handleCollectionCenterChange(e.target.value)}>
            <option value="wits">Wits Pickup Centre</option>
            <option value="field">Field Pickup Centre</option>
            <option value="orange">Orange Pickup Centre</option>
            </select>
            <p className="estimate" data-testid="estimated-time"><b>Estimated dispatch time:</b> {estimatedTime}</p>
        </div>
    )}


  {(deliveryOption === 'delivery' && deliveryAddress !== '') || (deliveryOption === 'collection' && estimatedTime !== '' )? (
      <button id="checkout-btn" className="form-submit"  onClick={(e) => {handleFormSubmit(e.target.value); handleButtonClick();}}>Proceed to Checkout</button>
  ) : null}

{/* onClick={handleProceedToCheckout} */}
    </div>

    
  );
};

export default DeliveryPage
