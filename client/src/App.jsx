import { useState } from 'react'
import './App.css'
import './theme.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import AuthLayout from './components/layout/AuthLayout'
import Home from './pages/Home'
import Board from './pages/Board'
import Login from './pages/Login'
import Signup from './pages/Signup'
//theme

//core
import 'primereact/resources/primereact.min.css'

//icons
import 'primeicons/primeicons.css'
import Loading from './components/common/Loading'
import AccountSettings from './pages/AccountSettings'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                </Route>

                <Route path="/" element={<AppLayout />}>
                    <Route index element={<Home />} />
                    <Route path="boards" element={<Home />} />
                    <Route path="boards/:boardId" element={<Board />} />
                    <Route path="account" element={<AccountSettings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
