
"use client"
import { useState, useEffect  } from 'react';
import { db } from '../app/Firebase';
import { CldImage } from 'next-cloudinary';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { useCart } from './context/cartcontext';
import Image from 'next/image'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone,faShoppingBag,faCalculator,faEnvelope,faSignIn,faBars } from '@fortawesome/free-solid-svg-icons';
import { faYoutube, faFacebook, faInstagram,faTiktok,faTwitter } from '@fortawesome/free-brands-svg-icons';


export default function Home() {
  const [flowers, setFlowers] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const {cart, addToCart, showLoginModal, hideLoginModal, updateUserPhone } = useCart();


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };



  const handleLogin = (phone) => {
    updateUserPhone(phone);
    hideLoginModal();
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

    <div className="w-full ">
      
 
      <header className=" items-center grid grid-flow-col grid-cols-3 sm:grid-cols-7 px-5 border-b bg-pink-200">
      <div className=" block sm:hidden">
      <button className="peer bg-white rounded-xl border  text-xl p-2" onClick={toggleMenu}
      ><FontAwesomeIcon icon={faBars}/></button>
      <div  onClick={toggleMenu} className={`flex flex-row bg-opacity-50 bg-gray-700 h-full w-full top-0 left-0 absolute transition-opacity duration-1000 ${ isMenuOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
      <ul className=" w-[70%] h-full bg-white rounded-sm  px-2  flex flex-col pt-28">
      <li className=' border-b-2  border-red-300'>
        <Link href="" >
      <Image src="/Beautifulflower.jpg" className='mx-auto'width={200} height={100} alt="Beatifulflower.com" ></Image>
      </Link>
      </li>
      <li className="border-b-2  border-red-300 pl-5">
      <p className="text-lg"><FontAwesomeIcon icon={faSignIn} /> Đăng nhập </p>
      <p className="text-lg"><FontAwesomeIcon icon={faShoppingBag}/> {cart.length} sản phẩm</p>
      </li>
        <li className="border-b-2  border-red-300 pl-5">
        <p className=" text-lg "><FontAwesomeIcon icon={faPhone}/> 0993745782</p>
        <p className=" text-lg  "><FontAwesomeIcon icon={faCalculator}/> thứ 2 - 6: 7h30 - 21h30 <br/><FontAwesomeIcon icon={faCalculator}/> Thứ 7: 7h30 - 20h30</p>
        </li>
      </ul>
  
      </div>
      
      
    </div>
    <p className=" text-sm xl:text-base font-semibold hidden sm:block "><FontAwesomeIcon icon={faEnvelope} className="text-xs lg:text-base"/> Beatifulflower@gmail.com</p>
    <p className=" text-sm xl:text-base font-semibold hidden sm:block text-center"><FontAwesomeIcon icon={faPhone} className="text-sm lg:text-base"/> 0993745782</p>
    <p className=" text-sm xl:text-base font-semibold hidden sm:block"><FontAwesomeIcon icon={faCalculator} className="text-sm lg:text-base"/> thứ 2 - 6: 7h30 - 21h30 <br/><FontAwesomeIcon icon={faCalculator}/> Thứ 7: 7h30 - 20h30</p>
    <Image src="/Beautifulflower.jpg" width={200} height={100} className='col-span-2 sm:col-span-1' alt="Beatifulflower" ></Image>
    

    <Link href="/login/login">
    <div className=" justify-self-end border-2">
  <div className="bg-gray-100 px-4 py-2 w-36 rounded-full text-sm sm:text-base md:text-sm cursor-pointer hover:bg-pink-300 hover:text-white transition-colors  hidden sm:block  ">
  <FontAwesomeIcon icon={faSignIn} className="text-sm xl:text-base"/> Đăng nhập 
  </div></div>
</Link>
<div className=" justify-self-end border-2">
    <Link href="/shopping/cart">
  <div className="bg-gray-100 px-4 py-2 w-12 md:w-36 text-center rounded-full text-sm sm:text-base cursor-pointer hidden sm:block">
  <FontAwesomeIcon icon={faShoppingBag} className="text-sm xl:text-base"/> {cart.length} sản phẩm
  </div>
  </Link>
  </div>
  <div className='grid grid-flow-col gap-1 md:px-9'>
  <FontAwesomeIcon icon={faFacebook} className="text-xl xl:text-4xl"/>
  <FontAwesomeIcon icon={faYoutube} className="text-xl xl:text-4xl"/>
  <FontAwesomeIcon icon={faInstagram} className="text-xl xl:text-4xl"/>
  </div>

</header>
     <div className="max-w-6xl mx-auto px-2 bg-white">
      <input
        type="text"
        placeholder="Search flowers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 my-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
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
  
      <footer className="bg-gray-100 py-8">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Thông tin liên hệ */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
        <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
        <p>Điện thoại: 0123 456 789</p>
        <p>Email: info@flowershop.com</p>
      </div>

      {/* Liên kết nhanh */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:text-blue-500">Trang chủ</a></li>
          <li><a href="#" className="hover:text-blue-500">Sản phẩm</a></li>
          <li><a href="#" className="hover:text-blue-500">Giới thiệu</a></li>
          <li><a href="#" className="hover:text-blue-500">Liên hệ</a></li>
        </ul>
      </div>

      {/* Mạng xã hội */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Mạng xã hội</h3>
        <div className="flex space-x-4 xl:space-x-0 flex-row xl:flex-col">
          <a href="#" className="hover:text-blue-500"><FontAwesomeIcon icon={faTiktok} /> Tiktok</a>
          <a href="#" className="hover:text-blue-500"><FontAwesomeIcon icon={faFacebook} /> Facebook</a>
          <a href="#" className="hover:text-blue-500"><FontAwesomeIcon icon={faInstagram} /> Instagram</a>
          <a href="#" className="hover:text-blue-500"><FontAwesomeIcon icon={faTwitter} /> Twitter</a>
        </div>
      </div>
    </div>
    <div className="mt-8 text-center">
      <p>&copy; 2023 Flower Shop. All rights reserved.</p>
    </div>
  </div>
</footer>
</div>
    </div>
    
  );
  
}