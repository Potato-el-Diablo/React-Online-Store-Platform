import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import ViewProductRevenueModal from './ViewProductRevenueModal';

const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onRefresh: jest.fn(),
    myLabels: ['Jan', 'Feb', 'Mar'],
    dataset: [100, 200, 300],
    totalRev: 600,
    productName: 'Test Product'
};

describe("ViewProductRevenueModal Component", () => {
    it("renders without crashing", () => {
        render(
            <Router>
                <ViewProductRevenueModal {...defaultProps} />
            </Router>
        );
    });

    it("displays the correct content", () => {
        render(
            <Router>
                <ViewProductRevenueModal {...defaultProps} />
            </Router>
        );
        expect(screen.getByText(`Analytics for ${defaultProps.productName}`)).toBeInTheDocument();
        expect(screen.getByText(`Total revenue over last year: R${defaultProps.totalRev}`)).toBeInTheDocument();
        expect(screen.getByText('Refresh')).toBeInTheDocument();
        expect(screen.getByText('Close')).toBeInTheDocument();
    });

    it("calls the onClick handlers when buttons are clicked", () => {
        render(
            <Router>
                <ViewProductRevenueModal {...defaultProps} />
            </Router>
        );

        const refreshButton = screen.getByText("Refresh");
        fireEvent.click(refreshButton);
        expect(defaultProps.onRefresh).toHaveBeenCalledTimes(1);

        const closeButton = screen.getByText("Close");
        fireEvent.click(closeButton);
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("does not render when open prop is false", () => {
        render(
            <Router>
                <ViewProductRevenueModal {...{...defaultProps, open: false}} />
            </Router>
        );
        expect(screen.queryByText(`Analytics for ${defaultProps.productName}`)).toBeNull();
    });
});
