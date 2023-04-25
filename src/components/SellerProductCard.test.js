import React from "react";
import { render, screen,} from "@testing-library/react";
import SellerProductCard from "./SellerProductCard";
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';

describe("SellerProductCard", () => {
    const product = {
        grid: 3,
        productImage: "https://example.com/image.png",
        brand: "Example Brand",
        productName: "Example Product Name",
        productDescription: "Example product description.",
        productPrice: 10.0,
        productStock: 20,
    };

    test("renders the product details correctly", () => {
        render(
            <BrowserRouter>
                <SellerProductCard {...product} />
            </BrowserRouter>
        );
        expect(screen.getByText(product.brand)).toBeInTheDocument();
        expect(screen.getByText(product.productName)).toBeInTheDocument();
        expect(screen.getByText(product.productDescription)).toBeInTheDocument();
        expect(screen.getByText(`Stock Available: ${product.productStock}`)).toBeInTheDocument();
    });

    test('renders add to cart button', () => {
        render(
            <BrowserRouter>
                <SellerProductCard {...product} />
            </BrowserRouter>
        );
        const addToCart = screen.getByAltText('Add to Cart');
        expect(addToCart).toBeInTheDocument();
    });

});
