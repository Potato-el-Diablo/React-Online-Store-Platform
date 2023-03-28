import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import Layout from "./components/Layout";
import SellerRegistration from "./pages/SellerRegistration";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from "./pages/Login";


function App() {
  return (
      <>
        <BrowserRouter>
            <Routes>
                <Route path = "/" element={<Layout/>} >
                    <Route index element={<Home />}/>
                    <Route path = "about" element={<About/>}/>
                    <Route path="contact" element={<Contact/>}/>
                    <Route path = "login" element={<Login/>}/>
                    <Route path = "sellerregistration" element={<SellerRegistration/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
      </>
  );
}

export default App;
