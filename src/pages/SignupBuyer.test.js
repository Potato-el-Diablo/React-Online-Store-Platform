import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignupBuyer from './SignupBuyer';
import '@testing-library/jest-dom/extend-expect';
import { isValidName, isValidEmail, isValidPassword, doPasswordsMatch, isValidPhoneNumber } from '../functions/SignupValidation';

const renderSignupBuyer = () => {
    render(
        <BrowserRouter>
            <SignupBuyer />
        </BrowserRouter>
    );
};

describe("isValidName", () => {
    test("valid name", () => {
        expect(isValidName("John Doe")).toBe(true);
    });

    test("invalid name", () => {
        expect(isValidName("")).toBe(false);
    });
});

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

describe("doPasswordsMatch", () => {
    test("matching passwords", () => {
        expect(doPasswordsMatch("password123", "password123")).toBe(true);
    });

    test("non-matching passwords", () => {
        expect(doPasswordsMatch("password123", "password321")).toBe(false);
    });
});

describe("isValidPhoneNumber", () => {
    test("valid phone number", () => {
        expect(isValidPhoneNumber("1234567890")).toBe(true);
    });

    test("invalid phone number", () => {
        expect(isValidPhoneNumber("123")).toBe(false);
    });
});

describe('SignupBuyer', () => {
    test('renders the SignupBuyer component', () => {
        renderSignupBuyer();
        const signupTitle = screen.getByRole('heading', { name: /Sign up as a Buyer/i });
        expect(signupTitle).toBeInTheDocument();
    });

    test('renders Name input field', () => {
        renderSignupBuyer();
        const nameInput = screen.getByPlaceholderText(/Name/i);
        expect(nameInput).toBeInTheDocument();
    });

    test('renders Email input field', () => {
        renderSignupBuyer();
        const emailInput = screen.getByPlaceholderText(/Email address/i);
        expect(emailInput).toBeInTheDocument();
    });

    test('renders Phone Number input field', () => {
        renderSignupBuyer();
        const phoneNumberInput = screen.getByPlaceholderText(/Phone Number/i);
        expect(phoneNumberInput).toBeInTheDocument();
    });

    test('renders Password input field', () => {
        renderSignupBuyer();
        const passwordInput = screen.getByPlaceholderText(/Password \(at least 6 characters\)/i);
        expect(passwordInput).toBeInTheDocument();
    });

    test('renders Re-enter password input field', () => {
        renderSignupBuyer();
        const confirmPasswordInput = screen.getByPlaceholderText(/Re-enter password/i);
        expect(confirmPasswordInput).toBeInTheDocument();
    });

    test('renders Sign up button', () => {
        renderSignupBuyer();
        const signUpButton = screen.getByRole('button', { name: /Sign up/i });
        expect(signUpButton).toBeInTheDocument();
    });
});
