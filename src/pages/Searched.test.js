import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
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
