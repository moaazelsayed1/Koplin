import axiosClient from './axiosClient'

const TopicApi = {
    create: (params) => axiosClient.post('topics', params),
    getAll: () => axiosClient.get('topics'),
    // login: (params) => axiosClient.post('users/login', params),
    // verifyUser: () => axiosClient.get('users/me'),
}

export default TopicApi
