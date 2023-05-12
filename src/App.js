//import React, {useState} from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import Layout from "./components/Layout";
import SellerRegistration from "./pages/SellerRegistration";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from "./pages/Login";
import SignupBuyer from "./pages/SignupBuyer";
import Home from "./pages/Home";
import OurStore from "./pages/OurStore"
import ForgotPassword from './pages/ForgotPassword';
import Cart from './pages/Cart';
import MyProducts from './pages/MyProducts';
import SingleProduct from './pages/SingleProduct';
import { ToastContainer } from 'react-toastify';
//import {  signInWithEmailAndPassword   } from 'firebase/auth';
//import { auth } from './pages/firebase';
import Success from './pages/Success';
import Searched from './pages/Searched';
import MyAccount from "./pages/MyAccount";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Checkout from "./components/Checkout";
import OrderDetails from "./pages/OrderDetails";
import DeliveryPage from "./pages/DeliveryPage";
const stripePromise = loadStripe('pk_test_51N4dpfECtnw33ZKc2BL6hUXmq8UzHP8oGpP71gWeNOHrLsuDfQWATvS64pJVrke4JIPvqAgZjps0IuxOqfFsE5VJ00HarVDp2R');

function App() {
  return (
      <>
        <ToastContainer />
        <BrowserRouter>
            <Routes>
                <Route path = "/" element={<Layout/>} >
                    <Route index element={<Home />}/>
                    <Route path = "about" element={<About/>}/>
                    <Route path="contact" element={<Contact/>}/>
                    <Route path = "login" element={<Login/>}/>
                    <Route path = "sellerregistration" element={<SellerRegistration/>}/>
                    <Route path="buyerregistration" element={<SignupBuyer/>}/>
                    <Route path="product" element={<OurStore/>}/>
                    <Route path="forgot-password" element={<ForgotPassword/>} />
                    <Route path="myproducts" element={<MyProducts/>}/>
                    <Route path="cart" element={<Cart/>} />
                    <Route path = "search" element={<Searched/>} />
                    <Route path ="product/:id" element = {<SingleProduct/>}/>
                    <Route path="MyAccount" element ={<MyAccount/>}/>
                    <Route path="/success" element={<Success/>} />
                    <Route path="/MyAccount" component={MyAccount} />
                    <Route path="/OrderDetails/:orderNumber" element={<OrderDetails />} />
                    <Route path="/delivery" element={<DeliveryPage/>}/>
                    <Route path="/Checkout" element={
                        <Elements stripe={stripePromise}>
                            <Checkout />
                        </Elements>
                    } />
                </Route>
            </Routes>
        </BrowserRouter>
        
      </>
  );
}

export default App;
