import { safeLocalStorage } from "@/utils/localStorage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * Hydrate auth state from localStorage
 */
export const hydrateAuth = createAsyncThunk(
  "auth/hydrate",
  async (_, { rejectWithValue }) => {
    try {
      const user = await safeLocalStorage.getItem("user");
      return user;
    } catch (error) {
      console.error("Error hydrating auth state:", error);
      return rejectWithValue(null);
    }
  }
);

/**
 * Set credentials for any user type (counterPerson or ticketExecutive)
 * payload = { user, token, userType }
 */
export const setCredentials = createAsyncThunk(
  "auth/setCredentials",
  async (payload, { rejectWithValue }) => {
    try {
      const { user, token, userType } = payload;
      const storedUser = { ...user, token, userType };
      await safeLocalStorage.setItem("user", storedUser);
      return storedUser;
    } catch (error) {
      console.error("Error setting credentials:", error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Logout current user
 */
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await safeLocalStorage.removeItem("user");
      return null;
    } catch (error) {
      console.error("Error during logout:", error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Initial auth state
 */
const initialState = {
  user: null,              // {id, firstName, phone, token, userType, ...}
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // HYDRATE
      .addCase(hydrateAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
        state.error = null;
      })
      .addCase(hydrateAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // SET CREDENTIALS
      .addCase(setCredentials.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setCredentials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(setCredentials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, clearAuth } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectUserType = (state) => state.auth.user?.userType;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
