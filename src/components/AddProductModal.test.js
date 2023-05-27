import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import AddProductModal from './AddProductModal';

jest.mock('../functions/firestoreFunctions', () => ({
    saveProductToFirestore: jest.fn(),
}));

const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onProductAdd: jest.fn(),
};

describe("AddProductModal Component", () => {
    it("renders without crashing", () => {
        render(
            <Router>
                <AddProductModal {...defaultProps} />
            </Router>
        );
    });

    it("handles input changes", () => {
        render(
            <Router>
                <AddProductModal {...defaultProps} />
            </Router>
        );

        const inputs = screen.getAllByRole('textbox');
        inputs.forEach(input => {
            fireEvent.change(input, { target: { value: 'test value' } });
        });

        const numberInput = screen.getByRole('spinbutton');
        fireEvent.change(numberInput, { target: { value: 5 } });
    });

    it("calls the onClick handlers when buttons are clicked", async () => {
        render(
            <Router>
                <AddProductModal {...defaultProps} />
            </Router>
        );

        const addProductButton = screen.getByText("Add Product");
        fireEvent.click(addProductButton);

        expect(defaultProps.onProductAdd).toHaveBeenCalledTimes(1);
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);

        const cancelButton = screen.getByText("Cancel");
        fireEvent.click(cancelButton);
        expect(defaultProps.onClose).toHaveBeenCalledTimes(2);
    });

    it("does not render when open prop is false", () => {
        render(
            <Router>
                <AddProductModal {...{...defaultProps, open: false}} />
            </Router>
        );
        expect(screen.queryByText("Add Product")).toBeNull();
    });
});
