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

import io from 'socket.io-client'
import { useSelector } from 'react-redux'

const socket = io.connect('http://localhost:3000')

function App() {
    socket.on('notification', (response) => {})
    const userId = useSelector((state) => state.user.value)
    if (userId.user_id) socket.emit('join', userId.user_id)

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                </Route>

                <Route path="/" element={<AppLayout socket={socket} />}>
                    <Route index element={<Home />} />
                    <Route path="boards" element={<Home />} />
                    <Route
                        path="boards/:boardId"
                        element={<Board socket={socket} />}
                    />
                    <Route path="account" element={<AccountSettings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
