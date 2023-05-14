import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import ForgotPassword from './ForgotPassword';
import {BrowserRouter as Router} from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';

jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
}));

beforeEach(() => {
    // Reset all mocks before each test
    getAuth.mockClear();
    sendPasswordResetEmail.mockClear();

    getAuth.mockReturnValue({});

    sendPasswordResetEmail.mockImplementation((auth, email) => {
        return Promise.resolve();
    });

    // Mock window.alert
    window.alert = jest.fn();
});
test('renders ForgotPassword and triggers email send on form submit', async () => {
    render(
        <Router>
            <ForgotPassword />
        </Router>
    );

    // Fill out the email field
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@test.com' } });

    // Click the 'Submit' button
    fireEvent.click(screen.getByText('Submit'));

    // Wait for the sendPasswordResetEmail function to be called
    await waitFor(() => expect(sendPasswordResetEmail).toHaveBeenCalled());

    // Confirm sendPasswordResetEmail was called with correct email
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.any(Object), 'test@test.com');
});

test('renders ForgotPassword and shows error on failed email send', async () => {
    // Mock failed sendPasswordResetEmail
    sendPasswordResetEmail.mockImplementationOnce(() => Promise.reject(new Error('Failed to send email')));

    render(
        <Router>
            <ForgotPassword />
        </Router>
    );

    // Fill out the email field
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@test.com' } });

    // Click the 'Submit' button
    fireEvent.click(screen.getByText('Submit'));

    // Wait for the sendPasswordResetEmail function to be called
    await waitFor(() => expect(sendPasswordResetEmail).toHaveBeenCalled());

    // Confirm error alert is shown
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Error sending password reset email'));
});
