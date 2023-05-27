import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

jest.mock('./pages/Home', () => () => <div>Home</div>);
jest.mock('./pages/About', () => () => <div>About</div>);
jest.mock('./pages/Contact', () => () => <div>Contact</div>);
jest.mock('./pages/Login', () => () => <div>Login</div>);
jest.mock('./pages/SellerRegistration', () => () => <div>SellerRegistration</div>);
jest.mock('./pages/SignupBuyer', () => () => <div>SignupBuyer</div>);
jest.mock('./pages/OurStore', () => () => <div>OurStore</div>);
jest.mock('./pages/ForgotPassword', () => () => <div>ForgotPassword</div>);
jest.mock('./pages/MyProducts', () => () => <div>MyProducts</div>);
jest.mock('./pages/Cart', () => () => <div>Cart</div>);
jest.mock('./pages/Searched', () => () => <div>Searched</div>);
jest.mock('./pages/SingleProduct', () => () => <div>SingleProduct</div>);
jest.mock('./pages/MyAccount', () => () => <div>MyAccount</div>);
jest.mock('./pages/Success', () => () => <div>Success</div>);
jest.mock('./pages/BooksAndCoursesCategoricalSearch', () => () => <div>BooksAndCoursesCategoricalSearch</div>);
jest.mock('./pages/CellphonesAndSmartwatchesCategoricalSearch', () => () => <div>CellphonesAndSmartwatchesCategoricalSearch</div>);
jest.mock('./pages/ComputersAndElectronicsCategoricalSearch', () => () => <div>ComputersAndElectronicsCategoricalSearch</div>);
jest.mock('./pages/GamingCategoricalSearch', () => () => <div>GamingCategoricalSearch</div>);
jest.mock('./pages/HomeAndAppliancesCategoricalSearch', () => () => <div>HomeAndAppliancesCategoricalSearch</div>);
jest.mock('./pages/TvAudioAndMediaCategoricalSearch', () => () => <div>TvAudioAndMediaCategoricalSearch</div>);
jest.mock('./pages/OrderDetails', () => () => <div>OrderDetails</div>);
jest.mock('./pages/DeliveryPage', () => () => <div>DeliveryPage</div>);
jest.mock('./pages/WishlistPage', () => () => <div>WishlistPage</div>);
jest.mock('./components/Checkout', () => () => <div>Checkout</div>);

describe("App Routes", () => {
    it("should render Home component when visiting /", () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it("should render About component when visiting /about", () => {
        render(
            <MemoryRouter initialEntries={['/about']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('About')).toBeInTheDocument();
    });

    // add similar tests for all other routes
    // here are a few more examples:

    it("should render Contact component when visiting /contact", () => {
        render(
            <MemoryRouter initialEntries={['/contact']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it("should render Login component when visiting /login", () => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it("should render SellerRegistration component when visiting /sellerregistration", () => {
        render(
            <MemoryRouter initialEntries={['/sellerregistration']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('SellerRegistration')).toBeInTheDocument();
    });


    it("should render SignupBuyer component when visiting /buyerregistration", () => {
        render(
            <MemoryRouter initialEntries={['/buyerregistration']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('SignupBuyer')).toBeInTheDocument();
    });

    it("should render OurStore component when visiting /product", () => {
        render(
            <MemoryRouter initialEntries={['/product']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('OurStore')).toBeInTheDocument();
    });

    it("should render ForgotPassword component when visiting /forgot-password", () => {
        render(
            <MemoryRouter initialEntries={['/forgot-password']}>
                <App />
            </MemoryRouter>
    );
    expect(screen.getByText('ForgotPassword')).toBeInTheDocument();
    });

});
