import authAPI from '../api/AuthAPI'
import Cookies from 'universal-cookie'
const authUtils = {
    isAuthenticated: async () => {
        // const cookies = new Cookies()

        const token = localStorage.getItem('token')
        // const token = cookies.get('jwt')
        if (!token) return false
        try {
            const res = await authAPI.verifyUser()
            return res.data.data
        } catch (err) {
            return 'You are not authenticated. Please login again'
        }
    },
}

export default authUtils
