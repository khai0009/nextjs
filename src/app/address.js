export async function getAddressData() {
    try {
      const response = await fetch(
        'https://cdn.jsdelivr.net/gh/ThangLeQuoc/vietnamese-provinces-database/json/simplified_json_generated_data_vn_units_minified.json'
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching address data:', error);
      return []; // Trả về mảng rỗng nếu có lỗi
    }
  }
