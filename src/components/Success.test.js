import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Success from '../pages/Success';
import { db } from '../pages/firebase';
import { useCart } from '../pages/CartContext';

// Mock the CartContext
jest.mock('../pages/CartContext', () => ({
  useCart: () => ({
    setCartItems: jest.fn(),
  }),
}));

// Mock the Firestore methods
jest.mock('../pages/firebase', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  addDoc: jest.fn(),
  collection: jest.fn(),
  setDoc: jest.fn(),
}));

describe('Success', () => {
  const mockCartItems = [    { id: '123', name: 'Product A', image: 'product_a.jpg', price: 10, quantity: 2 },    { id: '456', name: 'Product B', image: 'product_b.jpg', price: 20, quantity: 1 },  ];
  const mockUser = { uid: 'user123' };
  const mockOrderNumber = 2;

  beforeEach(() => {
    // Reset the mock implementations and clear localStorage
    jest.clearAllMocks();
    localStorage.clear();

    // Set the cartItems in localStorage
    localStorage.setItem('cartItems', JSON.stringify(mockCartItems));

    // Set the currentUser in auth
    //jest.spyOn(require('../pages/firebase').auth, 'currentUser', 'get').mockReturnValue(mockUser);

    // Mock the Firestore data for Product A
    const mockProductARef = { id: '123', data: () => ({ stock: 5 }) };
    jest.spyOn(require('../pages/firebase').db, 'doc').mockReturnValueOnce(mockProductARef);

    // Mock the Firestore data for Product B
    const mockProductBRef = { id: '456', data: () => ({ stock: 10 }) };
    jest.spyOn(require('../pages/firebase').db, 'doc').mockReturnValueOnce(mockProductBRef);

    // Mock the Firestore data for OrderNumber
    const mockOrderNumberRef = { data: () => ({ lastOrder: 1 }) };
    jest.spyOn(require('../pages/firebase').db, 'doc').mockReturnValueOnce(mockOrderNumberRef);

    // Mock the Firestore addDoc method for Orders
    jest.spyOn(require('../pages/firebase').db, 'collection').mockReturnValueOnce({
      add: jest.fn().mockResolvedValueOnce(),
    });
  });

  it('updates the stock of each product in Firestore correctly', async () => {
    await render(<Success />);

    expect(require('../pages/firebase').db.doc).toHaveBeenCalledTimes(2);
    expect(require('../pages/firebase').db.doc).toHaveBeenNthCalledWith(1, 'Products/123');
    expect(require('../pages/firebase').db.doc).toHaveBeenNthCalledWith(2, 'Products/456');
    expect(require('../pages/firebase').db.doc().data).toHaveBeenCalledTimes(2);
    expect(require('../pages/firebase').db.doc().data).toHaveBeenNthCalledWith(1);
    expect(require('../pages/firebase').db.doc().data).toHaveBeenNthCalledWith(2);
    expect(require('../pages/firebase').db.updateDoc).toHaveBeenCalledTimes(2);
  });
});