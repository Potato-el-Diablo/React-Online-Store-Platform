//test upload
import React, { useState, useEffect } from 'react';
import {collection, getDocs, query, where} from "firebase/firestore";
import { auth } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';
import { Link } from 'react-router-dom';
import { db } from "./firebase";



const DeliveryPage = () => {
  const [deliveryOption, setDeliveryOption] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCost, setDeliveryCost] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);

  const handleDeliveryOptionChange = (event) => {
    setDeliveryOption(event.target.value);
  };

  const handleDeliveryAddressChange = (event) => {
    setDeliveryAddress(event.target.value);
  };

  const handleSubmitAddress = () => {
    // Set delivery cost and estimated delivery date based on address
    // This is just a placeholder, in reality this would likely be calculated based on a shipping API
    setDeliveryCost(150);
    const now = new Date();
    const randomInteger = Math.floor(Math.random() * 5) + 1;
    const deliveryDate = new Date(now.getTime() + (randomInteger * 24 * 60 * 60 * 1000));
    setDeliveryDate(deliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
   
  };
  const [estimatedTime, setEstimatedTime] = useState('2-3 days');

    function handleCollectionCenterChange(value) {
    if (value === 'wits') {
        setEstimatedTime('1-2 days');
    } else if (value === 'field') {
        setEstimatedTime('3-4 days');
    } else if (value === 'orange') {
        setEstimatedTime('2-5 days');
    }
}


  const handleProceedToCheckout = () => {
    // Redirect to payments portal
    // This is just a placeholder, in reality you would likely use a router to navigate to the payments page
    console.log('Proceeding to checkout');
  };

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
        <td><label className='form-input' htmlFor="houseNumber">House/Apartment Number:</label></td>
        <td><textarea className="form-container" id="houseNumber" name="houseNumber" value={deliveryAddress.houseNumber} onChange={handleDeliveryAddressChange} /></td>
      </tr>
      <tr>
        <td><label className='form-input' htmlFor="streetName">Street Name:</label></td>
        <td><textarea className="form-container" id="streetName" name="streetName" value={deliveryAddress.streetName} onChange={handleDeliveryAddressChange} /></td>
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
  <button className="form-submit" onClick={handleSubmitAddress}>Submit Address</button>
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
            <select onChange={(e) => handleCollectionCenterChange(e.target.value)}>
            <option value="wits">Wits Pickup Centre</option>
            <option value="field">Field Pickup Centre</option>
            <option value="orange">Orange Pickup Centre</option>
            </select>
            <p className="estimate"><b>Estimated dispatch time:</b> {estimatedTime}</p>
        </div>
    )}

      
      <button class="checkout-button"><b>Proceed to Checkout</b></button>

    </div>
    
  );
};

export default DeliveryPage
