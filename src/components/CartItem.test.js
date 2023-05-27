import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CartItem from './CartItem';

describe('CartItem', () => {
    const mockItem = {
        id: '1',
        name: 'Mock Item',
        color: 'red',
        size: 'medium',
        price: 100,
        image: 'mockImage.jpg',
    };
    const mockQuantity = 2;
    let mockOnUpdateSubtotal;
    let mockOnRemove;
    let mockOnUpdateQuantity;

    beforeEach(() => {
        mockOnUpdateSubtotal = jest.fn();
        mockOnRemove = jest.fn();
        mockOnUpdateQuantity = jest.fn();
    });

    test('renders item details correctly', () => {
        render(
            <CartItem
                item={mockItem}
                quantity={mockQuantity}
                onUpdateSubtotal={mockOnUpdateSubtotal}
                onRemove={mockOnRemove}
                onUpdateQuantity={mockOnUpdateQuantity}
            />
        );
        expect(screen.getByText('Mock Item')).toBeInTheDocument();
        expect(screen.getByText('red')).toBeInTheDocument();
        expect(screen.getByText('medium')).toBeInTheDocument();
        expect(screen.getByAltText('product-image')).toHaveAttribute('src', 'mockImage.jpg');
    });

    // Similarly update for other tests...

    afterEach(() => {
        jest.clearAllMocks();
    });
});


