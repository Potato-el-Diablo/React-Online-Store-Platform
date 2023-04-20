import React, {useState} from 'react';
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
import {MyProducts} from './pages/MyProducts';
import SingleProduct from './pages/SingleProduct';
import { ToastContainer } from 'react-toastify';
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from './pages/firebase';


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
                    <Route path ="product/:id" element = {<SingleProduct/>}/>

                </Route>
            </Routes>
        </BrowserRouter>
      </>
  );
}

export default App;
