
"use client"
// pages/login.js
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAddressData } from '../../address';
import {collection} from 'firebase/firestore';
import {đb} from '../../Firebase'

export default function Login() {
  const [addressData, setAddressData] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districts, setDistricts] = useState([]);
  const [address,setAddress] = useState('');
  const [wards, setWards] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getAddressData();
      setAddressData(data);
    }
    fetchData();
  }, []);

        const handleCityChange = (event) => {
          const cityName = event.target.value;
          setSelectedCity(cityName);
          setSelectedDistrict(''); // Reset quận/huyện khi chọn thành phố mới
          const selectedCityData = addressData?.find((city) => city.Name === cityName);
          if (selectedCityData) {
            setDistricts(selectedCityData.District || []);
            setWards([]); // Reset phường/xã khi chọn thành phố mới
          } else {
            setDistricts([]);
            setWards([]);
          }
        };
      
        const handleDistrictChange = (event) => {
          const districtName = event.target.value;
          setSelectedDistrict(districtName);
          const selectedDistrictData = districts?.find((district) => district.Name === districtName);
          if (selectedDistrictData) {
            setWards(selectedDistrictData.Ward || []);
          } else {
            setWards([]);
          }
        };
      
  

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                await addDoc(collection(db, 'users'), {
                
                phoneNumber,
                address,
                selectedCity,
                selectedDistrict,
                selectedWard: wards.find((ward) => ward.Name === event.target.ward.value)?.Name || '',
              });
              alert('Data saved to Firebase!');
            } catch (error) {
              console.error('Error saving data: ', error);
              alert('Error saving data to Firebase.');
            }
          };
        
          return (
            <div className="flex items-center justify-center min-h-screen bg-pink-100">
              <Head>
                <title>Login</title>
              </Head>
              <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
                <h2 className="text-2xl font-bold text-center text-pink-600">Đăng nhập</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input
                      maxLength={10}
                      type="text"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Thành phố/Tỉnh</label>
                    <select
                      required
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
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Quận/Huyện</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      onChange={handleDistrictChange}
                      value={selectedDistrict}
                      disabled={!selectedCity} // Disable nếu chưa chọn thành phố
                    >
                      <option value="">Chọn Quận/Huyện</option>
                      {districts?.map((district) => (
                        <option key={district.Code} value={district.Name}>
                          {district.FullName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Phường/Xã</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      disabled={!selectedDistrict} // Disable nếu chưa chọn quận/huyện
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
                  <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-pink-600 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    Sign In
                  </button>
                </form>
                <div className="mt-4 text-center">
                  <Link href="/" className="text-sm text-pink-600 hover:underline">
                    Quay lại
                  </Link>
                </div>
              </div>
            </div>
          
  );
}
