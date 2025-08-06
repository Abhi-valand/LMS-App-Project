import Navbar from '@/components/navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className='dark:bg-[#0A0A0A]/80'>
      <Navbar/>
      <div >
        <Outlet />
      </div>
      
    </div>
  )
}

export default MainLayout
