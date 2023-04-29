import axiosClient from './axiosClient'

const TaskApi = {
    create: (params) => axiosClient.post('tasks', params),
    updateTask: (idBoard, idTask, params) =>
        axiosClient.patch(`tasks/board/${idBoard}/task/${idTask}`, params),
    members: (id) => axiosClient.get(`users/board/${id}/users`),
    delete: (id) => axiosClient.delete(`tasks/${id}`),
    getAllmyTasks: () => axiosClient.get(`tasks/myTasks`),
}

export default TaskApi
