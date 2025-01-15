"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import supabase from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";
import { isWithinInterval } from "date-fns";

export async function signInAction() {
  let googleProvider = null;
  try {
    // Fetch the list of available providers
    const response = await fetch("http://localhost:3000/api/auth/providers", {
      cache: "no-store", // Ensure you get the latest providers list
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch providers: ${response.status}`);
    }

    const providers = await response.json();

    // Convert the providers object to an array and find the Google providerlet providers = null
    const providerArray = Object.values(providers);
    googleProvider = providerArray.find((provider) => provider.id === "google");

    if (!googleProvider) {
      throw new Error("Google provider not found");
    }

    // Use the provider dynamically
  } catch (error) {
    console.error("Error during sign-in:", error);
    throw new Error("Sign-in failed");
  }
  await signIn(googleProvider.id, { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateProfile(formData) {
  // Firs we need to make sure that the user is authenticated
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }
  const nationalID = formData.get("nationalID"); // get the national ID from the form data
  const [nationality, countryFlag] = formData.get("nationality").split("%"); // get the nationality  and country flag from the form data

  // provide a regex test to validate the national ID as alphanumeric string between 6 and 12 characters
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
    throw new Error("Invalid national ID");
  }

  const updateData = { nationality, countryFlag, nationalID };
  const guestId = session.user.guestId;
  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", guestId)
    .select()
    .single();

  if (error) {
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile"); // Revalidate the profile page
}

export async function deleteReservation(bookingId) {
  // Firs we need to make sure that the user is authenticated
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const guestBookings = await getBookings(session.user.guestId); // get all the bookings for the authenticated user
  const guestBookingsIds = guestBookings.map((booking) => booking.id); // get the ids of the bookings
  if (!guestBookingsIds.includes(bookingId)) {
    throw new Error("Your are not allowed to delete this booking");
  }

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);
  if (error) {
    throw new Error("Booking could not be deleted");
  }
  revalidatePath("/account/reservations"); // Revalidate the reservations page
}

export async function updateReservation(updateReservationForm) {
  // Firs we need to make sure that the user is authenticated
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }
  const reservationId = Number(updateReservationForm.get("reservationId"));
  const guestBookings = await getBookings(session.user.guestId); // get all the bookings for the authenticated user
  const guestBookingsIds = guestBookings.map((booking) => booking.id); // get the ids of the bookings
  if (!guestBookingsIds.includes(reservationId)) {
    throw new Error("Your are not allowed to update this booking");
  }
  const numGuests = updateReservationForm.get("numGuests");
  const observations = updateReservationForm.get("observations");
  if (observations.length > 200) {
    throw new Error("Observations must be less than 200 characters");
  }
  const updateData = { numGuests, observations };
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", reservationId);
  if (error) {
    throw new Error("Booking could not be updated");
  }
  revalidatePath(`/account/reservations/edit/${reservationId}`); // Revalidate the reservations page
  redirect("/account/reservations");
}

export async function createBooking(bookingData, formData) {
  // 1. we need to make sure that the user is authenticated
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }

  // 2. Construct the new booking object
  const createBookingObject = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: formData.get("numGuests"),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };
  // 3. Validate the received data
  // a) Get all the bookings for the cabin we want to reserve starting from the start date
  const { data: cabinReservations, error: cabinResError } = await supabase
    .from("bookings")
    .select("startDate, endDate")
    .eq("cabinId", bookingData.cabinId);
  if (cabinResError) {
    throw new Error("Could not fetch the cabin bookings for validation");
  }
  // check if the cabin is not already booked.
  const isValidReservation = !cabinReservations.some(
    (bookedInterval) =>
      bookingData.start <= new Date() ||
      (bookedInterval.startDate <= bookingData.endDate &&
        bookedInterval.endDate >= bookingData.startDate)
  );
  if (!isValidReservation) {
    throw new Error(`Tried to book an unavailable date for the cabin`);
  }
  // 4. create the new DB entry
  const { error } = await supabase
    .from("bookings")
    .insert([createBookingObject]);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }
  // 5. Revalidate the Router cache to keep the UI fresh
  revalidatePath(`/cabins/${createBookingObject.cabinId}`);
  // // 6. Redirect to user to thank you
  redirect("/cabins/thankyou");
}
