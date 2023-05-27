import { renderHook, act } from '@testing-library/react-hooks';
import useUserAuth from './useUserAuth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {getDocs, collection, query, where, getFirestore} from 'firebase/firestore';
import {initializeApp} from "firebase/app";

jest.mock('firebase/app', () => ({
    initializeApp: jest.fn().mockReturnValue({}),
}));

jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
    onAuthStateChanged: jest.fn(),
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
});

describe('useUserAuth', () => {
    it('should set userId if a user is authenticated', () => {
        onAuthStateChanged.mockImplementationOnce((callback) =>
            callback({ uid: 'testUserId' })
        );
        const { result } = renderHook(() => useUserAuth());
        expect(result.current.userId).toBe('testUserId');
    });

    it('should clear userId if a user is not authenticated', () => {
        onAuthStateChanged.mockImplementationOnce((callback) => callback(null));
        const { result } = renderHook(() => useUserAuth());
        expect(result.current.userId).toBe('');
    });

    it('should set isSeller if user is a seller', () => {
        // Mock the implementation of onAuthStateChanged to return a user object.
        // Then, simulate a Firestore query by immediately resolving the Promise with a non-empty snapshot.
        onAuthStateChanged.mockImplementationOnce((callback) =>
            callback({ uid: 'testUserId' })
        );
        // Mock the Firestore functions to simulate a user being a seller.
        getDocs.mockResolvedValue({ empty: false });

        const { result } = renderHook(() => useUserAuth());
        expect(result.current.isSeller).toBe(true);
    });

    it('should clear isSeller if user is not a seller', () => {
        onAuthStateChanged.mockImplementationOnce((callback) =>
            callback({ uid: 'testUserId' })
        );
        getDocs.mockResolvedValue({ empty: true });

        const { result } = renderHook(() => useUserAuth());
        expect(result.current.isSeller).toBe(false);
    });

    it('should clear isSeller if a user is not authenticated', () => {
        onAuthStateChanged.mockImplementationOnce((callback) => callback(null));
        const { result } = renderHook(() => useUserAuth());
        expect(result.current.isSeller).toBe(false);
    });
});
