"use client"
import React, { useState, useEffect } from 'react';
import { useAddressSelection } from '../../addressUtils';
import { db } from '../../Firebase'; // Đảm bảo đường dẫn chính xác
import { collection, addDoc } from 'firebase/firestore';
import { useCart } from '../../context/cartcontext'; // Đảm bảo đường dẫn chính xác
import { useRouter } from 'next/navigation';

function OrderForm() {
  const [deliveryMethod, setDeliveryMethod] = useState('tại cửa hàng');
  const [paymentMethod, setPaymentMethod] = useState('chuyển khoản');
  const [address, setAddress] = useState('');
  const { cart, clearCart } = useCart();
  const [mahoadon, setMaHoaDon] = useState(`HD${Date.now()}`);
  const [khachhang, setKhachHang] = useState(localStorage.getItem('loggedInUser'));
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState(''); 
  const [userAddress, setUserAddress] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let total = 0;
    cart.forEach((item) => {
      total += (Number(item.price) || 0) * (Number(item.quantity) || 0);
    });
    setTotalPrice(total);
  }, [cart]);

  useEffect(() => {
    const fetchUserAddress = async () => {
      if (khachhang) {
        try {
          const q = query(collection(db, 'users'), where('phoneNumber', '==', khachhang));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setUserAddress({
              address: userData.address,
              selectedCity: userData.selectedCity,
              selectedDistrict: userData.selectedDistrict,
              selectedWard: userData.selectedWard,
            });
          }
        } catch (error) {
          console.error('Lỗi khi lấy địa chỉ người dùng: ', error);
        }
      }
    };
    fetchUserAddress();
  }, [khachhang]);

  const handleDeliveryChange = (event) => {
    const selectedDeliveryMethod = event.target.value;
    setDeliveryMethod(selectedDeliveryMethod);

    
    if (selectedDeliveryMethod === "tại nhà" && userAddress) {
      setAddress(userAddress.address);
    }
  };

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleDeliveryTimeChange = (event) => {
    setDeliveryTime(event.target.value);
  };

  const {
    addressData,
    selectedCity,
    selectedDistrict,
    districts,
    wards,
    handleCityChange,
    handleDistrictChange,
  } = useAddressSelection();

  const handleCheckout = async () => {
    if (!khachhang) {
      alert('Vui lòng đăng nhập để thanh toán.');
      router.push('/login/login');
      return;
    }
    try {
      const checkoutAddress =
        deliveryMethod === "tại nhà"
          ? userAddress.address
          : deliveryMethod === "tại cửa hàng"
          ? "123 Đường ABC, Phường MNL, Quận XYZ, TP.HCM"
          : address;

      // Xác định thành phố dựa trên phương thức giao hàng
      const checkoutSelectedCity =
        deliveryMethod === "tại nhà"
          ? userAddress.selectedCity
          : deliveryMethod === "tại cửa hàng"
          ? "TP.HCM"
          : selectedCity;

      // Xác định quận/huyện dựa trên phương thức giao hàng
      const checkoutSelectedDistrict =
        deliveryMethod === "tại nhà"
          ? userAddress.selectedDistrict
          : deliveryMethod === "tại cửa hàng"
          ? "Quận XYZ"
          : selectedDistrict;

      // Xác định phường/xã dựa trên phương thức giao hàng
      const checkoutSelectedWard =
        deliveryMethod === "tại nhà"
          ? userAddress.selectedWard
          : deliveryMethod === "tại cửa hàng"
          ? "Phường MNL"
          : wards.find(
              (ward) => ward.Name === document.querySelector('[name="ward"]').value
            )?.Name || null;

      await addDoc(collection(db, 'check'), {
        bill: mahoadon,
        user: khachhang,
        datetime: new Date().toISOString(),
        total: totalPrice,
        products: cart.map((item) => ({
          name: item.name,
          imageUrl: item.imageUrl,
          quantity: Number(item.quantity) || 1,
          price: (Number(item.price) || 0) * (Number(item.quantity) || 1),
        })),
        deliveryMethod: deliveryMethod,
        paymentMethod: paymentMethod,
        address: checkoutAddress, 
        selectedCity: checkoutSelectedCity,
        selectedDistrict: checkoutSelectedDistrict, 
        selectedWard: checkoutSelectedWard,
        deliveryTime:deliveryTime ,
      });
      alert('Thanh toán thành công!');
      clearCart(); 
      router.push('/');
    } catch (error) {
      console.error('Lỗi thanh toán: ', error);
      alert('Có lỗi xảy ra khi thanh toán.');
    }
  };


    return (
      <div className="flex flex-col lg:flex-col w-full p-2 bg-pink-100 h-fit lg:mt-0 mt-2">
        <h2 className="text-3xl font-semibold text-pink-700">Chọn thông tin giao hàng</h2>
        <div>
          <label className="block font-semibold">Ngày giao hàng:</label>
          <input
            type="datetime-local"
            className="w-full border p-2 rounded-md mt-1"
            value={deliveryTime}
            onChange={handleDeliveryTimeChange}
          />
        </div>
        <div className="w-full mb-1">
          <p className="font-semibold mb-1">Địa điểm nhận hàng</p>
          <div className="flex flex-col gap-1">
            <label className="flex">
              <input
                type="radio"
                value="tại cửa hàng"
                checked={deliveryMethod === 'tại cửa hàng'}
                onChange={handleDeliveryChange}
                className="form-radio mr-1"
              />
              Tại cửa hàng
            </label>
            <label className="flex">
              <input
                type="radio"
                value="tại nhà"
                checked={deliveryMethod === 'tại nhà'}
                onChange={handleDeliveryChange}
                className="form-radio mr-1"
              />
              Tại nhà
            </label>
            <label className="flex">
              <input
                type="radio"
                value="địa chỉ khác"
                checked={deliveryMethod === 'địa chỉ khác'}
                onChange={handleDeliveryChange}
                className="form-radio mr-1"
              />
              Địa chỉ khác
            </label>
          </div>
          {deliveryMethod === 'địa chỉ khác' && (
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="Địa chỉ"
                className="border rounded p-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                onChange={handleCityChange}
                value={selectedCity}
              >
                <option value="">Chọn Thành phố/Tỉnh</option>
                {addressData?.map((city) => (
                  <option key={city.Code} value={city.Name}>
                    {city.FullName}
                  </option>
                ))}
              </select>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                onChange={handleDistrictChange}
                value={selectedDistrict}
                disabled={!selectedCity}
              >
                <option value="">Chọn Quận/Huyện</option>
                {districts?.map((district) => (
                  <option key={district.Code} value={district.Name}>
                    {district.FullName}
                  </option>
                ))}
              </select>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                disabled={!selectedDistrict}
                name="ward"
              >
                <option value="">Chọn Phường/Xã</option>
                {wards?.map((ward) => (
                  <option key={ward.Code} value={ward.Name}>
                    {ward.FullName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="w-full">
          <p className="font-semibold mb-1">Chọn hình thức thanh toán</p>
          <div className="flex flex-col gap-1">
            <label className="flex items-center">
              <input
                type="radio"
                value="chuyển khoản"
                checked={paymentMethod === 'chuyển khoản'}
                onChange={handlePaymentChange}
                className="form-radio mr-1"
              />
              Chuyển khoản
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="tiền mặt"
                checked={paymentMethod === 'tiền mặt'}
                onChange={handlePaymentChange}
                className="form-radio mr-1"
              />
              Tiền mặt
            </label>
          </div>
          <div className="w-full">
            <div className="mt-6">
              <p className="text-3xl font-semibold text-pink-700 text-left">
                <span>Tổng tiền:</span> {totalPrice} 
              </p>
              <button
                onClick={handleCheckout}
                className="mt-4 w-full bg-green-400 hover:bg-green-600 hover:shadow-sm text-white px-6 py-3 rounded-md"
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default OrderForm;