import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [deliveryInfo, setDeliveryInfo] = useState(null);


    return (
        <CartContext.Provider value={{ cartItems, setCartItems, deliveryInfo, setDeliveryInfo }}>
            {children}
        </CartContext.Provider>
    );
};
