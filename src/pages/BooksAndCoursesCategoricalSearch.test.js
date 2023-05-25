import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BooksAndCoursesCategoricalSearch from "./BooksAndCoursesCategoricalSearch";
//import { filteredProducts  } from "./BooksAndCoursesCategoricalSearch"; // Import the module containing the filterProducts function

import '@testing-library/jest-dom/extend-expect';

describe('OurStore Component', () => {
    test('renders page title and breadcrumb', () => {
        render(
            <BrowserRouter>
                <BooksAndCoursesCategoricalSearch />
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
                <BooksAndCoursesCategoricalSearch />
            </BrowserRouter>
        );

        const sortByText = screen.getByText('Sort By');
        const selectElement = screen.getByRole('combobox');
        const totalProductsText = screen.getByText(/Total Products:/i);
        expect(sortByText).toBeInTheDocument();
        expect(selectElement).toBeInTheDocument();
        expect(totalProductsText).toBeInTheDocument();
    });

    test('does the product list and filter box render', ()=> {
        render(
            <BrowserRouter>
                <BooksAndCoursesCategoricalSearch />
            </BrowserRouter>
        );

        const productsList = screen.getByTestId('productsList');
        const tagBox = screen.getByTestId('tagBox');
        const filterBox = screen.getByTestId('filterBox');
        expect(productsList).toBeInTheDocument();
        expect(tagBox).toBeInTheDocument();
        expect(filterBox).toBeInTheDocument();
        expect(filterBox).toHaveTextContent('Filter By');
    })

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