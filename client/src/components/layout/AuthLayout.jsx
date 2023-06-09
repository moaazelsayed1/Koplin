import React, { useState, useEffect, useRef } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import authUtils from '../../utils/authUtils'
import Loading from '../common/Loading'
import Container from '../common/Container'
import LogoK from '../common/LogoK'
import { Toast } from 'primereact/toast'

const AuthLayout = () => {
    const navigate = useNavigate()
    const [IsLoading, setIsLoading] = useState(true)
    const toast = useRef(null)

    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = await authUtils.isAuthenticated()
            if (!isAuth) {
                setIsLoading(false)
            } else {
                navigate('/')
            }
        }
        checkAuth()
    }, [navigate])

    return IsLoading ? (
        <Loading fullHeight />
    ) : (
        <Container>
            <LogoK />

            <Outlet />
        </Container>
    )
}

export default AuthLayout
