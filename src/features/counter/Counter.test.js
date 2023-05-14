import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import { Counter } from './Counter';

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

// Additional async tests could be added as per your implementation of incrementAsync and incrementIfOdd
