import React from "react";
import {Outlet} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
    return <>
        <Header data-testid="header" />
        <Outlet data-testid="outlet" />
        <Footer data-testid="footer" />


    </>
};

export default Layout;