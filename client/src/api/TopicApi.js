import axiosClient from './axiosClient'

const TopicApi = {
    create: (params) => axiosClient.post('topics', params),
    getAll: () => axiosClient.get('topics/myTopics'),
    editTopic: (id, params) => axiosClient.put(`topics/${id}`, params),
    deleteTopic: (id) => axiosClient.delete(`topics/${id}`),
    addMemeber: (topicId, userId) =>
        axiosClient.get(`topics/${topicId}/user/${userId}`),
    getAllusers: (id) => axiosClient.get(`users/topics/${id}/users`),
}

export default TopicApi
