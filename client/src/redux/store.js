import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'
import topicReducer from './features/topicSlice'
import boardReducer from './features/boardSlice'
import cachReducer from './features/cashSlice'
export const store = configureStore({
    reducer: {
        user: userReducer,
        board: boardReducer,
        topic: topicReducer,
        cash: cachReducer,
    },
})
