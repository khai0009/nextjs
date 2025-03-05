// addressUtils.js
import { useState, useEffect } from 'react';
import { getAddressData } from './address'; // Đảm bảo đường dẫn chính xác

export const useAddressSelection = () => {
  const [addressData, setAddressData] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districts, setDistricts] = useState([]);
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

  return {
    addressData,
    selectedCity,
    selectedDistrict,
    districts,
    wards,
    handleCityChange,
    handleDistrictChange,
    setSelectedCity, // Thêm để có thể đặt giá trị từ bên ngoài nếu cần
    setSelectedDistrict, // Thêm để có thể đặt giá trị từ bên ngoài nếu cần
    setWards, // Thêm để có thể đặt giá trị từ bên ngoài nếu cần
  };
};