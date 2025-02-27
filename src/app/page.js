// pages/index.js
"use client"
import { useState, useEffect } from 'react';
import { db } from '../app/Firebase';
import { CldImage } from 'next-cloudinary';
import { collection, getDocs } from 'firebase/firestore';

export default function Home() {
  const [flowers, setFlowers] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const addToCart = (flower) => {
    setCart([...cart, flower]);
  };

  const purchaseNow = (flower) => {
    alert(`Purchasing ${flower.name} now!`);
  };

  const filteredFlowers = flowers.filter(flower =>
    flower.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (

    <div className="max-w-6xl mx-auto p-4">
      <header className="flex flex-col sm:flex-row justify-between items-center py-4 border-b">
    <h1 className="text-3xl font-bold mb-2 sm:mb-0">Flower Shop</h1>
    <div className="bg-gray-100 px-4 py-2 rounded-full text-sm sm:text-base">
        Cart: {cart.length} items
    </div>
</header>

      <input
        type="text"
        placeholder="Search flowers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 my-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
        {filteredFlowers.map(flower => (
          <div key={flower.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <CldImage
      src={flower.imageUrl} // Use this sample image or upload your own via the Media Explorer
      width="500" // Transform the image: auto-crop to square aspect_ratio
      height="500"
      crop={{
        type: 'auto',
        source: true
      }}
      alt={flower.name}
    />
            <div>
              <h2 className="text-xl font-semibold">{flower.name}</h2>
              <p className="text-gray-600 mt-1">{flower.description}</p>
              <p className="text-lg font-medium mt-2">Price: ${flower.price}</p>
              <p className="text-gray-600">Quantity: {flower.quantity}</p>
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => addToCart(flower)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={() => purchaseNow(flower)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Purchase Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}