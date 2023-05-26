import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {getDocs, collection, query, getFirestore, doc, updateDoc, getDoc, where} from 'firebase/firestore';
import WishlistPage from './WishlistPage';
import {useEffect, useState} from "react";
import { act } from '@testing-library/react';
import {initializeApp} from "firebase/app";
import {BrowserRouter as Router} from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import useUserAuth from './useUserAuth';

jest.mock('./firebase', () => ({
    auth: {},
    db: {},
}));

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
    doc: jest.fn(),
    updateDoc: jest.fn(),
    getDoc: jest.fn().mockResolvedValue({ exists: true, data: jest.fn().mockReturnValue({products: ['1']}) }),
}));

beforeEach(() => {
    initializeApp.mockClear().mockReturnValue({});
    getAuth.mockClear();
    onAuthStateChanged.mockClear();
    getFirestore.mockClear().mockReturnValue({});
    getDocs.mockClear();
    collection.mockClear();
    query.mockClear();
    where.mockClear();
    doc.mockClear();
    updateDoc.mockClear();
    getDoc.mockClear().mockResolvedValue({ exists: true, data: jest.fn().mockReturnValue({products: ['1']}) });

    useUserAuth.mockReturnValue({
        userId: '123',
        isSeller: false,
    });
});

test('renders WishlistPage and shows wishlist on load', async () => {
    render(
        <Router>
            <WishlistPage />
        </Router>
    );

    // Wait for the wishlist to appear in the document
    expect(await screen.findByText('Items in wishlist')).toBeInTheDocument();
});

test('renders WishlistPage and shows message when wishlist is empty', async () => {
    getDoc.mockResolvedValueOnce({ exists: true, data: jest.fn().mockReturnValue({products: []}) });

    render(
        <Router>
            <WishlistPage />
        </Router>
    );

    // Wait for the message to appear in the document
    expect(await screen.findByText('Your wishlist is empty.')).toBeInTheDocument();
});

test('renders WishlistPage and shows loading message', async () => {
    render(
        <Router>
            <WishlistPage />
        </Router>
    );

    // Wait for the loading message to appear in the document
    expect(await screen.findByText('Loading...')).toBeInTheDocument();
});
