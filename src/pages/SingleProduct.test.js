import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SingleProduct from './SingleProduct';
import { BrowserRouter } from 'react-router-dom';

const MockProduct = {
    productImage: 'test-image.jpg',
    brand: 'Test Brand',
    productName: 'Test Product',
    productDescription: 'Test Description',
    productPrice: 100,
    productStock: 'In Stock',
};

const MockLocation = {
    pathname: '/singleproduct',
    state: MockProduct,
};


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => (MockLocation),
}));
describe('SingleProduct', () => {
    test('should redirect to login page when trying to submit a review without being logged in', () => {
      // Mock the useState hook to return an empty userId (not logged in)
      useState.mockImplementationOnce(() => ['', jest.fn()]);
  
      render(<SingleProduct />);
  
      // Simulate form submission
      fireEvent.click(screen.getByText('Submit Review'));
  
      // Assert that the login alert is shown
      expect(screen.getByText('Please sign in to submit a review.')).toBeInTheDocument();
    });
    test('should calculate the average rating correctly', () => {
        // Mock the useState hook to return dummy data
        useState.mockImplementationOnce(() => ['123', jest.fn()]); // Mock the userId
        useState.mockImplementationOnce(() => [[{ id: 1, rating: 4 }, { id: 2, rating: 5 }], jest.fn()]); // Mock the reviews array
        useState.mockImplementationOnce(() => [null, jest.fn()]); // Mock the userReview
    
        render(<SingleProduct />);
    
        // Assert that the average rating is displayed correctly
        expect(screen.getByText('4.5')).toBeInTheDocument();
      });
  });

describe('SingleProduct Component', () => {
    beforeEach(() => {
        // eslint-disable-next-line testing-library/no-render-in-setup
        render(
            <BrowserRouter>
                <SingleProduct />
            </BrowserRouter>
        );
    });

    test('renders product details correctly', () => {
        expect(screen.getByText(MockProduct.productName)).toBeInTheDocument();
        expect(screen.getByText(MockProduct.brand)).toBeInTheDocument();
        expect(screen.getByText(`R ${MockProduct.productPrice}`)).toBeInTheDocument();
        expect(screen.getByText(MockProduct.productStock)).toBeInTheDocument();
        expect(screen.getByText(MockProduct.productDescription)).toBeInTheDocument();
    });

    test('renders product image correctly', () => {
        const image = screen.getByAltText(MockProduct.productName);
        expect(image).toBeInTheDocument();
        expect(image.src).toContain(MockProduct.productImage);
    });

    test('renders quantity input', () => {
        const input = screen.getByRole('spinbutton');
        expect(input).toBeInTheDocument();
        fireEvent.change(input, { target: { value: 5 } });
        expect(input.value).toBe('5');
    });

    test('renders Add to Cart and Buy Now buttons', () => {
        const addToCartButton = screen.getByText('Add to Cart');
        const buyNowButton = screen.getByText('Buy Now');
        expect(addToCartButton).toBeInTheDocument();
        expect(buyNowButton).toBeInTheDocument();
    });

    test('renders Add to Wishlist link', () => {
        const addToWishlistLink = screen.getByText('Add to Wishlist');
        expect(addToWishlistLink).toBeInTheDocument();
    });


      

});
