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

// Mock required components and functions
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

// Utility function to render SignupBuyer component
const renderSignupBuyer = () => {
    render(
        <BrowserRouter>
            <SignupBuyer />
            <ToastContainer />
        </BrowserRouter>
    );
};
// Set up initial state for testing
let nameInput,emailInput,phoneNumberInput,passwordInput,confirmPasswordInput,signupButton;

const setup = () => {
    renderSignupBuyer();
    createUserWithEmailAndPassword.mockResolvedValue({
        user: {
            uid: '12345',
            email: 'test@example.com',
        },
    });

    // Get input fields and button for testing
    nameInput = screen.getByPlaceholderText(/Name/i);
    emailInput = screen.getByPlaceholderText(/Email address/i);
    phoneNumberInput= screen.getByPlaceholderText(/Phone Number/i);
    passwordInput= screen.getByPlaceholderText(/Password \(at least 6 characters\)/i);
    confirmPasswordInput= screen.getByPlaceholderText(/Re-enter password/i);
    signupButton= screen.getByRole('button', { name: /Sign up/i });

    // Set initial values for input fields
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(phoneNumberInput, { target: { value: '1234567890' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(signupButton);
    return {
        nameInput,emailInput,phoneNumberInput,passwordInput,confirmPasswordInput,signupButton
    };
};

// Test cases for validation functions
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

// Test cases for rendering and interacting with SignupBuyer component
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
    //rendering ends here

    //tests that a user is successfully added to the database
    test('successfully submit form', async () => {

        saveBuyerToFirestore.mockResolvedValueOnce();
        const { signupButton } = setup();

        fireEvent.click(signupButton);

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('User created successfully!');
        });

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'test@example.com', 'password123');
        expect(saveBuyerToFirestore).toHaveBeenCalledWith(expect.any(Object), 'John Doe', '1234567890');
    });


    // Test cases for displaying the correct error message depending on the invalid input
    it('should display an error message if the name is invalid', () => {
        const { nameInput, signupButton } = setup();

        fireEvent.change(nameInput, { target: { value: '' } });

        fireEvent.click(signupButton);

        expect(toast.error).toHaveBeenCalledWith('Invalid name. Please provide a valid name.');
    });
    it('should display an error message if the email is invalid', () => {
        const {  emailInput, signupButton } = setup();

        fireEvent.change(emailInput, { target: { value: 'testexample.com' } });

        fireEvent.click(signupButton);

        expect(toast.error).toHaveBeenCalledWith('Invalid email address. Please provide a valid email address.');
    });

    it('should display an error message if the password is invalid', () => {
        const { passwordInput, confirmPasswordInput, signupButton } = setup();

        fireEvent.change(passwordInput, { target: { value: 'p21' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'p21' } });

        fireEvent.click(signupButton);

        expect(toast.error).toHaveBeenCalledWith('Invalid password. Password must be at least 6 characters long.');
    });
    it('should display an error message if the mobile number is invalid', () => {
        const { phoneNumberInput, signupButton } = setup();

        fireEvent.change(phoneNumberInput, { target: { value: '12390' } });

        fireEvent.click(signupButton);

        expect(toast.error).toHaveBeenCalledWith('Invalid phone number. Please provide a valid phone number.');
    });
    it('should display an error message if the passwords do not match', () => {
        const { passwordInput, confirmPasswordInput, signupButton } = setup();

        fireEvent.change(passwordInput, { target: { value: 'WorldHello' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'HelloWorld' } });

        fireEvent.click(signupButton);

        expect(toast.error).toHaveBeenCalledWith('Passwords do not match. Please make sure you have entered the same password twice.');
    });

});
