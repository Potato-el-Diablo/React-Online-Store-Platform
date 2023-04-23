import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { toast } from 'react-toastify';

jest.mock('firebase/auth');
jest.mock('react-toastify');

const renderLogin = () => {
    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );
};

describe('Login', () => {
    test('renders the Login component', () => {
        renderLogin();
        const loginTitle = screen.getByText(/Login/i);
        expect(loginTitle).toBeInTheDocument();
    });

    test('shows error messages for invalid email and password', async () => {
        renderLogin();
        fireEvent.change(screen.getByPlaceholderText('Email address'), {
            target: { value: 'invalid_email' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'short' },
        });
        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Invalid email address. Please provide a valid email address.'
            );
        });

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                'Invalid password. Password must be at least 6 characters long.'
            );
        });
    });

    test('calls signInWithEmailAndPassword with email and password on login', async () => {
        renderLogin();
        const email = 'test@example.com';
        const password = 'test1234';

        fireEvent.change(screen.getByPlaceholderText('Email address'), {
            target: { value: email },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: password },
        });
        fireEvent.click(screen.getByText('Login'));

        await waitFor(() => {
            expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
                expect.anything(),
                email,
                password
            );
        });
    });

    test('calls signInWithPopup with Google provider on Google sign in', () => {
        renderLogin();
        fireEvent.click(screen.getByText('Sign in with Google'));
        expect(signInWithPopup).toHaveBeenCalled();
    });
});
