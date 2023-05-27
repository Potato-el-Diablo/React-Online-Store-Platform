import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from './App';

jest.mock('./pages/Home', () => () => <div>Home</div>);
jest.mock('./pages/About', () => () => <div>About</div>);
jest.mock('./pages/Contact', () => () => <div>Contact</div>);
jest.mock('./pages/Login', () => () => <div>Login</div>);
jest.mock('./components/Layout', () => () => <div>Layout</div>);


describe("App Routes", () => {
    it("should render Home component when visiting / ", () => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it("should render About component when visiting /about", () => {
        render(
            <MemoryRouter initialEntries={["/about"]}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('About')).toBeInTheDocument();
    });

    it("should render Contact component when visiting /contact", () => {
        render(
            <MemoryRouter initialEntries={["/contact"]}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it("should render Login component when visiting /login", () => {
        render(
            <MemoryRouter initialEntries={["/login"]}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Login')).toBeInTheDocument();
    });
});