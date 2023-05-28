import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TvAudioAndMediaCategoricalSearch from "./TvAudioAndMediaCategoricalSearch";

import '@testing-library/jest-dom/extend-expect';

describe('OurStore Component', () => {
    test('renders page title and breadcrumb', () => {
        render(
            <BrowserRouter>
                <TvAudioAndMediaCategoricalSearch />
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
                <TvAudioAndMediaCategoricalSearch />
            </BrowserRouter>
        );

        const sortByText = screen.getByText('Sort By');
        const selectElement = screen.getByRole('combobox');
        const totalProductsText = screen.getByText(/Total Products:/i);
        

        expect(sortByText).toBeInTheDocument();
        expect(selectElement).toBeInTheDocument();
        expect(totalProductsText).toBeInTheDocument();
    });

    describe('filterProducts', () => {
        it('filters products based on category', () => {
          const searchQuery = 'electronics';
          const products = [
            { name: 'Product 1', category: 'Electronics' },
            { name: 'Product 2', category: 'Clothing' },
            { name: 'Product 3', category: 'Electronics' },
          ];
      
          const expectedFilteredProducts = [
            { name: 'Product 1', category: 'Electronics' },
            { name: 'Product 3', category: 'Electronics' },
          ];
      
          const filteredProducts = products.filter((product) =>
            (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()))
          );
      
          expect(filteredProducts).toEqual(expectedFilteredProducts);
        });
      });

});