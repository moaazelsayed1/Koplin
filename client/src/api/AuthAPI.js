import axiosClient from './axiosClient'

const authAPI = {
    signup: (params) => axiosClient.post('users/signup', params),
    login: (params) => axiosClient.post('users/login', params),
    verifyToken: () => axiosClient.get('auth/verify-token'),
}

export default authAPI
