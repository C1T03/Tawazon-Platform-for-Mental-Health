import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/auth/userSlice';
import AuthReducer from '../features/auth/AuthLogIn'
const store = configureStore({
    reducer:{
        user: userReducer,
        AuthLogIn: AuthReducer
    }
})
export default store;