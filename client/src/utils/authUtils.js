import authAPI from '../api/AuthAPI'
import Cookies from 'universal-cookie'
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

// using local storage

// isAuthenticated: async () => {
//     // const cookies = new Cookies()

//     // const token = localStorage.getItem('token')
//     // const res = await authAPI.verifyUser()
//     // console.log(res)
//     // const token = cookies.get('jwt')
//     // if (!res) return false
//     try {
//         const res = await authAPI.verifyUser()
//         return res.data.data
//     } catch (err) {
//         return false
//         // return 'You are not authenticated. Please login again'
//     }
// },
// }
