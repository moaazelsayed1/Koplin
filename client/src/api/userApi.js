import axiosClient from './axiosClient'

const UserApi = {
    getOne: (username) => axiosClient.get(`users/${username}`),
    getOnebyId: (id) => axiosClient.get(`users/${id}`),
    LogOut: () => axiosClient.get(`users/logout`),
    update: (id, params) => axiosClient.patch(`users/${id}`, params),
}

export default UserApi
