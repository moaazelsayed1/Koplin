import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import authUtils from '../../utils/authUtils'
import Loading from '../common/Loading'
import Container from '../common/Container'
import LogoK from '../common/LogoK'
import SideBar from '../common/SideBar'

const AppLayout = () => {
    const navigate = useNavigate()

    const [IsLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            const user = await authUtils.isAuthenticated()
            if (!user) {
                navigate('/login')
            } else {
                setIsLoading(false)
            }
        }
        checkAuth()
    }, [navigate])

    return IsLoading ? (
        <Loading fullHeight />
    ) : (
        <div className=" flex">
            <SideBar className=" bg-black"></SideBar>
            <div className=" bg-slate-700 flex flex-1">
                <Outlet />
            </div>
        </div>
    )
}

export default AppLayout
