import { createSlice } from "@reduxjs/toolkit";

// Dummy drivers data 
const dummyData = [
  {
    _id: 1,
    name: "Rajesh Kumar",
    assignedTo: "Express 1",
    phone: "+91 9876543210",
    joined: "May 10, 2025",
    status: "Active",
  },
  {
    _id: 2,
    name: "Sunil Patil",
    assignedTo: "Express 2",
    phone: "+91 8765432109",
    joined: "Apr 15, 2025",
    status: "Active",
  },
  {
    _id: 3,
    name: "Amit Sharma",
    assignedTo: "Night Rider",
    phone: "+91 7654321098",
    joined: "Mar 22, 2025",
    status: "Active",
  },
];

const initialState = [...dummyData];

const driverSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {
    addDriver: (state, action) => {
      state.push({ id: Date.now(), ...action.payload });
    },
    deleteDriver: (state, action) => {
      return state.filter(driver => driver.id !== action.payload);
    },
  },
});

export const { addDriver, deleteDriver } = driverSlice.actions;
export default driverSlice.reducer;