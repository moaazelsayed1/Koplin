import axiosClient from './axiosClient'

const NotificationsApi = {
    getMy: () => axiosClient.get('notifications/myNotifications'),
}

export default NotificationsApi
