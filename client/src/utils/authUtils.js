import authAPI from '../api/AuthAPI'
import Cookies from 'universal-cookie'
const authUtils = {
    isAuthenticated: async () => {
        // const cookies = new Cookies()
        const token = localStorage.getItem('token')
        // const token = cookies.get('jwt')
        if (!token) return false
        try {
            // const res = await authAPI.verifyToken()
            // return res.user
            return true
        } catch (err) {
            return false
        }
    },
}

export default authUtils
