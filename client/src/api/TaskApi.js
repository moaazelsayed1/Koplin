import axiosClient from './axiosClient'

const TaskApi = {
    create: (params) => axiosClient.post('tasks', params),
    updateTask: (idBoard, idTask, params) =>
        axiosClient.patch(`tasks/board/${idBoard}/task/${idTask}`, params),
    members: (id) => axiosClient.get(`users/board/${id}/users`),
    delete: (idboard, idtask) =>
        axiosClient.delete(`tasks/board/${idboard}/task/${idtask}`),
    getAllmyTasks: () => axiosClient.get(`tasks/myTasks`),
}

export default TaskApi
