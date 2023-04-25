import React from 'react';
import {render, screen} from '@testing-library/react';
import ProductCard from './ProductCard';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';   //Necessary for toBeInTheDocument

describe('ProductCard', () => {
    const product = {
        grid: 4,
        productImage: 'https://example.com/image.png',
        brand: 'Example Brand',
        productName: 'Example Product Name',
        productDescription: 'Example product description.',
        productPrice: 10.0,
        productStock: 20,
    };




    test('renders product image with correct alt text', () => {
        render(
            <BrowserRouter>
                <ProductCard {...product} />
            </BrowserRouter>
        );
        const productImage = screen.getByAltText('Example Product Name');
        expect(productImage).toBeInTheDocument();
        expect(productImage.src).toEqual('https://example.com/image.png');
    });

    test('renders product brand and title', () => {
        render(
            <BrowserRouter>
                <ProductCard {...product} />
            </BrowserRouter>
        );
        const brand = screen.getByText('Example Brand');
        const title = screen.getByText('Example Product Name');
        expect(brand).toBeInTheDocument();
        expect(title).toBeInTheDocument();
    });


    test('renders add to cart button', () => {
        render(
            <BrowserRouter>
                <ProductCard {...product} />
            </BrowserRouter>
        );
        const addToCart = screen.getByText('Add to Cart');
        expect(addToCart).toBeInTheDocument();
        expect(addToCart.nodeName).toEqual('LABEL');
    });
});
