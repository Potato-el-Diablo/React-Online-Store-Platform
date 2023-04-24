import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyProducts from './MyProducts';
import '@testing-library/jest-dom/extend-expect';

describe('MyProducts Component', () => {
    test('renders page title and breadcrumb', () => {
        render(
            <BrowserRouter>
                <MyProducts />
            </BrowserRouter>
        );

    });

    test('renders filter and sort section', () => {
        render(
            <BrowserRouter>
                <MyProducts />
            </BrowserRouter>
        );

        const sortByText = screen.getByText('Sort By:');
        const selectElement = screen.getByRole('combobox');
        const addProductBtn = screen.getByText('Add Product');
        const totalProductsText = screen.getByText('21 products');

        expect(sortByText).toBeInTheDocument();
        expect(selectElement).toBeInTheDocument();
        expect(addProductBtn).toBeInTheDocument();
        expect(totalProductsText).toBeInTheDocument();
    });

    test('renders products list', async () => {
        // Mock the API call
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue([
                {
                    id: '1',
                    image: 'test-image.jpg',
                    brand: 'Test Brand',
                    name: 'Test Product',
                    description: 'Test Description',
                    price: 99.99,
                    stock: 10,
                },
            ]),
        });

        render(
            <BrowserRouter>
                <MyProducts />
            </BrowserRouter>
        );


        // Cleanup the mock
        global.fetch.mockRestore();
    });
});
