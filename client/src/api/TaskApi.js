import axiosClient from './axiosClient'

const TaskApi = {
    // create: (params) => axiosClient.post('topics', params),
    updateTask: (id, params) => axiosClient.put(`tasks/${id}`, params),
    // login: (params) => axiosClient.post('users/login', params),
    // verifyUser: () => axiosClient.get('users/me'),
    // getOne: (id) => axiosClient.get(`boards/${id}`),
    // getTasks: (id) => axiosClient.get(`tasks/board/${id}`),
}

export default TaskApi
