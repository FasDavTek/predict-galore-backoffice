import { createSlice } from "@reduxjs/toolkit";

interface NotificationState {
  unreadCount: number;
}

const initialState: NotificationState = {
  unreadCount: 0,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
});

export const { setUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;
