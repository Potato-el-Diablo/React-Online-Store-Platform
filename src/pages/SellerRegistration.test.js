import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SellerRegistration from './SellerRegistration';
import '@testing-library/jest-dom/extend-expect';
import { isValidName, isValidEmail, isValidPassword, doPasswordsMatch, isValidPhoneNumber } from '../functions/SignupValidation';

// Mock the toast library
jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

const renderSellerRegistration = () => {
    render(
        <BrowserRouter>
            <SellerRegistration />
        </BrowserRouter>
    );
};
test('input fields for personal and business details', () => {
    renderSellerRegistration()
    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
        target: {value: 'John'},
    });
    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
        target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByTestId('personal-email'), {
        target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
        target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password \(at least 6 characters\)/i), {
        target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/re-enter password/i), {
        target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/company name/i), {
        target: { value: 'John Doe Ltd.' },
    });
    fireEvent.change(screen.getByTestId('company-email'), {
        target: { value: 'info@johndoeltd.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/company phone/i), {
        target: { value: '0987654321' },
    });
    expect(screen.getByPlaceholderText(/first name/i)).toHaveValue('John');
    expect(screen.getByPlaceholderText(/last name/i)).toHaveValue('Doe');
    expect(screen.getByTestId('personal-email')).toHaveValue('john@example.com');
    expect(screen.getByPlaceholderText(/phone number/i)).toHaveValue('1234567890');
    expect(screen.getByPlaceholderText(/password \(at least 6 characters\)/i)).toHaveValue('password123');
    expect(screen.getByPlaceholderText(/re-enter password/i)).toHaveValue('password123');
    expect(screen.getByPlaceholderText(/company name/i)).toHaveValue('John Doe Ltd.');
    expect(screen.getByTestId('company-email')).toHaveValue('info@johndoeltd.com');
    expect(screen.getByPlaceholderText(/company phone/i)).toHaveValue('0987654321');
});

describe("isValidName", () => {
    test("valid name", () => {
        expect(isValidName("John")).toBe(true);
    });

    test("invalid name", () => {
        expect(isValidName("")).toBe(false);
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
    describe("isValidEmail", () => {
        test("valid email", () => {
            expect(isValidEmail("test@example.com")).toBe(true);
        });

        test("invalid email", () => {
            expect(isValidEmail("test@example")).toBe(false);
        });
    });

describe("isValidPassword", () => {
    test("valid password", () => {
        expect(isValidPassword("password123")).toBe(true);
    });

    test("invalid password", () => {
        expect(isValidPassword("pass")).toBe(false);
    });
});

describe("doPasswordsMatch", () => {
    test("matching passwords", () => {
        expect(doPasswordsMatch("password123", "password123")).toBe(true);
    });

    test("non-matching passwords", () => {
        expect(doPasswordsMatch("password123", "password456")).toBe(false);
    });
});

describe('SellerRegistration', () => {
    test('renders the SellerRegistration component', () => {
        renderSellerRegistration();
        const registrationTitle = screen.getByRole('heading', {name: /Create Business Account/i});
        expect(registrationTitle).toBeInTheDocument();
    });

    test('renders First Name input field', () => {
        renderSellerRegistration();
        const firstNameInput = screen.getByPlaceholderText(/First Name/i);
        expect(firstNameInput).toBeInTheDocument();
    });

    test('renders Last Name input field', () => {
        renderSellerRegistration();
        const lastNameInput = screen.getByPlaceholderText(/Last Name/i);
        expect(lastNameInput).toBeInTheDocument();
    });

    test('renders Email input field', () => {
        renderSellerRegistration();
        const emailInputs = screen.getAllByPlaceholderText(/Email/i);
        expect(emailInputs.length).toBe(2);
    });

    test('renders Phone Number input field', () => {
        renderSellerRegistration();
        const phoneNumberInput = screen.getByPlaceholderText(/Phone Number/i);
        expect(phoneNumberInput).toBeInTheDocument();
    });

    test('renders Password input field', () => {
        renderSellerRegistration();
        const passwordInput = screen.getByPlaceholderText(/Password \(at least 6 characters\)/i);
        expect(passwordInput).toBeInTheDocument();
    });

    test('renders Re-enter password input field', () => {
        renderSellerRegistration();
        const confirmPasswordInput = screen.getByPlaceholderText(/Re-enter password/i);
        expect(confirmPasswordInput).toBeInTheDocument();
    });

    test('renders Company Name input field', () => {
        renderSellerRegistration();
        const companyNameInput = screen.getByPlaceholderText(/Company Name/i);
        expect(companyNameInput).toBeInTheDocument();
    });

    test('renders Company Email input field', () => {
        renderSellerRegistration();
        const companyEmailInput = screen.getByPlaceholderText(/Company Email/i);
        expect(companyEmailInput).toBeInTheDocument();
    });

    test('renders Company Phone input field', () => {
        renderSellerRegistration();
        const companyPhoneInput = screen.getByPlaceholderText(/Company Phone/i);
        expect(companyPhoneInput).toBeInTheDocument();
    });

    test('renders Terms and Conditions checkbox', () => {
        renderSellerRegistration();

    });
});
