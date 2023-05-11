import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb';
import { Link } from 'react-router-dom';

const DeliveryPage = () => {
  const [deliveryOption, setDeliveryOption] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState({
    houseNumber: '',
    streetName: '',
    suburb: '',
    city: '',
    postalCode: '',
    collection: ''
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

  const handleSubmitAddress = () => {
    setDeliveryCost(150);
    const now = new Date();
    const randomInteger = Math.floor(Math.random() * 5) + 1;
    const deliveryDate = new Date(now.getTime() + (randomInteger * 24 * 60 * 60 * 1000));
    setDeliveryDate(deliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
  };

  const [estimatedTime, setEstimatedTime] = useState('2-3 days');

  const handleCollectionCenterChange = (value) => {
    if (value === 'wits') {
      setEstimatedTime('1-2 days');
    } else if (value === 'field') {
      setEstimatedTime('3-4 days');
    } else if (value === 'orange') {
      setEstimatedTime('2-5 days');
    }
  };

  const handleProceedToCheckout = () => {
    if (deliveryOption === 'delivery' && deliveryAddress !== '') {
      console.log('Proceeding to checkout');
    } else if (deliveryOption === 'collection' && estimatedTime !== '') {
      console.log('Proceeding to checkout');
    } else {
      console.log('Please submit delivery address or select a collection center before proceeding to checkout');
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!deliveryAddress.houseNumber || !deliveryAddress.streetName || !deliveryAddress.suburb || !deliveryAddress.city || !deliveryAddress.postalCode) {
      alert('Please fill out all fields!');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'Orders'), {
        deliveryAddress: {
          houseNumber: deliveryAddress.houseNumber,
          streetName: deliveryAddress.streetName,
          suburb: deliveryAddress.suburb,
          city: deliveryAddress.city,
          postalCode: deliveryAddress.postalCode,
          collection_center: deliveryAddress.collection,
        },
        // other fields for the order
      });
      console.log('Order submitted successfully!', docRef.id);
      alert('Order submitted successfully!');
    } catch (error) {
      console.error('Error writing order to Firestore: ', error);
      alert('Error submitting order. Please try again later.');
    }
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
        <td><label id="address" className='form-input' htmlFor="houseNumber">House/Apartment Number:</label></td>
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
  <button className="form-submit" onClick={(e) => handleSubmitAddress(e.target.value)}>Submit Address</button>
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
            <select id="collection_center"onChange={(e) => handleCollectionCenterChange(e.target.value)}>
            <option value="wits">Wits Pickup Centre</option>
            <option value="field">Field Pickup Centre</option>
            <option value="orange">Orange Pickup Centre</option>
            </select>
            <p className="estimate"><b>Estimated dispatch time:</b> {estimatedTime}</p>
        </div>
    )}

      
{(deliveryOption === 'delivery' && deliveryAddress !== '') || (deliveryOption === 'collection' && estimatedTime !== '' )? (
  <button id="checkout-btn" className="form-submit" onClick={handleProceedToCheckout}>Proceed to Checkout</button>
) : null}


    </div>
    
    
  );
};

export default DeliveryPage
