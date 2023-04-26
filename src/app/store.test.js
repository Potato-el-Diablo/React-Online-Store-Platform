import { store } from './store';

describe('store', () => {
    it('should create a store with a counter reducer', () => {
        expect(store.getState().counter).toBeDefined();
    });
});
