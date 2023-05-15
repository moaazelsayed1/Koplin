import axiosClient from './axiosClient'

const NotificationsApi = {
    getMy: () =>
        axiosClient.get(
            'notifications/myNotifications?page=1&limit=5&sort=-createdAt'
        ),
    setRead: (params) => axiosClient.post('notifications/mark-seen', params),
}

export default NotificationsApi
