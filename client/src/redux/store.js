import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'
import topicReducer from './features/topicSlice'
import boardReducer from './features/boardSlice'
export const store = configureStore({
    reducer: {
        user: userReducer,
        board: boardReducer,
        topic: topicReducer,
    },
})
