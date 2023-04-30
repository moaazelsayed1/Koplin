import axiosClient from './axiosClient'

const TopicApi = {
    create: (params) => axiosClient.post('topics', params),
    getAll: () => axiosClient.get('topics/myTopics'),
    editTopic: (id, params) => axiosClient.patch(`topics/${id}`, params),
    deleteTopic: (id) => axiosClient.delete(`topics/${id}`),
    addMemeber: (boardId, userId) =>
        axiosClient.get(`boards/board/${boardId}/user/${userId}`),
    getAllusers: (id) => axiosClient.get(`users/board/${id}/users`),
}

export default TopicApi
