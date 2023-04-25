import axiosClient from './axiosClient'

const TaskApi = {
    create: (params) => axiosClient.post('tasks', params),
    updateTask: (id, params) => axiosClient.put(`tasks/${id}`, params),
    members: (id) => axiosClient.get(`users/topics/${id}/users`),
    delete: (id) => axiosClient.delete(`tasks/${id}`),
    getAllmyTasks: () => axiosClient.get(`tasks/myTasks`),
}

export default TaskApi
