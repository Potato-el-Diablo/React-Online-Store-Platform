import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OurStore from './OurStore';
import '@testing-library/jest-dom/extend-expect';

describe('OurStore Component', () => {
    test('renders page title and breadcrumb', () => {
        render(
            <BrowserRouter>
                <OurStore />
            </BrowserRouter>
        );

        const ourStoreRegex = new RegExp('Our Store', 'i');
        const pageTitle = screen.getByText(ourStoreRegex);
        const breadcrumb = screen.getAllByText(ourStoreRegex);

        expect(pageTitle).toBeInTheDocument();
        expect(breadcrumb.length).toBeGreaterThan(0);
    });

    test('renders filter and sort section', () => {
        render(
            <BrowserRouter>
                <OurStore />
            </BrowserRouter>
        );

        const sortByText = screen.getByText('Sort By');
        const selectElement = screen.getByRole('combobox');
        const totalProductsText = screen.getByText(/Total Products:/i);

        expect(sortByText).toBeInTheDocument();
        expect(selectElement).toBeInTheDocument();
        expect(totalProductsText).toBeInTheDocument();
    });
    test('renders filter cards', () => {
        render(
            <BrowserRouter>
                <OurStore />
            </BrowserRouter>
        );
    
        const filterByTitle = screen.getByText('Filter By');
        const availabilityTitle = screen.getByText('Availability');
        const priceTitle = screen.getByText('Price');
        const productTagsTitle = screen.getByText('Product Tags');
    
        expect(filterByTitle).toBeInTheDocument();
        expect(availabilityTitle).toBeInTheDocument();
        expect(priceTitle).toBeInTheDocument();
        expect(productTagsTitle).toBeInTheDocument();
    });
    
    test('handles sorting option change', () => {
        render(
            <BrowserRouter>
                <OurStore />
            </BrowserRouter>
        );
    
        const selectElement = screen.getByRole('combobox');
    
        fireEvent.change(selectElement, { target: { value: 'price-ascending' } });
    
        expect(selectElement.value).toBe('price-ascending');
        // Add more assertions to check if the sorting option has been successfully updated
    });
    test('renders product tags', () => {
        render(
            <BrowserRouter>
                <OurStore />
            </BrowserRouter>
        );
    
        const headphoneTag = screen.getByText('Headphone');
        const watchesTag = screen.getByText('Watches');
        const laptopTag = screen.getByText('Laptop');
        const mobileTag = screen.getByText('Mobile');
        const appleTag = screen.getByText('Apple');
    
        expect(headphoneTag).toBeInTheDocument();
        expect(watchesTag).toBeInTheDocument();
        expect(laptopTag).toBeInTheDocument();
        expect(mobileTag).toBeInTheDocument();
        expect(appleTag).toBeInTheDocument();
    });
    
    
    test('renders product cards with correct data', () => {
        // Mock the data for product cards
        const products = [
            {
                id: '1',
                image: 'product1.jpg',
                brand: 'Brand 1',
                name: 'Product 1',
                description: 'Description 1',
                price: 100,
                sale: '',
                category: 'Category 1',
                stock: 10,
                averageRating: 4.5
            },
            {
                id: '2',
                image: 'product2.jpg',
                brand: 'Brand 2',
                name: 'Product 2',
                description: 'Description 2',
                price: 200,
                sale: 'Sale 2',
                category: 'Category 2',
                stock: 5,
                averageRating: 3.8
            }
        ];

        render(
            <BrowserRouter>
                <OurStore />
            </BrowserRouter>
        );

        // Mock the products state to be used within the component
        jest.spyOn(React, 'useState').mockImplementation(() => [products, jest.fn()]);

        // Assert that the product cards are rendered with correct data
        const productCard1 = screen.getByText('Product 1');
        expect(productCard1).toBeInTheDocument();
        // Add more assertions for the other properties of productCard1

        const productCard2 = screen.getByText('Product 2');
        expect(productCard2).toBeInTheDocument();
        // Add more assertions for the other properties of productCard2
    });
});
