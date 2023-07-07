import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    profile: "moses"
}

export const userReducer = createSlice({
    name: 'user',
    initialState,
    reducers: {
        getProfile(state, { payload }) {
            return state
        }
    }

})

export const { getProfile } = userReducer.actions
export default userReducer.reducer