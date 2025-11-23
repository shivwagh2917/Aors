import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Bookings from './pages/Bookings'
import GenerateBill from './pages/GenerateBill'
import AdminProducts from './pages/AdminProducts'
import WorkerPanel from './pages/WorkerPanel'
import './styles.css'

function App(){
  const token = localStorage.getItem('token')
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/dashboard' element={ token ? <Dashboard/> : <Navigate to='/' />} />
        <Route path='/bookings' element={ token ? <Bookings/> : <Navigate to='/' />} />
        <Route path='/generate-bill' element={ token ? <GenerateBill/> : <Navigate to='/' />} />
        <Route path='/admin/products' element={ token ? <AdminProducts/> : <Navigate to='/' />} />
        <Route path='/worker' element={ token ? <WorkerPanel/> : <Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App/>)
