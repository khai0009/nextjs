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

        if (existingItemIndex !== -1) {
            // Product exists, increase quantity by 1
            const updatedItems = [...prevItems];
            updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex],
                quantity: (updatedItems[existingItemIndex].quantity || 0) + 1, // Correct increment
            };
            return updatedItems;
        } else {
            // New product, add to cart with quantity 1
            return [...prevItems, { ...newItem, quantity: 1 }];
        }
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

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart'); // Xóa giỏ hàng khỏi localStorage
  };
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity,clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);