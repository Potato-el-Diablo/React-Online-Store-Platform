import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignupBuyer from './SignupBuyer';
import '@testing-library/jest-dom/extend-expect';
import { isValidName, isValidEmail, isValidPassword, doPasswordsMatch, isValidPhoneNumber } from '../functions/SignupValidation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { saveBuyerToFirestore } from '../functions/firestoreFunctions';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
    ToastContainer: () => <div>Toast Container</div>,
}));

jest.mock('firebase/auth', () => ({
    createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock('../functions/firestoreFunctions', () => ({
    saveBuyerToFirestore: jest.fn(),
}));

jest.mock('firebase/auth');
jest.mock('../functions/firestoreFunctions');
jest.mock('./firebase', () => ({ auth: {} }));

const renderSignupBuyer = () => {
    render(
        <BrowserRouter>
            <SignupBuyer />
            <ToastContainer />
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
    afterEach(() => {
        jest.clearAllMocks();
    });

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
    test('successfully submit form', async () => {
        renderSignupBuyer();
        const nameInput = screen.getByPlaceholderText(/Name/i);
        const emailInput = screen.getByPlaceholderText(/Email address/i);
        const phoneNumberInput = screen.getByPlaceholderText(/Phone Number/i);
        const passwordInput = screen.getByPlaceholderText(/Password \(at least 6 characters\)/i);
        const confirmPasswordInput = screen.getByPlaceholderText(/Re-enter password/i);
        const signupButton = screen.getByRole('button', { name: /Sign up/i });

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(phoneNumberInput, { target: { value: '1234567890' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

        createUserWithEmailAndPassword.mockResolvedValueOnce({
            user: {
                uid: '12345',
            },
        });
        saveBuyerToFirestore.mockResolvedValueOnce();

        fireEvent.click(signupButton);

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('User created successfully!');
        });

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'test@example.com', 'password123');
        expect(saveBuyerToFirestore).toHaveBeenCalledWith(expect.any(Object), 'John Doe', '1234567890');
    });

    it('should display an error message if the name is invalid', () => {
        renderSignupBuyer();

        const nameInput = screen.getByPlaceholderText(/Name/i);
        const emailInput = screen.getByPlaceholderText(/Email address/i);
        const phoneNumberInput = screen.getByPlaceholderText(/Phone Number/i);
        const passwordInput = screen.getByPlaceholderText(/Password \(at least 6 characters\)/i);
        const confirmPasswordInput = screen.getByPlaceholderText(/Re-enter password/i);
        const signupButton = screen.getByRole('button', { name: /Sign up/i });

        fireEvent.change(nameInput, { target: { value: '' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
        fireEvent.change(phoneNumberInput, { target: { value: '1234567890' } });

        fireEvent.click(signupButton);

        expect(toast.error).toHaveBeenCalledWith('Invalid name. Please provide a valid name.');
    });
    // Add similar tests for email, password, phone number, and password confirmation

});
