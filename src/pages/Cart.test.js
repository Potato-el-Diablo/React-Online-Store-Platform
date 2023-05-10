import React from "react";
import { render, screen } from "@testing-library/react";
import  Cart  from "./Cart";
import { CartProvider, useCart } from "./CartContext";
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('./CartContext'); // mock the module

describe("Cart", () => {
    test("renders Cart component", () => {
        render(
            <CartProvider>
                <Router>
                    <Cart />
                </Router>
            </CartProvider>
        );
    });

});
