import { createSlice } from "@reduxjs/toolkit";

// Dummy bus data
const dummyBusData = [
  {
    id: 1,
    name: "Night Rider",
    route: "Mumbai - Pune",
    time: "07:00 PM",
    seats: 17,
    price: 250,
  },
  {
    id: 2,
    name: "Express 1",
    route: "Pune - Mumbai",
    time: "08:30 AM",
    seats: 30,
    price: 300,
  },
  {
    id: 3,
    name: "Express 2",
    route: "Mumbai - Nashik",
    time: "10:00 PM",
    seats: 24,
    price: 280,
  },
];

const initialState = [...dummyBusData];

const busSlice = createSlice({
  name: "buses",
  initialState,
  reducers: {
    setInitialBuses: (state, action) => {
      return action.payload;
    },
    addBus: (state, action) => {
      state.push(action.payload);
    },
    editBus: (state, action) => {
      const index = state.findIndex((bus) => bus.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    deleteBus: (state, action) => {
      return state.filter((bus) => bus.id !== action.payload);
    },
  },
});

export const { addBus, editBus, deleteBus, setInitialBuses } = busSlice.actions;
export default busSlice.reducer;
