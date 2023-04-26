import { render, fireEvent, screen } from "@testing-library/react";
import Cart from "./Cart";
import CartItem from "../components/CartItem";
import { MemoryRouter } from "react-router-dom";

jest.mock("../components/CartItem", () => {
    /*#__PURE__*/
    function MockedCartItem(props) {
        return (
            <div data-testid="cart-item" onClick={() => props.onRemove(props.item.id)}>
                Cart Item {props.item.id}
            </div>
        );
    }
    return MockedCartItem;
});

describe("Cart component", () => {
    test("renders cart items correctly", () => {
        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );
        const cartItems = screen.getAllByTestId("cart-item");
        expect(cartItems.length).toBe(2);
    });

    test("removes a cart item correctly", () => {
        render(
            <MemoryRouter>
                <Cart />
            </MemoryRouter>
        );
        const cartItems = screen.getAllByTestId("cart-item");
        fireEvent.click(cartItems[0]);
        expect(() => screen.getByText("Cart Item 1")).toThrow();
    });

    // Add more tests related to handleUpdateSubtotal here
});
