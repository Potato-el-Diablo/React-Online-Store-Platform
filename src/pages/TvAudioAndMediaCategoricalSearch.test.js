import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TvAudioAndMediaCategoricalSearch from "./TvAudioAndMediaCategoricalSearch";

import '@testing-library/jest-dom/extend-expect';

describe('TvAudioAndMediaCategoricalSearch Component', () => {
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

      const filteredProducts = TvAudioAndMediaCategoricalSearch.filterProducts(products, searchQuery);

      expect(filteredProducts).toEqual(expectedFilteredProducts);
    });
  });

  describe('renderProductCards', () => {
    it('renders product cards', () => {
      const grid = 12;
      const products = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
      ];

      render(
        <BrowserRouter>
          <TvAudioAndMediaCategoricalSearch />
        </BrowserRouter>
      );

      const productCards = screen.getAllByTestId('product-card');
      expect(productCards.length).toBe(products.length);
    });
  });

  describe('simulateProductCardClick', () => {
    it('navigates to product details page', () => {
      const historyMock = { push: jest.fn() };
      const product = { id: 1, name: 'Product 1' };

      render(
        <BrowserRouter>
          <TvAudioAndMediaCategoricalSearch />
        </BrowserRouter>
      );

      const productCard = screen.getByTestId('product-card-1');
      fireEvent.click(productCard);

      expect(historyMock.push).toHaveBeenCalledWith(`/product/${product.id}`);
    });
  });

  describe('simulateFilterChange', () => {
    it('updates filtered products', () => {
      const products = [
        { id: 1, name: 'Product 1', category: 'Electronics' },
        { id: 2, name: 'Product 2', category: 'Clothing' },
      ];
      const filteredProducts = [
        { id: 1, name: 'Product 1', category: 'Electronics' },
      ];
      const filterValue = 'Electronics';

      render(
        <BrowserRouter>
          <TvAudioAndMediaCategoricalSearch />
        </BrowserRouter>
      );

      const filterSelect = screen.getByRole('combobox');

      fireEvent.change(filterSelect, { target: { value: filterValue } });

      const productCards = screen.getAllByTestId('product-card');
      expect(productCards.length).toBe(filteredProducts.length);
    });
  });

  describe('simulatePriceRangeChange', () => {
    it('updates filtered products based on price range', () => {
      const products = [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
        { id: 3, name: 'Product 3', price: 300 },
      ];
      const filteredProducts = [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
      ];
      const minPrice = 0;
      const maxPrice = 200;

      render(
        <BrowserRouter>
          <TvAudioAndMediaCategoricalSearch />
        </BrowserRouter>
      );

      const minPriceInput = screen.getByLabelText('Min Price');
      const maxPriceInput = screen.getByLabelText('Max Price');

      fireEvent.change(minPriceInput, { target: { value: minPrice } });
      fireEvent.change(maxPriceInput, { target: { value: maxPrice } });

      const productCards = screen.getAllByTestId('product-card');
      expect(productCards.length).toBe(filteredProducts.length);
    });
  });

  describe('simulateAvailabilityChange', () => {
    it('updates filtered products based on availability', () => {
      const products = [
        { id: 1, name: 'Product 1', available: true },
        { id: 2, name: 'Product 2', available: false },
      ];
      const filteredProducts = [
        { id: 1, name: 'Product 1', available: true },
      ];
      const availabilityValue = 'available';

      render(
        <BrowserRouter>
          <TvAudioAndMediaCategoricalSearch />
        </BrowserRouter>
      );

      const availabilityCheckbox = screen.getByLabelText(availabilityValue);

      fireEvent.click(availabilityCheckbox);

      const productCards = screen.getAllByTestId('product-card');
      expect(productCards.length).toBe(filteredProducts.length);
    });
  });
});
