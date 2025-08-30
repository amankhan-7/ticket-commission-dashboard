import { createSlice } from "@reduxjs/toolkit";

<<<<<<< HEAD
// Dummy driver data
const dummyDriverData = [
  {
    _id: 1,
    name: "John Doe",
    phoneNumber: "+91 9876543210",
    drivingLicense: "DL123456789",
    joinedAt: "2024-01-15",
    assignedBus: null,
  },
  {
    _id: 2,
    name: "Jane Smith",
    phoneNumber: "+91 9876543211",
    drivingLicense: "DL987654321",
    joinedAt: "2024-02-01",
    assignedBus: "Bus001",
  },
  {
    _id: 3,
    name: "Mike Johnson",
    phoneNumber: "+91 9876543212",
    drivingLicense: "DL456789123",
    joinedAt: "2024-01-20",
    assignedBus: null,
  },
];

const initialState = [...dummyDriverData];
=======
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
>>>>>>> origin/amanFrontend

const driverSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {
<<<<<<< HEAD
    setInitialDrivers: (state, action) => {
      return action.payload;
    },
    addDriver: (state, action) => {
      state.push(action.payload);
    },
    editDriver: (state, action) => {
      const index = state.findIndex(
        (driver) => driver._id === action.payload._id
      );
      if (index !== -1) state[index] = action.payload;
    },
    deleteDriver: (state, action) => {
      return state.filter((driver) => driver._id !== action.payload);
    },
    assignDriverToBus: (state, action) => {
      const { driverId, busId } = action.payload;
      const driver = state.find((d) => d._id === driverId);
      if (driver) {
        driver.assignedBus = busId;
      }
    },
    unassignDriverFromBus: (state, action) => {
      const driverId = action.payload;
      const driver = state.find((d) => d._id === driverId);
      if (driver) {
        driver.assignedBus = null;
      }
=======
    addDriver: (state, action) => {
      state.push({ id: Date.now(), ...action.payload });
    },
    deleteDriver: (state, action) => {
      return state.filter(driver => driver.id !== action.payload);
>>>>>>> origin/amanFrontend
    },
  },
});

<<<<<<< HEAD
export const {
  addDriver,
  editDriver,
  deleteDriver,
  setInitialDrivers,
  assignDriverToBus,
  unassignDriverFromBus,
} = driverSlice.actions;
export default driverSlice.reducer;
=======
export const { addDriver, deleteDriver } = driverSlice.actions;
export default driverSlice.reducer;
>>>>>>> origin/amanFrontend
