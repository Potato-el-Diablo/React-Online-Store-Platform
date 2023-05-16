import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from 'src/app/store';
import App from './App';
import { CartProvider } from 'src/pages/CartContext'; // Don't forget to import CartProvider

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <CartProvider>
                <App />
            </CartProvider>
        </Provider>
    </React.StrictMode>
);
