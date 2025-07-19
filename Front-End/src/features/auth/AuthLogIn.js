import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    LogIn: false
};


const AuthLogIn = createSlice({
name: 'Auth',
initialState,
reducers: {
    setLogIn :(state)=>{
        state.LogIn  = !state.LogIn

    }
}
})

export const { setLogIn } = AuthLogIn.actions;
export default AuthLogIn.reducer;
