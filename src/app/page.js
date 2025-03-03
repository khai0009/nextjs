
"use client"
import { useState, useEffect  } from 'react';
import { db } from '../app/Firebase';
import { CldImage } from 'next-cloudinary';
import { collection, getDocs,query,orderBy } from 'firebase/firestore';
import Link from 'next/link';
import { useCart } from './context/cartcontext';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Layout from './layout/layout'

export default function Home() {
  const [flowers, setFlowers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [LoggedInUser,setLoggedInUser] = useState('')
  const {cart, addToCart, showLoginModal, hideLoginModal, updateUserPhone } = useCart();


  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' hoặc 'desc'

  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        let flowersQuery = collection(db, 'Flower');
        flowersQuery = query(flowersQuery, orderBy('price', sortOrder)); // Áp dụng sắp xếp
        const querySnapshot = await getDocs(flowersQuery);
        const flowersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFlowers(flowersData);
      } catch (error) {
        console.error('Lỗi khi tải hoa:', error);
      }
    };

    fetchFlowers();
  }, [sortOrder]); // Theo dõi sự thay đổi của sortOrder

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };


  useEffect(() => {
    const fetchFlowers = async () => {
      const flowersCollection = collection(db, 'Flower');
      const flowersSnapshot = await getDocs(flowersCollection);
      const flowersList = flowersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFlowers(flowersList);
    };
    fetchFlowers();
  }, []);
  


  const purchaseNow = (flower) => {
    alert(`Purchasing ${flower.name} now!`);
  };

  const filteredFlowers = flowers.filter(flower =>
    flower.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (

    
    <Layout>
<div className="max-w-6xl mx-auto px-2 bg-white">
      <input
        type="text"
        placeholder="Tìm hoa yêu thích của bạn..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 my-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select value={sortOrder} onChange={handleSortChange}>
        <option value="asc">Giá tăng dần</option>
        <option value="desc">Giá giảm dần</option>
      </select>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-center py-2">
        {filteredFlowers.map(flower => (
       
          <Link href={`/detail/${flower.id}`} key={flower.id} className="border rounded-lg hover:shadow-lg transition-shadow">
            <CldImage
      src={flower.imageUrl} // Use this sample image or upload your own via the Media Explorer
      width="500" // Transform the image: auto-crop to square aspect_ratio
      height="700"
      crop={{
        type: 'auto',
        source: true
      }}
      alt={flower.name}
    />
            <div>
              <h2 className="text-xl font-semibold">{flower.name}</h2>
             
              <p className="text-lg font-medium mt-2"> {flower.price} VND</p>
              <div className="flex gap-2 mt-4">
              <div>
      {/* ... */}
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors" onClick={() => addToCart({ id: 1, name: 'Sản phẩm 1', price: 10 })}>
        Thêm vào giỏ hàng
      </button>
    </div>
                <button 
                  onClick={() => purchaseNow(flower)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                 Mua ngay
                </button>
              </div>
            </div>
            
          </Link>
              
        ))}
        
      </div>
  
      </div>

    </Layout>
     
    
  );
  
}