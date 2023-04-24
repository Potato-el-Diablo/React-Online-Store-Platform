import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SellerRegistration from './SellerRegistration';
import '@testing-library/jest-dom/extend-expect';

describe('SellerRegistration', () => {
    test('renders sign-up form', () => {
        render(
            <Router>
                <SellerRegistration />
            </Router>
        );
    });

    test('renders required form fields', () => {
        render(
            <Router>
                <SellerRegistration />
            </Router>
        );
        const firstNameInput = screen.getByPlaceholderText('First Name');
        const lastNameInput = screen.getByPlaceholderText('Last Name');
        const emailInput = screen.getByPlaceholderText('Email');
        const phoneNumberInput = screen.getByPlaceholderText('Phone Number');
        const passwordInput = screen.getByPlaceholderText('Password (at least 6 characters)');
        const confirmPasswordInput = screen.getByPlaceholderText('Re-enter password');
        const companyNameInput = screen.getByPlaceholderText('Company Name');
        const companyEmailInput = screen.getByPlaceholderText('Company Email');
        const companyPhoneInput = screen.getByPlaceholderText('Company Phone');

        expect(firstNameInput).toBeInTheDocument();
        expect(lastNameInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
        expect(phoneNumberInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(confirmPasswordInput).toBeInTheDocument();
        expect(companyNameInput).toBeInTheDocument();
        expect(companyEmailInput).toBeInTheDocument();
        expect(companyPhoneInput).toBeInTheDocument();
    });
});
