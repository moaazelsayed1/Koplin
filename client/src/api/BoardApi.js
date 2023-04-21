import axiosClient from './axiosClient'

const BoardApi = {
    // create: (params) => axiosClient.post('topics', params),
    getAll: () => axiosClient.get('boards'),
    // login: (params) => axiosClient.post('users/login', params),
    // verifyUser: () => axiosClient.get('users/me'),
    getOne: (id) => axiosClient.get(`boards/${id}`),
    getTasks: (id) => axiosClient.get(`tasks/board/${id}`),
    create: (params) => axiosClient.post('boards', params),
}

export default BoardApi
