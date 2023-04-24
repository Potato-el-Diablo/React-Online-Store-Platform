import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import '@testing-library/jest-dom/extend-expect';

describe('Home Component', () => {
    beforeEach(() => {
        // eslint-disable-next-line testing-library/no-render-in-setup
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );
    });

    test('renders main banner content', () => {
        const bannerHeading = screen.getByText('SUPERCHARGED FOR PROS.');
        const bannerSubHeading = screen.getByText('IPAD S13+ PRO');
        const bannerPrice = screen.getByText(/FROM R4999 or R450\/mo./i, {
            selector: '.main-banner-content p'
        });
        const buyNowBtn = screen.getByText('BUY NOW');

        expect(bannerHeading).toBeInTheDocument();
        expect(bannerSubHeading).toBeInTheDocument();
        expect(bannerPrice).toBeInTheDocument();
        expect(buyNowBtn).toBeInTheDocument();
    });

    test('renders small banners', () => {
        const smallBanners = screen.getAllByText(/NEW ARRIVAL|Best Seller\./i);
        expect(smallBanners.length).toBe(4);
    });

    test('renders services section', () => {
        const services = [
            'Free Shipping',
            'Daily Discounts',
            '24/7 Customer Support',
            'Affordable Prices',
            'Secure Payments',
        ];

        services.forEach((service) => {
            const serviceElement = screen.getByText(service);
            expect(serviceElement).toBeInTheDocument();
        });
    });

});
