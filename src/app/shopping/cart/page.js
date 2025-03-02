"use client";
import { useState, useEffect } from 'react';
import { useCart } from '../../context/cartcontext';
import Link from 'next/link'

export default function CartPage() {
 const { cart, removeFromCart } = useCart();
  const [totalquantity, setTorlquantity] = useState(0); 
  const [totalPrice, setTotalPrice] = useState(0) 

  useEffect(() => {
    const fetchCartItems = async () => {

      try {
        
        const initialQuantities = {};
        cart.forEach((item) => {
          initialQuantities[item.id] = item.quantity || 1; // Default to 1 if no quantity
        });
        setQuantities(initialQuantities);
        
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    // Calculate total price whenever cartItems or quantities change
    let total = 0;
    cart.forEach((item) => {
      total += (item.price || 0) * (quantities[item.id] || 0);
    });
    setTotalPrice(total);
  }, [cart, quantities]);

  const handleQuantityChange = (itemId, newQuantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: Math.max(1, parseInt(newQuantity, 10) || 1), // Ensure quantity is at least 1
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>
      {cart.length === 0 ? (
        <><p>Giỏ hàng trống.</p><Link href="/">Tiếp tục mua sắm</Link></>
      ) : (
      <><table className="min-w-full border border-gray-300">
                      <thead>
                          <tr className="bg-gray-100">
                              <th className="py-2 px-4 border-b">Tên sản phẩm</th>
                              <th className="py-2 px-4 border-b">Số lượng</th>
                              <th className="py-2 px-4 border-b">Thành tiền</th>
                              <th className="py-2 px-4 border-b"></th>
                          </tr>
                      </thead>
                      <tbody>
                          {cart.map((item) => (
                              <tr key={item.id} className="border-b">
                                  <td className="py-2 px-4">{item.name}</td>
                                  <td className="py-2 px-4">
                                      <input
                                          type="number"
                                          value={quantities[item.id] || 1}
                                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                          className="w-16 border rounded p-1"
                                          min="1" />
                                  </td>
                                  <td className="py-2 px-4">
                                      {(item.price || 0) * (quantities[item.id] || 0)}
                                  </td>
                                  <td>
                                      <button
                                          onClick={() => removeFromCart(item.id)}
                                          className="bg-red-500 text-white px-2 py-1 rounded-md"
                                      >
                                          Xóa
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table><div className="mt-4 text-right">
                          <p className="text-lg font-semibold">Tổng tiền: {totalPrice} đ</p>
                      </div></>
      )
    }
    </div>
  );
}