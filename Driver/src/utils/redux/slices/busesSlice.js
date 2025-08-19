import { createSlice } from "@reduxjs/toolkit";

// Dummy bus data
const dummyBusData = [
  {
    id: 1,
    name: "Night Rider",
    route: "Mumbai → Pune",
     departureTime: "07:00 AM",
      arrivalTime: "10:00 AM",
    seats: 17,
    price: 250,
    bookedSeats: 10,
  },
  {
    id: 2,
    name: "Express 1",
    route: "Pune → Mumbai",
      departureTime: "11:00 AM",
      arrivalTime: "01:00 PM",
    seats: 30,
    price: 300,
    bookedSeats: 12,
  },
  {
    id: 3,
    name: "Express 2",
    route: "Mumbai → Nashik",
      departureTime: "02:00 PM",
      arrivalTime: "4:00 PM",
    seats: 24,
    price: 280,
    bookedSeats: 19,
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
