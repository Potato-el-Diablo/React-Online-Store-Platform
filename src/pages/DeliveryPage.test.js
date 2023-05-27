import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DeliveryPage from './DeliveryPage';

// Mock necessary dependencies
jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        push: jest.fn(),
    }),
    useLocation: jest.fn(),
}));

jest.mock('./CartContext', () => ({
    useCart: jest.fn().mockReturnValue({}),
}));

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    addDoc: jest.fn().mockResolvedValue({id: 'mockId'}),
    doc: jest.fn(),
    getDoc: jest.fn(),
    updateDoc: jest.fn(),
}));

jest.mock('@stripe/stripe-js', () => ({
    loadStripe: jest.fn(),
}));

jest.mock('./firebase', () => ({
    db: {},
}));

describe('DeliveryPage', () => {
    test('renders delivery page', () => {
        render(<DeliveryPage />);
        expect(screen.getByText('Choose a delivery option')).toBeInTheDocument();
    });

    test('handles delivery option change', () => {
        render(<DeliveryPage />);
        fireEvent.click(screen.getByLabelText('Delivery'));
        expect(screen.getByLabelText('Delivery')).toBeChecked();
    });

    test('handles delivery address change', async () => {
        render(<DeliveryPage />);
        fireEvent.click(screen.getByLabelText('Delivery'));
        fireEvent.change(screen.getByLabelText('House/Apartment Number:'), { target: { value: '123' } });
        expect(screen.getByLabelText('House/Apartment Number:')).toHaveValue('123');
    });


    describe('DeliveryPage - handleCollectionCenterChange', () => {
        test('sets estimated time to "1-2 days" when "wits" is selected', () => {
            render(<DeliveryPage />);
            fireEvent.click(screen.getByLabelText('Collection'));
            fireEvent.change(screen.getByTestId('collection'), { target: { value: 'wits' } });
            expect(screen.getByTestId('estimated-time')).toHaveTextContent('1-2 days');
        });

        test('handles collection center change', () => {
            render(<DeliveryPage />);
            fireEvent.click(screen.getByLabelText('Collection'));
            fireEvent.change(screen.getByTestId('collection'), { target: { value: 'field' } });
            expect(screen.getByTestId('estimated-time')).toHaveTextContent('3-4 days');
        });


        test('sets estimated time to "2-5 days" when "orange" is selected', () => {
            render(<DeliveryPage />);
            fireEvent.click(screen.getByLabelText('Collection'));
            fireEvent.change(screen.getByTestId('collection'), { target: { value: 'orange' } });
            expect(screen.getByTestId('estimated-time')).toHaveTextContent('2-5 days');
        });


    });

    // continue the tests from above

    describe('DeliveryPage - handleFormSubmit', () => {
        test('should log an error when fields are not filled', () => {
            console.log = jest.fn();
            render(<DeliveryPage />);
            fireEvent.click(screen.getByLabelText('Delivery'));
            fireEvent.click(screen.getByTestId('checkout-btn'));
            expect(console.log).toHaveBeenCalledWith('Please fill out all fields!');
        });

        test('should log an error when fields are not filled for collection', () => {
            console.log = jest.fn();
            render(<DeliveryPage />);
            fireEvent.click(screen.getByLabelText('Collection'));
            fireEvent.click(screen.getByTestId('checkout-btn'));
            expect(console.log).toHaveBeenCalledWith('Please fill out all fields!');
        });

        test('should log success when delivery fields are filled', () => {
            console.log = jest.fn();
            render(<DeliveryPage />);
            fireEvent.click(screen.getByLabelText('Delivery'));
            fireEvent.change(screen.getByLabelText('House/Apartment Number:'), { target: { value: '123' } });
            fireEvent.change(screen.getByLabelText('Street Name:'), { target: { value: 'Main' } });
            fireEvent.change(screen.getByLabelText('Suburb:'), { target: { value: 'Riverside' } });
            fireEvent.change(screen.getByLabelText('City:'), { target: { value: 'Towsville' } });
            fireEvent.change(screen.getByLabelText('Postal Code:'), { target: { value: '4567' } });
            fireEvent.click(screen.getByTestId('checkout-btn'));
            expect(console.log).toHaveBeenCalledWith('Order submitted successfully!');
        });

        test('should log success when collection fields are filled', () => {
            console.log = jest.fn();
            render(<DeliveryPage />);
            fireEvent.click(screen.getByLabelText('Collection'));
            fireEvent.change(screen.getByTestId('collection'), { target: { value: 'wits' } });
            fireEvent.click(screen.getByTestId('checkout-btn'));
            expect(console.log).toHaveBeenCalledWith('Order submitted successfully!');
        });
    });




});


