import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  name: "",
  age: "",
  email: "",
  password: "",
  gender: "",
  role: "",
  country: "",
  profile_picture: "",
  bio: ""
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.age = action.payload.age;
      state.role = action.payload.role;
      state.gender = action.payload.gender;
      state.country = action.payload.country;
      state.profile_picture = action.payload.profile_picture;
      state.bio = action.payload.bio;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
