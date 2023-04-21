import axiosClient from './axiosClient'

const TopicApi = {
    create: (params) => axiosClient.post('topics', params),
    getAll: () => axiosClient.get('topics'),
    editTopic: (id, params) => axiosClient.put(`topics/${id}`, params),
    deleteTopic: (id) => axiosClient.delete(`topics/${id}`),
}

export default TopicApi
