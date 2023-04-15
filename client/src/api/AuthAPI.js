import axiosClient from './axiosClient'

const authAPI = {
    signup: (params) => axiosClient.post('users/signup', params),
    login: (params) => axiosClient.post('users/login', params),
    verifyUser: () => axiosClient.get('users/me'),
}

export default authAPI
