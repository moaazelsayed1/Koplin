import axiosClient from './axiosClient'

const TaskApi = {
    create: (params) => axiosClient.post('tasks', params),
    updateTask: (id, params) => axiosClient.put(`tasks/${id}`, params),
}

export default TaskApi
