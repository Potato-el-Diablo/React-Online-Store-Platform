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

    // Click the 'Edit' button
    fireEvent.click(screen.getByText('Edit Review'));
});

test('should display user information when "Show Personal Info" button is clicked', async () => {
    // Mock getDocs for user info
    getDocs.mockResolvedValueOnce({
        docs: [
            {
                id: '1',
                data: jest.fn().mockReturnValue({
                    uid: '123',
                    name: 'Test User',
                    email: 'testuser@example.com',
                    mobileNumber: '1234567890',
                }),
            },
        ],
    });

    render(
        <Router>
            <MyAccount />
        </Router>
    );

    // Click the 'Show personal info' button
    fireEvent.click(screen.getByText('Show personal info'));

    // Wait for the user information to appear in the document
    expect(await screen.findByText('Name: Test User')).toBeInTheDocument();
    expect(screen.getByText('Email: testuser@example.com')).toBeInTheDocument();
    expect(screen.getByText('Mobile Number: 1234567890')).toBeInTheDocument();
});

test('should show appropriate message when there are no orders', async () => {
    useUserAuth.mockReturnValue({
        userId: '123',
        isSeller: false,
    });

    getDocs.mockResolvedValueOnce({ docs: [] });  // No orders

    render(
        <Router>
            <MyAccount />
        </Router>
    );

    // Click 'View order history'
    fireEvent.click(screen.getByText('View order history'));

    expect(await screen.findByText('You have not placed any orders yet.')).toBeInTheDocument();
});

test('should show appropriate message when there are no reviews', async () => {
    useUserAuth.mockReturnValue({
        userId: '123',
        isSeller: false,
    });

    getDocs.mockResolvedValueOnce({ docs: [] });  // No reviews

    render(
        <Router>
            <MyAccount />
        </Router>
    );

    // Click 'Show your reviews'
    fireEvent.click(screen.getByText('Show your reviews'));

    expect(await screen.findByText('You have not submitted any reviews yet.')).toBeInTheDocument();
});

test('should display seller information when user is a seller', async () => {
    useUserAuth.mockReturnValue({
        userId: '123',
        isSeller: true,
    });

    getDocs.mockResolvedValueOnce({
        docs: [
            {
                id: '1',
                data: jest.fn().mockReturnValue({
                    uid: '123',
                    name: 'Test Seller',
                    email: 'testseller@example.com',
                    mobileNumber: '1234567890',
                    companyName: 'Test Company',
                    companyTelephone: '0987654321',
                }),
            },
        ],
    });

    render(
        <Router>
            <MyAccount />
        </Router>
    );

    // Click 'Show personal info'
    fireEvent.click(screen.getByText('Show personal info'));

    expect(await screen.findByText('Company Name: Test Company')).toBeInTheDocument();
    expect(screen.getByText('Company Telephone: 0987654321')).toBeInTheDocument();
});

test('should show appropriate message when there is no user information', async () => {
    useUserAuth.mockReturnValue({
        userId: '123',
        isSeller: false,
    });

    getDocs.mockResolvedValueOnce({ docs: [] });  // No user info

    render(
        <Router>
            <MyAccount />
        </Router>
    );

    // Click 'Show personal info'
    fireEvent.click(screen.getByText('Show personal info'));

    expect(await screen.findByText('No user information available.')).toBeInTheDocument();
});