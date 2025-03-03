"use client";
import { useState, useEffect, createContext, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Load cart from local storage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to local storage
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem) => {
    setCart((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === newItem.id);

      let updatedItems;
      if (existingItemIndex !== -1) {
        // Product exists, increase quantity
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity =
          (updatedItems[existingItemIndex].quantity || 1) + 1;
      } else {
        // New product, add to cart with quantity 1
        updatedItems = [...prevItems, { ...newItem, quantity: 1 }];
      }
      return updatedItems;
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCart((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: Math.max(1, parseInt(newQuantity, 10) || 1) }; // Ensure quantity is at least 1
        }
        return item;
      });
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);