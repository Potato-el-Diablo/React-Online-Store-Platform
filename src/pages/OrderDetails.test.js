import { render, waitFor, screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import OrderDetails from './OrderDetails';
import { getDocs, collection, query, where } from 'firebase/firestore';
import '@testing-library/jest-dom/extend-expect';

//Mock the necessary dependencies
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn().mockReturnValue({}),
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    getDocs: jest.fn(),
}));

describe('OrderDetails', () => {
    beforeEach(() => {
        useParams.mockReturnValue({ orderNumber: '123' });
        //Mocks a document with order details
        getDocs.mockResolvedValue({
            docs: [
                {
                    id: '1',
                    data: jest.fn().mockReturnValue({
                        orderNumber: '123',
                        createdAt: { toDate: () => new Date('2022-01-01') },
                        items: [
                            { id: '1', image: 'image1', name: 'Item 1', price: 100, quantity: 2 },
                        ],
                    }),
                },
            ],
        });

        collection.mockReturnValue({});
        query.mockReturnValue({});
        where.mockReturnValue({});
    });

    //Mocks are needed for correct rendering
    it('should render order details correctly', async () => {
        render(
            <Router>
                <OrderDetails />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Order Details')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText('Order Number: 123')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText('Item 1')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText('Subtotal: R200.00')).toBeInTheDocument();
        });
    });
});
