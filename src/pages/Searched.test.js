import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { collection } from 'firebase/firestore';
import '@testing-library/jest-dom/extend-expect';

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    getDocs: jest.fn()
}));

// Mocking the db import
jest.mock('./firebase', () => ({
    db: {}
}));

describe('ProductCard Component', () => {
    // Importing ProductCard inside the block to avoid any mock effects
    const ProductCard = require('../components/ProductCard').default;

    const defaultProps = {
        grid: 4,
        productImage: 'http://test.image',
        brand: 'Test Brand',
        productName: 'Test Product',
        productDescription: 'Test Description',
        productPrice: '100',
        productStock: '10',
        productId: '1'
    };

    test('renders ProductCard correctly', () => {
        const { getByText, getByAltText } = render(<ProductCard {...defaultProps} />, { wrapper: MemoryRouter });

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('Test Brand')).toBeInTheDocument();
        expect(screen.getByAltText('Test Product')).toBeInTheDocument();
    });
});

describe('Searched', () => {
  
    it('should fetch products on mount', async () => {
        const mockData = {
            docs: [
           {
             data: () => ({
               id: '1',
               name: 'Product 1',
               brand: 'Brand 1',
               image: 'https://example.com/product1.png',
               description: 'Product 1 description',
               price: 9.99,
               stock: 10,
             }),
             id: '1',
           },
           {
             data: () => ({
               id: '2',
               name: 'Product 2',
               brand: 'Brand 2',
               image: 'https://example.com/product2.png',
               description: 'Product 2 description',
               price: 19.99,
               stock: 5,
             }),
             id: '2',
           },
         ],
       };
       const getDocsSpy = jest.spyOn(mockData);
       getDocsSpy.mockResolvedValueOnce(mockData);
  
    render(<Searched />);
  
    expect(collection).toHaveBeenCalledWith(db, 'Products');
    expect(getDocs).toHaveBeenCalledWith(collection(db, 'Products'));
    expect(getDocsSpy).toHaveBeenCalled();
    });
});
