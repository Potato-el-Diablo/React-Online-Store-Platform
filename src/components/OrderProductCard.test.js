import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OrderProductCard from "./OrderProductCard";
import '@testing-library/jest-dom/extend-expect';
import ReactStars from "react-rating-stars-component";

jest.mock('react-rating-stars-component', () => jest.fn(() => <div>Stars</div>));

const product = {
    grid: 3,
    productImage: "test_image.png",
    brand: "test_brand",
    productName: "test_product",
    productDescription: "test_description",
    productPrice: 100,
    productQuantity: 10
};

beforeEach(() => {
    render(
        <MemoryRouter initialEntries={["/OrderHistory"]}>
            <OrderProductCard {...product} />
        </MemoryRouter>
    );
});

test("renders product image", () => {
    const image = screen.getByAltText("product image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", product.productImage);
});

test("renders product brand", () => {
    expect(screen.getByText(product.brand)).toBeInTheDocument();
});

test("renders product name", () => {
    expect(screen.getByText(product.productName)).toBeInTheDocument();
});

test("renders product description", () => {
    expect(screen.getByText(product.productDescription)).toBeInTheDocument();
});

test("renders product price", () => {
    expect(screen.getByText(`R${product.productPrice}`)).toBeInTheDocument();
});

test("renders product quantity", () => {
    expect(screen.getByText(`Stock Ordered: ${product.productQuantity}`)).toBeInTheDocument();
});

test("renders stars with correct props", () => {
    expect(ReactStars).toHaveBeenCalledWith(
        {
            count: 5,
            size: 24,
            value: 4,
            edit: false,
            activeColor: "#ffd700"
        },
        expect.anything()
    );
});
