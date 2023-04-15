import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: [] }
export const topicSlice = createSlice({
    name: 'topics',
    initialState,
    reducers: {
        setTopics: (state, action) => {
            state.value = action.payload
        },
    },
})

export const { setTopics } = topicSlice.actions

export default topicSlice.reducer
