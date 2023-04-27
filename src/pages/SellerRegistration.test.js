import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SellerRegistration from './SellerRegistration';
import '@testing-library/jest-dom/extend-expect';
import { isValidName, isValidEmail, isValidPassword, doPasswordsMatch, isValidPhoneNumber } from '../functions/SignupValidation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { saveSellerToFirestore } from '../functions/firestoreFunctions';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


jest.mock('firebase/auth');
jest.mock('../functions/firestoreFunctions');

const renderSellerRegistration = () => {
    render(
        <BrowserRouter>
            <SellerRegistration />
            <ToastContainer />
        </BrowserRouter>
    );
};

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

    test('renders User Email input field', () => {
        renderSellerRegistration();
        const userEmailInput = screen.getByTestId('user-email');
        expect(userEmailInput).toBeInTheDocument();
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
        const companyEmailInput = screen.getByTestId('company-email');
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

    test('renders existing Terms and Conditions checkbox', () => {
        renderSellerRegistration();
        const termsCheckbox = screen.getByLabelText(/I accept the Terms and Conditions/i);
        expect(termsCheckbox).toBeInTheDocument();
    });

    test('successful registration', async () => {
        createUserWithEmailAndPassword.mockResolvedValue({
            user: {
                uid: '12345',
                email: 'test@example.com',
            },
        });

        saveSellerToFirestore.mockResolvedValue({});

        renderSellerRegistration();

        const firstNameInput = screen.getByPlaceholderText(/First Name/i);
        const lastNameInput = screen.getByPlaceholderText(/Last Name/i);
        const emailInput = screen.getByTestId('user-email');
        const phoneNumberInput = screen.getByPlaceholderText(/Phone Number/i);
        const passwordInput = screen.getByPlaceholderText(/Password \(at least 6 characters\)/i);
        const confirmPasswordInput = screen.getByPlaceholderText(/Re-enter password/i);
        const companyNameInput = screen.getByPlaceholderText(/Company Name/i);
        const companyEmailInput = screen.getByTestId('company-email');
        const companyPhoneInput = screen.getByPlaceholderText(/Company Phone/i);
        const termsCheckbox = screen.getByLabelText(/I accept the Terms and Conditions/i);
        const registerButton = screen.getByRole('button', { name: /Register/i });

        fireEvent.change(firstNameInput, { target: { value: 'John' } });
        fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(phoneNumberInput, { target: { value: '1234567890' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
        fireEvent.change(companyNameInput, { target: { value: 'Test Company' } });
        fireEvent.change(companyEmailInput, { target: { value: 'testcompany@example.com' } });
        fireEvent.change(companyPhoneInput, { target: { value: '0987654321' } });
        fireEvent.click(termsCheckbox);

        fireEvent.click(registerButton);

        await waitFor(() => {
            const successMessage = screen.getByText(/Seller account created successfully!/i);
            expect(successMessage).toBeInTheDocument();
        });
    });
});
