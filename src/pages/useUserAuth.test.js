import { renderHook } from '@testing-library/react-hooks';
import useUserAuth from './useUserAuth';
import { auth } from './firebase';

jest.mock('./firebase', () => ({
    auth: {
        onAuthStateChanged: jest.fn(),
    },
}));

describe('useUserAuth hook', () => {
    beforeEach(() => {
        auth.onAuthStateChanged.mockClear();
    });

    it('should set userId if a user is authenticated', () => {
        auth.onAuthStateChanged.mockImplementationOnce((callback) =>
            callback({ uid: 'testUserId' })
        );

        const { result } = renderHook(() => useUserAuth());
        expect(result.current.userId).toBe('testUserId');
    });

    it('should clear userId if a user is not authenticated', () => {
        auth.onAuthStateChanged.mockImplementationOnce((callback) => callback(null));

        const { result } = renderHook(() => useUserAuth());
        expect(result.current.userId).toBe('');
    });

    it('should set isSeller if user is a seller', () => {
        // Mock the implementation of onAuthStateChanged to return a user object.
        // Then, simulate a Firestore query by immediately resolving the Promise with a non-empty snapshot.
        auth.onAuthStateChanged.mockImplementationOnce((callback) =>
            callback({ uid: 'testUserId' })
        );
        // Mock the Firestore functions to simulate a user being a seller.
        jest.mock('firebase/firestore', () => ({
            getDocs: jest.fn().mockResolvedValue({ empty: false }),
        }));

        const { result } = renderHook(() => useUserAuth());
        expect(result.current.isSeller).toBe(true);
    });

    it('should clear isSeller if user is not a seller', () => {
        auth.onAuthStateChanged.mockImplementationOnce((callback) =>
            callback({ uid: 'testUserId' })
        );
        jest.mock('firebase/firestore', () => ({
            getDocs: jest.fn().mockResolvedValue({ empty: true }),
        }));

        const { result } = renderHook(() => useUserAuth());
        expect(result.current.isSeller).toBe(false);
    });

    it('should clear isSeller if a user is not authenticated', () => {
        auth.onAuthStateChanged.mockImplementationOnce((callback) => callback(null));

        const { result } = renderHook(() => useUserAuth());
        expect(result.current.isSeller).toBe(false);
    });
});
