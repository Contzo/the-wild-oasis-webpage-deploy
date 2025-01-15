"use client"; // This directive indicates that this file should be treated as a client-side component

import { createContext, useContext, useMemo, useState } from "react";

// Create a context for the reservation
const ReservationContext = createContext();

// Initial state for the reservation range
const initialState = { from: undefined, to: undefined };

// Provider component to wrap around parts of the app that need access to the reservation context
export default function ReservationProvider({ children }) {
  // State to hold the selected date range
  const [range, setRange] = useState(initialState);

  // Memoize the context value object to avoid unnecessary re-renders, if the provider re-renders but the context doesn't change
  const contextValueObject = useMemo(() => {
    return {
      range,
      setRange,
      resetRange: () => setRange(initialState), // reset function that will set the range back to the initial state
    };
  }, [range]);

  return (
    // Provide the range and setRange function to the context consumers
    <ReservationContext.Provider value={contextValueObject}>
      {children}
    </ReservationContext.Provider>
  );
}

// Custom hook to use the ReservationContext
export function useReservationContext() {
  // Get the context value
  const context = useContext(ReservationContext);

  // If the context is not available, throw an error
  if (!context) {
    throw new Error(
      "useReservationContext must be used within a ReservationProvider"
    );
  }

  // Return the context value
  return context;
}
