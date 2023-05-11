import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import authUtils from '../../utils/authUtils'
import Loading from '../common/Loading'
import Container from '../common/Container'
import LogoK from '../common/LogoK'
import SideBar from '../common/SideBar'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/features/userSlice'

const AppLayout = (props) => {
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const [IsLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            const user = await authUtils.isAuthenticated()
            if (!user) {
                navigate('/login')
            } else {
                dispatch(setUser(user))
                setIsLoading(false)
            }
        }
        checkAuth()
    }, [navigate])

    return IsLoading ? (
        <Loading fullHeight />
    ) : (
        <div className="flex  bg-gray-100 m-0">
            <SideBar socket={props.socket} className=" bg-black"></SideBar>
            <div className=" bg-slate-200 flex flex-1">
                <Outlet />
            </div>
        </div>
    )
}

export default AppLayout
