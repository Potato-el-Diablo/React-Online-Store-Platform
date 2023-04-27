import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import SampleComponent from './TestSampleComponent';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
};

describe('Layout', () => {
    test('renders Header, Outlet, and Footer components', () => {
        renderWithRouter(<Layout />);

        // Check if Header and Footer components are rendered
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    test('renders component inside Outlet with correct route', () => {
        const route = '/sample-route';

        // Wrap Layout with Routes and add the SampleComponent route
        const LayoutWithSampleRoute = (
            <Routes>
                <Route path={route} element={<SampleComponent />} />
                <Route path="*" element={<Layout />} />
            </Routes>
        );

        renderWithRouter(LayoutWithSampleRoute, { route });

        // Check if the SampleComponent is rendered inside Outlet for the provided route
        expect(screen.getByTestId('sample-component')).toBeInTheDocument();
        expect(window.location.pathname).toBe(route);
    });
});


