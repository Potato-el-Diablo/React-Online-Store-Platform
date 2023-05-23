import React from "react";
import {Outlet} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "../App.css";

const Layout = () => {
    return (
        <div className="layout">
            <Header data-testid="header" />
            <div className="content">
                <Outlet data-testid="outlet" />
            </div>
            <Footer data-testid="footer" />
        </div>
    );
};

export default Layout;