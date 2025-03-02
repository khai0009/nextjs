"use client"
import { useState, useEffect, createContext, useContext } from 'react';
import {  doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase'; // Đảm bảo đường dẫn chính xác

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userPhone, setUserPhone] = useState(null); // Số điện thoại khách hàng
  const [showLoginModal, setShowLoginModal] = useState(false); // Trạng thái hiển thị modal đăng nhập


  useEffect(() => {
    // Load cart from local storage (nếu cần)
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to local storage (nếu cần)
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const loadCartFromFirestore = async (phone) => {
    try {
      const cartDoc = await getDoc(doc(db, 'carts', phone));
      if (cartDoc.exists()) {
        setCart(cartDoc.data().items || []);
      }
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng từ Firestore:', error);
    }
  };

  const saveCartToFirestore = async (phone, cartItems) => {
    try {
      await setDoc(doc(db, 'carts', phone), { items: cartItems });
    } catch (error) {
      console.error('Lỗi khi lưu giỏ hàng vào Firestore:', error);
    }
  };

  const addToCart = async (newItem) => {
    if (!userPhone) {
      setShowLoginModal(true); // Hiển thị modal đăng nhập
      return;
    }

    setCart((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === newItem.id);

      let updatedItems;
      if (existingItemIndex !== -1) {
        // Sản phẩm đã tồn tại, tăng local lên 1
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex].local =
          (updatedItems[existingItemIndex].local || 1) + 1;
      } else {
        // Sản phẩm mới, thêm vào giỏ hàng với local = 1
        updatedItems = [...prevItems, { ...newItem, local: 1 }];
      }
      saveCartToFirestore(userPhone, updatedItems); // Lưu giỏ hàng vào Firestore
      return updatedItems;
    });
  };

  // Hàm để cập nhật số điện thoại người dùng
  const updateUserPhone = (phone) => {
    setUserPhone(phone);
    loadCartFromFirestore(phone); // Tải giỏ hàng từ Firestore
  };

  // Hàm để ẩn modal đăng nhập
  const hideLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, userPhone, updateUserPhone, showLoginModal, hideLoginModal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);