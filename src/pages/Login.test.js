import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import '@testing-library/jest-dom/extend-expect';
import { isValidPassword, onLogin, signInWithGoogle } from "./Login";


import { isValidEmail } from '../functions/SignupValidation';

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
