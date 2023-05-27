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

    test('calls onUpdateSubtotal with correct parameters on mount and on quantity change', () => {
        const { rerender } = render(
            <CartItem
                item={mockItem}
                quantity={mockQuantity}
                onUpdateSubtotal={mockOnUpdateSubtotal}
                onRemove={mockOnRemove}
                onUpdateQuantity={mockOnUpdateQuantity}
            />
        );

        // Once at first render
        expect(mockOnUpdateSubtotal).toHaveBeenCalledWith(mockItem.id, mockItem.price * mockQuantity);

        // Update quantity and check if it gets called with new subtotal
        const newQuantity = 3;
        rerender(
            <CartItem
                item={mockItem}
                quantity={newQuantity}
                onUpdateSubtotal={mockOnUpdateSubtotal}
                onRemove={mockOnRemove}
                onUpdateQuantity={mockOnUpdateQuantity}
            />
        );
        expect(mockOnUpdateSubtotal).toHaveBeenCalledWith(mockItem.id, mockItem.price * newQuantity);
    });

    test('quantity change triggers onUpdateQuantity', () => {
        render(
            <CartItem
                item={mockItem}
                quantity={mockQuantity}
                onUpdateSubtotal={mockOnUpdateSubtotal}
                onRemove={mockOnRemove}
                onUpdateQuantity={mockOnUpdateQuantity}
            />
        );

        const quantityInput = screen.getByRole('spinbutton');
        fireEvent.change(quantityInput, { target: { value: 3 } });
        expect(mockOnUpdateQuantity).toHaveBeenCalledWith(mockItem.id, 3);
    });

    test('clicking delete button triggers onRemove', () => {
        render(
            <CartItem
                item={mockItem}
                quantity={mockQuantity}
                onUpdateSubtotal={mockOnUpdateSubtotal}
                onRemove={mockOnRemove}
                onUpdateQuantity={mockOnUpdateQuantity}
            />
        );

        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);
        expect(mockOnRemove).toHaveBeenCalledWith(mockItem.id);
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


