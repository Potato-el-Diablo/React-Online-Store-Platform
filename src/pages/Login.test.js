import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import '@testing-library/jest-dom/extend-expect';
import { isValidEmail, isValidPassword } from '../functions/SignupValidation';
import {toast} from "react-toastify";



jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
    },
}));

describe('Login Component', () => {
    it('should call toast.error if email is invalid', () => {
        render(
            <BrowserRouter>
                <Login/>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Email address'), {
            target: {value: 'invalid-email'},
        });

        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: {value: 'password123'},
        });

        fireEvent.click(screen.getByTestId('login-button'));

        expect(isValidEmail('invalid-email')).toBe(false);
        expect(isValidPassword('password123')).toBe(true);
        expect(toast.error).toHaveBeenCalledWith(
            'Invalid email address. Please provide a valid email address.'
        );
    });
    it('should call toast.error if password is invalid', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Email address'), {
            target: { value: 'valid@email.com' },
        });

        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: '123' },
        });

        fireEvent.click(screen.getByTestId('login-button'));

        expect(isValidEmail('valid@email.com')).toBe(true);
        expect(isValidPassword('123')).toBe(false);
        expect(toast.error).toHaveBeenCalledWith(
            'Invalid password. Password must be at least 6 characters long.'
        );
    });
});
const renderLogin = () => {
    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );
};



describe("isValidEmail", () => {
    test("valid email", () => {
        expect(isValidEmail("test@example.com")).toBe(true);
    });

    test("invalid email", () => {
        expect(isValidEmail("invalidemail.com")).toBe(false);
    });
});

describe("isValidPassword", () => {
    test("valid password", () => {
        expect(isValidPassword("password123")).toBe(true);
    });

    test("invalid password", () => {
        expect(isValidPassword("pwd1")).toBe(false);
    });
});

describe('Login', () => {
    test('renders the Login component', () => {
        renderLogin();
        const loginTitle = screen.getByRole('heading', { name: /Login/i });
        expect(loginTitle).toBeInTheDocument();
    });

    test('renders Sign in with Google button', () => {
        renderLogin();
        const signInWithGoogleButton = screen.getByText(/Sign in with Google/i);
        expect(signInWithGoogleButton).toBeInTheDocument();
    });

    test('renders Email input field', () => {
        renderLogin();
        const emailInput = screen.getByPlaceholderText(/Email address/i);
        expect(emailInput).toBeInTheDocument();
    });

    test('renders Password input field', () => {
        renderLogin();
        const passwordInput = screen.getByPlaceholderText(/Password/i);
        expect(passwordInput).toBeInTheDocument();
    });

    test('renders Login button', () => {
        renderLogin();
        const loginButton = screen.getByRole('button', { name: /Login/i });
        expect(loginButton).toBeInTheDocument();
    });

    test('renders Sign Up button', () => {
        renderLogin();
        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
        expect(signUpButton).toBeInTheDocument();
    });

    test('renders Forgot Password link', () => {
        renderLogin();
        const forgotPasswordLink = screen.getByRole('link', { name: /Forgot Password\?/i });
        expect(forgotPasswordLink).toBeInTheDocument();
    });

});
