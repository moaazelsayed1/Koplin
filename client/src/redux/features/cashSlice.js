import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: [] }
export const cashSlice = createSlice({
    name: 'cashs',
    initialState,
    reducers: {
        setCashs: (state, action) => {
            state.value = action.payload
        },
    },
})

export const { setCashs } = cashSlice.actions

export default cashSlice.reducer
