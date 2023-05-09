import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: [] }
export const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setBoards: (state, action) => {
            state.value = action.payload
        },
    },
})

export const { setNotifications } = notificationSlice.actions

export default notificationSlice.reducer
