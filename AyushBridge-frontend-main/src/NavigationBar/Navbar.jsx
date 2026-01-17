import React from 'react'
import './Navbar.css'
import Logo from '../assets/Logo.png'
import Logout from '../Buttons/LogOut/LogOut'

const Navbar = () => {
  return (
    <div className='navbar'>
        <div className='logo'>
            <img src={Logo} alt="AyushBridge Logo" />
        </div>
        <div className='title'>
            <span>
                AyushBridge
            </span>
        </div>
        <div className='logout-section'>
            <Logout />
        </div>
    </div>
  )
}

export default Navbar