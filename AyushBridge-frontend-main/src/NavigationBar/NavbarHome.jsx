import React from 'react'
import './Navbar.css'
import Logo from '../assets/Logo.png'
import LogIn from '../Buttons/LogOut/LogIn'

const NavbarHome = () => {
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
            <LogIn />
        </div>
    </div>
  )
}

export default NavbarHome;