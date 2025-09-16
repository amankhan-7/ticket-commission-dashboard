// store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profilePic: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfilePic: (state, action) => {
      state.profilePic = action.payload;
    },
  },
});

export const { setProfilePic } = userSlice.actions;
export default userSlice.reducer;
