"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image'
import { useCart } from '../../context/cartcontext';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import OrderForm from '../o/page';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity } = useCart(); // Thêm updateQuantity
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        let total = 0;
        cart.forEach((item) => {
            total += (Number(item.price) || 0) * (Number(item.quantity) || 0);
        });
        setTotalPrice(total);
    }, [cart]);


    const handleQuantityChange = (itemId, newQuantity) => {
        updateQuantity(itemId, newQuantity); // Sử dụng updateQuantity từ CartContext
    };

    

    return (
        <div className="flex justify-center p-1">
        <div className=" h-full bg-orange-50 p-4 w-full">
        
       
        {(cart.length === 0 && localStorage.getItem('loggedInUser') === null) ? (
          <div className="flex flex-col items-center justify-center h-full w-full bg-gray-100 p-4">
          <div className="bg-white shadow-lg rounded-lg p-8 w-[50%]  h-full text-center">
            <Image
              src="/image.png" // Thay bằng hình ảnh thực tế
              alt="Empty Cart"
              width={100}
              height={100}
              className="mx-auto w-32 h-32 mb-4"
            ></Image>
            <h2 className="text-2xl font-semibold text-gray-700">
              Giỏ hàng của bạn <span className="text-red-500">Rỗng!</span>
            </h2>
            <p className="text-gray-500 my-5 text-sm">
              Hãy thêm sản phẩm trước khi thanh toán.
            </p>
            <Link href="/" className="mt-6 px-6 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition">
              Quay lại
            </Link>
          </div>
        </div>
    
        ) : (
          <><h1 className="text-3xl font-bold mb-6 text-pink-600 z-1 ">Giỏ hàng</h1>
<Link href="/" className="bg-pink-200 hover:bg-pink-300 text-pink-700 px-4 py-2 rounded-md inline-block mb-5">
              Tiếp tục mua sắm
            </Link>
            <div className='flex flex-col lg:flex-row'>
            <div className="overflow-x-auto w-full lg:w-[70%] overflow-y-auto">
  <table className="min-w-full  border border-pink-200 rounded-lg shadow-md">
    <thead>
      <tr className="bg-pink-100">
        <th className="py-3 px-4 border-b text-left"></th>
        <th className="py-3 px-4 border-b text-left">Tên sản phẩm</th>
        <th className="py-3 px-4 border-b text-left">Số lượng</th>
        <th className="py-3 px-4 border-b text-left">Thành tiền</th>
        <th className="py-3 px-4 border-b text-left"></th>
      </tr>
    </thead>
    <tbody>
      {cart.map((item) => (
        <tr key={item.id} className="border-b border-pink-200 hover:bg-pink-50 transition-colors duration-200">
          <td className="py-4 px-4 w-20">
            <div className="w-20 h-24 rounded-md overflow-hidden shadow-md">
              <CldImage
                src={item.imageUrl}
                width="100"
                height="125"
                crop={{ type: 'auto', source: true }}
                sizes="(max-width: 375px) 50px, 100px"
                alt={item.name}
                className="object-cover w-full h-full"
              />
            </div>
          </td>
          <td className="py-4 px-4">{item.name}</td>
          <td className="py-4 px-4 w-fit">
            <input
              type="number"
              value={item.quantity || 1}
              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
              className="w-16 border rounded p-2 border-pink-300 focus:ring-pink-500"
              min="1"
            /> x {item.price}
          </td>
 
          <td className="py-4 px-4 text-center w-fit">{(Number(item.price) || 0) * (Number(item.quantity) || 0)} </td>
          <td className="py-4 px-4">
            <button
              onClick={() => removeFromCart(item.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md transition-colors duration-200"
            >
              Xóa
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>  
<div className='bg-white border-2 border-pink-50 lg:w-[30%] w-full'>
      <OrderForm></OrderForm>
</div>


</div>    
            
          </>
        )}
        </div>
      </div>
    
    );
}