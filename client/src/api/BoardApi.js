import axiosClient from './axiosClient'

const BoardApi = {
    getAll: () => axiosClient.get('boards'),
    getOne: (id) => axiosClient.get(`boards/${id}`),
    getTasks: (id) => axiosClient.get(`tasks/board/${id}`),
    create: (id, params) => axiosClient.post(`boards/topic/${id}`, params),
    Update: (id, params) => axiosClient.put(`boards/${id}`, params),
    delete: (id) => axiosClient.delete(`boards/${id}`),
}

export default BoardApi
