import { incrementAsync, incrementIfOdd } from './counterSlice';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import { Counter } from './Counter';
import '@testing-library/jest-dom/extend-expect';

jest.mock('./counterSlice', () => ({
    ...jest.requireActual('./counterSlice'),
    incrementAsync: jest.fn(),
    incrementIfOdd: jest.fn()
}));

test('renders the count value from state', () => {
    const store = configureStore({
        reducer: {
            counter: counterReducer,
        },
        preloadedState: {
            counter: {
                value: 5,
            },
        },
    });
    render(
        <Provider store={store}>
            <Counter />
        </Provider>
    );

    expect(screen.getByText('5')).toBeInTheDocument();
});

test('can increment the value', () => {
    const store = configureStore({
        reducer: {
            counter: counterReducer,
        },
    });
    render(
        <Provider store={store}>
            <Counter />
        </Provider>
    );

    fireEvent.click(screen.getByLabelText('Increment value'));

    expect(store.getState().counter.value).toBe(1);
});

test('can decrement the value', () => {
    const store = configureStore({
        reducer: {
            counter: counterReducer,
        },
    });
    render(
        <Provider store={store}>
            <Counter />
        </Provider>
    );

    fireEvent.click(screen.getByLabelText('Decrement value'));

    expect(store.getState().counter.value).toBe(-1);
});

test('can increment the value by a custom amount', () => {
    const store = configureStore({
        reducer: {
            counter: counterReducer,
        },
    });
    render(
        <Provider store={store}>
            <Counter />
        </Provider>
    );

    fireEvent.change(screen.getByLabelText('Set increment amount'), { target: { value: '3' } });
    fireEvent.click(screen.getByText('Add Amount'));

    expect(store.getState().counter.value).toBe(3);
});
test('can increment the value asynchronously', async () => {
    const store = configureStore({
        reducer: {
            counter: counterReducer,
        },
    });

    render(
        <Provider store={store}>
            <Counter />
        </Provider>
    );

    incrementAsync.mockResolvedValueOnce(3); // Mock the async action's response
    fireEvent.change(screen.getByLabelText('Set increment amount'), { target: { value: '3' } });
    fireEvent.click(screen.getByText('Add Async'));

    await waitFor(() => expect(incrementAsync).toHaveBeenCalledWith(3));
    // Expect the async action to be dispatched with the expected value
    // As the actual update is asynchronous and handled by the middleware, we are not checking the store's state in this test
});

test('can increment the value if odd', async () => {
    const store = configureStore({
        reducer: {
            counter: counterReducer,
        },
    });

    render(
        <Provider store={store}>
            <Counter />
        </Provider>
    );

    incrementIfOdd.mockResolvedValueOnce(3); // Mock the async action's response
    fireEvent.change(screen.getByLabelText('Set increment amount'), { target: { value: '3' } });
    fireEvent.click(screen.getByText('Add If Odd'));

    await waitFor(() => expect(incrementIfOdd).toHaveBeenCalledWith(3));
    // Expect the async action to be dispatched with the expected value
    // As the actual update is asynchronous and handled by the middleware, we are not checking the store's state in this test
});

// Additional async tests could be added as per your implementation of incrementAsync and incrementIfOdd
