"use client"
import { useState,useEffect  } from 'react';
import Image from 'next/image'
import { useCart } from '../context/cartcontext';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone,faShoppingBag,faCalculator,faEnvelope,faSignIn,faBars } from '@fortawesome/free-solid-svg-icons';
import { faYoutube, faFacebook, faInstagram,faTiktok,faTwitter } from '@fortawesome/free-brands-svg-icons';


export default  function Layout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const {cart, addToCart, showLoginModal, hideLoginModal, updateUserPhone } = useCart();
    
    useEffect(() => {
        const user = localStorage.getItem('loggedInUser');
        if (user) {
          setLoggedInUser(user);
        }
      }, []);
    

      const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
      };

      const handleLogin = (phone) => {
        updateUserPhone(phone);
        hideLoginModal();
      };
    
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
            {loggedInUser ? (
        <p className="text-lg">Chào mừng {loggedInUser}</p>
      ) : (
            <Link className="text-lg" href="/login/login"><FontAwesomeIcon icon={faSignIn} /> Đăng nhập </Link>
      )}
            <Link className="text-lg" href="/shopping/cart"><FontAwesomeIcon icon={faShoppingBag}/> {cart.length} sản phẩm</Link>
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
          
          {loggedInUser ? (
        <p className="ml-15 bg-pink-300 text-right px-2  rounded-full w-fit text-sm sm:text-base md:text-sm  hover:bg-yellow-500 hover:text-white transition-colors  hidden sm:block"> Chào mừng {loggedInUser}</p>
      ) : (
          <Link href="/login/login">
          <div className=" justify-self-end end">
        <div className="bg-gray-100 px-4 py-2 w-36 rounded-full text-sm sm:text-base md:text-sm cursor-pointer hover:bg-pink-300 hover:text-white transition-colors  hidden sm:block  ">
        <FontAwesomeIcon icon={faSignIn} className="text-sm xl:text-base"/> Đăng nhập 
        </div></div>
        </Link>
      )}
        <div className=" justify-self-end ">
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
        {children}
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

          );
}