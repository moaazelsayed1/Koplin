import axiosClient from './axiosClient'

const BoardApi = {
    getAll: () => axiosClient.get('boards'),
    getOne: (id) => axiosClient.get(`boards/${id}`),
    getTasks: (id) => axiosClient.get(`tasks/board/${id}`),
    create: (params) => axiosClient.post('boards', params),
    Update: (id, params) => axiosClient.put(`boards/${id}`, params),
}

export default BoardApi
