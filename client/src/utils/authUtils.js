import authAPI from '../api/AuthAPI'
const authUtils = {
    isAuthenticated: async () => {
        try {
            const res = await authAPI.verifyUser()
            return res.data.data
        } catch (err) {
            return false
        }
    },
}

export default authUtils
