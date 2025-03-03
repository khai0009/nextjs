"use client";
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAddressData } from '../../address';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { db } from '../../Firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const [addressData, setAddressData] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState(''); // Mật khẩu
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districts, setDistricts] = useState([]);
  const [address, setAddress] = useState('');
  const [wards, setWards] = useState([]);
  const [isRegistering, setIsRegistering] = useState(true); // Thêm trạng thái đăng ký/đăng nhập
  const router = useRouter();
  const auth = getAuth();

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
    setSelectedDistrict('');
    const selectedCityData = addressData?.find((city) => city.Name === cityName);
    if (selectedCityData) {
      setDistricts(selectedCityData.District || []);
      setWards([]);
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
      if (isRegistering) {
        // Đăng ký
        const userCredential = await createUserWithEmailAndPassword(auth, `${phoneNumber}@example.com`, password); // Sử dụng email giả để đăng ký
        const user = userCredential.user;
        await addDoc(collection(db, 'users'), {
          uid: user.uid, // Thêm UID của người dùng vào document
          phoneNumber,
          address,
          selectedCity,
          selectedDistrict,
          selectedWard: wards.find((ward) => ward.Name === event.target.ward.value)?.Name || '',
        });
        alert('Đăng ký thành công!');
        localStorage.setItem('loggedInUser', phoneNumber);
        router.push('/');
      } else {
        // Đăng nhập
        await signInWithEmailAndPassword(auth, `${phoneNumber}@example.com`, password);
        alert('Đăng nhập thành công!');
        localStorage.setItem('loggedInUser', phoneNumber);
        router.push('/');
      }
    } catch (error) {
      console.error('Lỗi: ', error);
      alert(`Lỗi: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-100">
      <Head>
        <title>{isRegistering ? 'Đăng ký' : 'Đăng nhập'}</title>
      </Head>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center text-pink-600">{isRegistering ? 'Đăng ký' : 'Đăng nhập'}</h2>
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
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          {isRegistering && (
            <>
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
                  disabled={!selectedCity}
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
            </>
          )}
                  <div className="mt-4 grid">
                  <Link href="/login/login" className="text-base text-pink-600 hover:underline">
                    Đã có tài khoản
                  </Link>
                  
                </div>  
                  <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-pink-600 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    Đăng ký
                  </button>
                </form>
                <div className="mt-4 grid">
                  <Link href="/" className="text-sm text-pink-600 hover:underline">
                    Quay lại
                  </Link>
                  
                </div>
              </div>
            </div>
          
  );
}
