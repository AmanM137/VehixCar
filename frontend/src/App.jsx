import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatBot from './pages/ChatBot/ChatBot'

const App = () => {


  return (
    <>
      <div className='app'>
        <ToastContainer theme="colored" />
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/chat' element={<ChatBot/>} />
        </Routes>
      </div>
    </>
  )
}

export default App
