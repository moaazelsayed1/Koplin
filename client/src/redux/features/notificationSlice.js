import { createSlice } from '@reduxjs/toolkit'
import { useEffect } from 'react'
import NotificationsApi from '../../api/notificationsApi'

const initialState = { value: [] }

const fetchNotifications = async (dispatch) => {
    try {
        const response = await NotificationsApi.getMy()
        const messages = response.data.data.map((message) => message.message)
        dispatch(setNotifications(messages))
    } catch (error) {}
}

export const fetchNotificationsAsync = () => (dispatch) => {
    fetchNotifications(dispatch)
}

export const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotifications: (state, action) => {
            state.value = action.payload
        },
    },
})

export const { setNotifications } = notificationSlice.actions

export default notificationSlice.reducer
