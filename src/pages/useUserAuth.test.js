import { renderHook } from '@testing-library/react-hooks';
import useUserAuth from './useUserAuth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(() => ({})),
    onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    getDocs: jest.fn(),
}));

describe('useUserAuth hook', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('sets userId and isSeller when the user is logged in and a seller', async () => {
        getAuth.mockImplementation(() => ({ uid: '12345' }));
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback({ uid: '12345' });
            return jest.fn(); // Mock unsubscribe function
        });
        getDocs.mockResolvedValue({ empty: false });

        const { result, waitForNextUpdate } = renderHook(() => useUserAuth());
        await waitForNextUpdate();

        expect(result.current.userId).toBe('12345');
        expect(result.current.isSeller).toBe(true);
    });

    it('resets userId and isSeller when the user is not logged in', async () => {
        getAuth.mockImplementation(() => ({}));
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback(null);
            return jest.fn(); // Mock unsubscribe function
        });

        const { result, waitForNextUpdate } = renderHook(() => useUserAuth());
        await waitForNextUpdate();

        expect(result.current.userId).toBe('');
        expect(result.current.isSeller).toBe(false);
    });

    it('sets userId and resets isSeller when the user is logged in but not a seller', async () => {
        getAuth.mockImplementation(() => ({ uid: '12345' }));
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback({ uid: '12345' });
            return jest.fn(); // Mock unsubscribe function
        });
        getDocs.mockResolvedValue({ empty: true });

        const { result, waitForNextUpdate } = renderHook(() => useUserAuth());
        await waitForNextUpdate();

        expect(result.current.userId).toBe('12345');
        expect(result.current.isSeller).toBe(false);
    });
});
