import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomeAndAppliancesCategoricalSearch from "./HomeAndAppliancesCategoricalSearch";

import '@testing-library/jest-dom/extend-expect';

describe('OurStore Component', () => {
    test('renders page title and breadcrumb', () => {
        render(
            <BrowserRouter>
                <HomeAndAppliancesCategoricalSearch />
            </BrowserRouter>
        );

        const ourStoreRegex = new RegExp('Our Store', 'i');
        const pageTitle = screen.getByText(ourStoreRegex);
        const breadcrumb = screen.getAllByText(ourStoreRegex);

        expect(pageTitle).toBeInTheDocument();
        expect(breadcrumb.length).toBeGreaterThan(0);
    });

    test('renders filter and sort section', () => {
        render(
            <BrowserRouter>
                <HomeAndAppliancesCategoricalSearch />
            </BrowserRouter>
        );

        const sortByText = screen.getByText('Sort By');
        const selectElement = screen.getByRole('combobox');
        const totalProductsText = screen.getByText(/Total Products:/i);

        expect(sortByText).toBeInTheDocument();
        expect(selectElement).toBeInTheDocument();
        expect(totalProductsText).toBeInTheDocument();
    });

});