import counterReducer, {
  increment,
  decrement,
  incrementByAmount, incrementIfOdd, selectCount, incrementAsync,
} from './counterSlice';
import {configureStore} from "@reduxjs/toolkit";
import { fetchCount } from './counterAPI';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureMockStore(middlewares)


// For async actions
jest.mock('./counterAPI');

describe('counter reducer', () => {
  const initialState = {
    value: 3,
    status: 'idle',
  };

  it('should handle initial state', () => {
    expect(counterReducer(undefined, {type: 'unknown'})).toEqual({
      value: 11,
      status: 'idle',
    });
  });

  it('should handle increment', () => {
    const actual = counterReducer(initialState, increment());
    expect(actual.value).toEqual(4);
  });

  it('should handle decrement', () => {
    const actual = counterReducer(initialState, decrement());
    expect(actual.value).toEqual(2);
  });

  it('should handle incrementByAmount', () => {
    const actual = counterReducer(initialState, incrementByAmount(2));
    expect(actual.value).toEqual(5);
  });

  it('should handle incrementAsync', async () => {
    fetchCount.mockResolvedValueOnce({data: 5});
    const expectedActions = [
      {type: 'counter/fetchCount/pending'},
      {type: 'counter/fetchCount/fulfilled', payload: 5},
    ];
    const store = mockStore({counter: initialState});
    await store.dispatch(incrementAsync(5));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should select count', () => {
    const state = {counter: {value: 5}};
    const res = selectCount(state);
    expect(res).toEqual(5);
  });

  it('should increment if odd', () => {
    const store = mockStore({counter: initialState});
    store.dispatch(incrementIfOdd(5));
    const actions = store.getActions();
    expect(actions).toEqual([incrementByAmount(5)]);
  });

  it('should not increment if even', () => {
    const store = mockStore({counter: {value: 4}});
    store.dispatch(incrementIfOdd(5));
    const actions = store.getActions();
    expect(actions).toEqual([]);
  });
});
