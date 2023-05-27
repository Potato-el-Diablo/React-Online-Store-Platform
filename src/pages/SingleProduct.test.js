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

const mockUserId = '12345';
const mockHandleAddToCart = jest.fn();
const mockAddReview = jest.fn();

jest.mock('./useCart', () => ({
    useCart: () => ({ handleAddToCart: mockHandleAddToCart }),
}));

jest.mock('@firebase/auth', () => ({
    getAuth: () => ({
        currentUser: { uid: mockUserId },
    }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => (MockLocation),
}));

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

    test('renders Add Review form if user is logged in', () => {
        const ratingInput = screen.getByLabelText('Rating');
        const commentInput = screen.getByLabelText('Review');
        const submitButton = screen.getByText('Submit Review');
        expect(ratingInput).toBeInTheDocument();
        expect(commentInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();

        fireEvent.change(ratingInput, { target: { value: 4 } });
        fireEvent.change(commentInput, { target: { value: 'Great product!' } });
        fireEvent.click(submitButton);

        expect(mockAddReview).toHaveBeenCalledWith('12345', 'Great product!', 4);
    });

    test('renders average rating', () => {
        const avgRating = screen.getByText('Average Rating:');
        expect(avgRating).toBeInTheDocument();
    });

    test('renders rating stars correctly', () => {
        const ratingStars = screen.getAllByRole('img', { name: /star/i });
        expect(ratingStars.length).toBe(5);
    });

    test('calls handleAddToCart when Add to Cart button is clicked', () => {
        const addToCartButton = screen.getByText('Add to Cart');
        fireEvent.click(addToCartButton);
        expect(mockHandleAddToCart).toHaveBeenCalledWith(MockProduct);
    });

    test('matches snapshot', () => {
        const { asFragment } = render(
            <BrowserRouter>
                <SingleProduct />
            </BrowserRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });


});
