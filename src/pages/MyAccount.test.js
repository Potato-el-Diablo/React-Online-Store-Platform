import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {getDocs, collection, query, where, getFirestore} from 'firebase/firestore';
import MyAccount from './MyAccount';
import {useEffect, useState} from "react";
import { act } from '@testing-library/react';
import {initializeApp} from "firebase/app";
import {BrowserRouter as Router} from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import useUserAuth from './useUserAuth';

//Mock the necessary dependancies
jest.mock('firebase/app', () => ({
    initializeApp: jest.fn().mockReturnValue({}),
}));
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
    onAuthStateChanged: jest.fn(),
}));

jest.mock('./useUserAuth', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn().mockReturnValue({}),
    getDocs: jest.fn(),
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
}));



beforeEach(() => {
    // Reset all mocks before each test
    initializeApp.mockClear().mockReturnValue({});
    getAuth.mockClear();
    onAuthStateChanged.mockClear();
    getFirestore.mockClear().mockReturnValue({});
    getDocs.mockClear();
    collection.mockClear();
    query.mockClear();
    where.mockClear();


    useUserAuth.mockReturnValue({
        userId: '123',
        isSeller: false,
    });

    getDocs.mockResolvedValue({
        docs: [
            {
                id: '1',
                data: jest.fn().mockReturnValue({
                    userId: '123',
                    orderNumber: '123',
                    createdAt: { toDate: () => new Date('2022-01-01') },
                    items: [{ id: '1', image: 'image1', name: 'Item 1' }],
                }),
            },
        ],
    });

    collection.mockReturnValue({});
    query.mockReturnValue({});
    where.mockReturnValue({});
});

test('renders MyAccount and shows order history on click', async () => {
    render(
        <Router>
            <MyAccount />
        </Router>
    );


    // Click the 'View order history' button
    fireEvent.click(screen.getByText('View order history'));

    // Wait for the order to appear in the document
    expect(await screen.findByText('Order Number: 123')).toBeInTheDocument();
});

test('renders MyAccount and shows reviews on click', async () => {
    render(
        <Router>
            <MyAccount />
        </Router>
    );

    // Mock getDocs for reviews
    getDocs.mockResolvedValueOnce({
        docs: [
            {
                id: '1',
                data: jest.fn().mockReturnValue({
                    userId: '123',
                    productName: 'Product 1',
                    rating: 5,
                    comment: 'Great product!',
                }),
            },
        ],
    });

    // Click the 'Show your reviews' button
    fireEvent.click(screen.getByText('Show your reviews'));

    // Wait for the review to appear in the document
    expect(await screen.findByText('Review for Product 1')).toBeInTheDocument();
});

