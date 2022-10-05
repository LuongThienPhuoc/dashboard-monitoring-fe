import { createSlice } from "@reduxjs/toolkit"

export const authenSlice = createSlice({
    name: "authen",
    initialState: {
        isLogin: true
    },
    reducers: {
        handleLogin: (state) => {
            state.isLogin = true
        },
        handleLogout: (state) => {
            state.isLogin = false
        }
    }
})

export const { handleLogin, handleLogout } = authenSlice.actions

export default authenSlice.reducer