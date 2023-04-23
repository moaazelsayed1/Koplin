import axiosClient from './axiosClient'

const UserApi = {
    getOne: (username) => axiosClient.get(`users?username=${username}`),
    getOnebyId: (id) => axiosClient.get(`users/${id}`),
    LogOut: () => axiosClient.get(`users/logout`),
}

export default UserApi
