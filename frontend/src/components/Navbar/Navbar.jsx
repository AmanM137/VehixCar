import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="" className='logo' /></Link>
      <div className="title">
        <h1>VehixBot</h1>
      </div>
        <div className='navbar-profile'>
          <img src={assets.profile_icon} alt="" />
      </div>
    </div>
  )
}

export default Navbar
