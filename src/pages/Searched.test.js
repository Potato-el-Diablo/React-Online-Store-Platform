import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import Searched from './Searched';
import ProductCard from '../components/ProductCard';
import '@testing-library/jest-dom/extend-expect';

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    getDocs: jest.fn()
}));

// Mocking the db import
jest.mock('./firebase', () => ({
    db: {}
}));

describe('Searched Component', () => {
    beforeEach(() => {
        getDocs.mockClear();
        jest.spyOn(ProductCard, 'default').mockImplementation((props) => <div data-testid="product-card">{props.productName}</div>);
    });

    afterEach(() => {
        jest.spyOn(ProductCard, 'default').mockRestore();
    });

    test('fetches and displays products', async () => {
        getDocs.mockResolvedValueOnce({
            docs: [
                {
                    data: () => ({
                        name: 'Test Product',
                        brand: 'Test Brand',
                        image: 'http://test.image',
                        description: 'Test Description',
                        price: '100',
                        stock: '10'
                    }),
                    id: '1'
                }
            ]
        });

        render(<Searched />, { wrapper: MemoryRouter });

        await waitFor(() => expect(getDocs).toHaveBeenCalledTimes(1));

        expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
});

describe('ProductCard Component', () => {
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
