import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import SignupBuyer from './SignupBuyer';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { saveBuyerToFirestore } from '../functions/firestoreFunctions';
import { toast } from 'react-toastify';
import { getAuth } from 'firebase/auth';
import {Router} from "react-router-dom";
//
// // Mock the Firebase functions and toast
// jest.mock('firebase/auth', () => ({
//     createUserWithEmailAndPassword: jest.fn(),
// }));
//
// jest.mock('../functions/firestoreFunctions', () => ({
//     saveBuyerToFirestore: jest.fn(),
// }));
//
// jest.mock('react-toastify', () => ({
//     toast: {
//         error: jest.fn(),
//         success: jest.fn(),
//     },
// }));

describe('SignupBuyer component', () => {
    beforeEach(() => {
        // eslint-disable-next-line testing-library/no-render-in-setup
        render( <Router>
            <SignupBuyer />
         </Router>);
    });

    test('renders SignupBuyer component', () => {
        expect(screen.getByText(/Sign up as a Buyer/i)).toBeInTheDocument();
    });

    test('input fields are rendered', () => {
        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/re-enter password/i)).toBeInTheDocument();
    });

    test('submit button is rendered', () => {
        expect(screen.getByRole('button', { name: /Sign up/i })).toBeInTheDocument();
    });


    test('form validation and submission', async () => {
        const nameInput = screen.getByLabelText(/Name/i);
        const emailInput = screen.getByLabelText(/Email address/i);
        const mobileNumberInput = screen.getByLabelText(/Mobile Number/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const confirmPasswordInput = screen.getByLabelText(/re-enter password/i);
        const submitButton = screen.getByRole('button', { name: /Sign up/i });

        // Submit the form with empty fields
        fireEvent.click(submitButton);
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Invalid name. Please provide a valid name.'));

        // Fill in the name input
        userEvent.type(nameInput, 'John Doe');
        fireEvent.click(submitButton);
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Invalid email address. Please provide a valid email address.'));

        // Fill in the email input
        userEvent.type(emailInput, 'john@example.com');
        fireEvent.click(submitButton);
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Invalid password. Password must be at least 6 characters long.'));

        // Fill in the password input
        userEvent.type(passwordInput, 'password');
        fireEvent.click(submitButton);
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Invalid phone number. Please provide a valid phone number.'));

        // Fill in the mobile number input
        userEvent.type(mobileNumberInput, '1234567890');
        fireEvent.click(submitButton);
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Passwords do not match. Please make sure you have entered the same password twice.'));

        // Fill in the confirm password input
        userEvent.type(confirmPasswordInput, 'password');
        fireEvent.click(submitButton);

        // Check if createUserWithEmailAndPassword is called
        await waitFor(() => expect(createUserWithEmailAndPassword).toHaveBeenCalled());
    });
});
