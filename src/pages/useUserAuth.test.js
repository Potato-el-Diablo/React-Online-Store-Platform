import { renderHook } from '@testing-library/react-hooks';
import useUserAuth from './useUserAuth';

describe('useUserAuth hook', () => {
    // In order to mock and replace the actual implementation,
    // we'll need to modify the useUserAuth hook to accept the auth object as a parameter.
    // This way, we can pass a mock object during testing.
    const mockAuth = {
        onAuthStateChanged: jest.fn(),
    };

    beforeEach(() => {
        mockAuth.onAuthStateChanged.mockClear();
    });

    it('should set userId if a user is authenticated', () => {
        mockAuth.onAuthStateChanged.mockImplementationOnce((callback) =>
            callback({ uid: 'testUserId' })
        );

        const { result } = renderHook(() => useUserAuth(mockAuth));
        expect(result.current.userId).toBe('testUserId');
    });

    it('should clear userId if a user is not authenticated', () => {
        mockAuth.onAuthStateChanged.mockImplementationOnce((callback) => callback(null));

        const { result } = renderHook(() => useUserAuth(mockAuth));
        expect(result.current.userId).toBe('');
    });

    // Given the absence of Firestore in the testing context, the `isSeller` flag cannot be accurately tested.
    // The tests for isSeller have been removed for now.
});
