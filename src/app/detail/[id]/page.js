// pages/flowers/[id].jsx
"use client"
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { CldImage } from 'next-cloudinary';
import {db} from '../../Firebase'
import {collection,where,query,getDocs} from 'firebase/firestore'

const FlowerDetailPage = ({params}) => {
  const router = useRouter();
  const { id } = useParams();
  const [flower, setFlower] = useState(null);
  const flowerCollection = collection(db, 'Flower');
  const q = query(flowerCollection, where('id', '==', id));

useEffect(() => {
const fetchFlower = async () => {
try {


  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    querySnapshot.forEach((doc) => {
        const flowerData = doc.data();
        console.log("Document data:", flowerData);
        setFlower(flowerData);

    });
} else {
    console.log("No such document!");
}
} catch (error) {
console.error("Error fetching document:", error);
}
};
fetchFlower();
}, [id]);


  if (!flower) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Flower not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
           
            <div className="md:w-1/2">
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
            </div>

            {/* Details Section */}
            <div className="md:w-1/2 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {flower.name}
              </h1>
              <p className="text-gray-600 mb-4">{flower.description}</p>
              
              <div className="mb-4">
                <span className="text-3xl font-semibold text-green-600">
                  {flower.price} VND
                </span>
                <p className="text-sm text-gray-500">
                  {flower.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                  {flower.quantity > 0 && ` (${flower.quantity} available)`}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Category:</span> {flower.category}
                </p>
              </div>

              {/* Add to Cart Button */}
              <button
                className={`w-full py-3 px-4 rounded-md text-white font-semibold ${
                  flower.quantity > 0
                    ? 'bg-pink-600 hover:bg-pink-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={flower.quantity === 0}
              >
                {flower.quantity > 0 ? 'Add to Cart' : 'Sold Out'}
              </button>

              {/* Care Instructions */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Care Instructions
                </h3>
                <p className="text-gray-600 text-sm">{flower.careInstructions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mt-6 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to Shop
        </button>
      </div>
    </div>
  );
};

export default FlowerDetailPage;