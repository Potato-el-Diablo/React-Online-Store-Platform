import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SellerRegistration from './SellerRegistration';
import '@testing-library/jest-dom/extend-expect';
import { isValidName, isValidEmail, isValidPassword, doPasswordsMatch, isValidPhoneNumber } from '../functions/SignupValidation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { saveSellerToFirestore,doesEmailExistInSellerCollection } from '../functions/firestoreFunctions';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { auth } from './firebase';

jest.mock('./firebase', () => ({
    auth: {},
    createUserWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn(),
    GoogleAuthProvider: jest.fn(),
}));

auth.createUserWithEmailAndPassword = jest.fn();

jest.mock('../functions/firestoreFunctions', () => ({
    doesEmailExistInSellerCollection: jest.fn(),
    saveSellerToFirestore: jest.fn(),
}));
jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
    ToastContainer: () => <div>Toast Container</div>,
}));

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

let firstNameInput, lastNameInput, emailInput, phoneNumberInput, passwordInput, confirmPasswordInput, companyNameInput, companyEmailInput, companyPhoneInput, termsCheckbox, registerButton;

const setup = () => {
    renderSellerRegistration();
    createUserWithEmailAndPassword.mockResolvedValue({
        user: {
            uid: '12345',
            email: 'test@example.com',
        },
    });

    firstNameInput = screen.getByPlaceholderText(/First Name/i);
    lastNameInput = screen.getByPlaceholderText(/Last Name/i);
    emailInput = screen.getByTestId('user-email');
    phoneNumberInput = screen.getByPlaceholderText(/Phone Number/i);
    passwordInput = screen.getByPlaceholderText(/Password \(at least 6 characters\)/i);
    confirmPasswordInput = screen.getByPlaceholderText(/Re-enter password/i);
    companyNameInput = screen.getByPlaceholderText(/Company Name/i);
    companyEmailInput = screen.getByTestId('company-email');
    companyPhoneInput = screen.getByPlaceholderText(/Company Phone/i);
    termsCheckbox = screen.getByLabelText(/I accept the Terms and Conditions/i);
    registerButton = screen.getByRole('button', { name: /Register/i });

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

    return {
        firstNameInput,
        lastNameInput,
        emailInput,
        phoneNumberInput,
        passwordInput,
        confirmPasswordInput,
        companyNameInput,
        companyEmailInput,
        companyPhoneInput,
        termsCheckbox,
        registerButton,
    };
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
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call toast.error if first name or last name is invalid', () => {
        renderSellerRegistration();

        fireEvent.click(screen.getByText('Register'));

        expect(toast.error).toHaveBeenCalledWith('Invalid first name or last name. Please provide valid names.');
    });

    it('should call createUserWithEmailAndPassword and toast.success when the form is submitted successfully', async () => {
        doesEmailExistInSellerCollection.mockResolvedValue(false);

        createUserWithEmailAndPassword.mockResolvedValue({
            user: {
                uid: '123',
                email: 'user@test.com',
            },
        });
    });
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

    test('renders existing Terms and Conditions checkbox', () => {
        renderSellerRegistration();
        const termsCheckbox = screen.getByLabelText(/I accept the Terms and Conditions/i);
        expect(termsCheckbox).toBeInTheDocument();
    });

    //The functionality tests start here


    test('successful registration', async () => {


        saveSellerToFirestore.mockResolvedValue({});

        const {
            registerButton,
        } = setup();

        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Seller account created successfully!');
        });
    });
    test('should show error for invalid first name', async () => {
        const {
            firstNameInput,
            registerButton,
        } = setup();

        fireEvent.change(firstNameInput, { target: { value: '' } }); // Invalid first name

        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Invalid first name or last name. Please provide valid names.');
        });
    });

    test('should show error for invalid last name', async () => {
        const {
            lastNameInput,
            registerButton,
        } = setup();

        fireEvent.change(lastNameInput, { target: { value: '' } }); // Invalid last name

        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Invalid first name or last name. Please provide valid names.');
        });
    });
    test('should show error for invalid personal email address', () => {
        const { emailInput, registerButton } = setup();

        fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
        fireEvent.click(registerButton);

        expect(toast.error).toHaveBeenCalledWith('Invalid personal email address. Please provide a valid email address.');
    });

    test('should show error for invalid personal phone number', () => {
        const { phoneNumberInput, registerButton } = setup();

        fireEvent.change(phoneNumberInput, { target: { value: 'invalidphone' } });
        fireEvent.click(registerButton);

        expect(toast.error).toHaveBeenCalledWith('Invalid personal phone number. Please provide a valid phone number.');
    });

    test('should show error for invalid password', () => {
        const { passwordInput, registerButton } = setup();

        fireEvent.change(passwordInput, { target: { value: 'short' } });
        fireEvent.click(registerButton);

        expect(toast.error).toHaveBeenCalledWith('Invalid password. Password must be at least 6 characters long.');
    });

    test('should show error for non-matching passwords', () => {
        const { confirmPasswordInput, registerButton } = setup();

        fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });
        fireEvent.click(registerButton);

        expect(toast.error).toHaveBeenCalledWith('Passwords do not match. Please make sure you have entered the same password twice.');
    });

    test('should show error for invalid company name', () => {
        const { companyNameInput, registerButton } = setup();

        fireEvent.change(companyNameInput, { target: { value: '' } });
        fireEvent.click(registerButton);

        expect(toast.error).toHaveBeenCalledWith('Invalid company name. Please provide a valid company name.');
    });

    test('should show error for invalid company email address', () => {
        const { companyEmailInput, registerButton } = setup();

        fireEvent.change(companyEmailInput, { target: { value: 'invalidemail' } });
        fireEvent.click(registerButton);

        expect(toast.error).toHaveBeenCalledWith('Invalid company email address. Please provide a valid email address.');
    });

    test('should show error for invalid company phone number', () => {
        const { companyPhoneInput, registerButton } = setup();

        fireEvent.change(companyPhoneInput, { target: { value: 'invalidphone' } });
        fireEvent.click(registerButton);

        expect(toast.error).toHaveBeenCalledWith('Invalid company phone number. Please provide a valid phone number.');
    });



});
