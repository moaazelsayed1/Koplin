import axiosClient from './axiosClient'

const UserApi = {
    getOne: (username) => axiosClient.get(`users/${username}`),
    getOnebyId: (id) => axiosClient.get(`users/${id}`),
    LogOut: () => axiosClient.get(`users/logout`),
    update: (formData, contentType = 'multipart/form-data') => {
        const headers = {
            ...axiosClient.defaults.headers,
            'Content-Type': contentType,
        }
        return axiosClient.patch('users/updateMe', formData, { headers })
    },
}

export default UserApi
