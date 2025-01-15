"use client";
import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useReservationContext } from "./ReservationContext";

function isAlreadyBooked(range, datesArr) {
  return (
    range.from &&
    range.to &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range.from, end: range.to })
    )
  );
}

function DateSelector({ settings, cabin, bookedDates }) {
  const { range, setRange, resetRange } = useReservationContext(); // get the range and setRange function from the context
  const { regularPrice, discount } = cabin; // get the regularPrice and discount from the cabin
  const displayRange = isAlreadyBooked(range, bookedDates)
    ? { to: null, from: null }
    : range; // check if the range is already booked
  const numNights = differenceInDays(displayRange.to, displayRange.from); // calculate the number of nights
  const cabinPrice = numNights * (regularPrice - discount); // calculate the cabin price
  const { minBookingLength, maxBookingLength } = settings; // get the minBookingLength and maxBookingLength from the settings

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        captionLayout="dropdown"
        mode="range"
        onSelect={(range) => setRange(range)}
        selected={displayRange}
        min={minBookingLength + 1}
        max={{ maxBookingLength }}
        numberOfMonths={2}
        pagedNavigation
        showOutsideDays
        startMonth={new Date()}
        endMonth={new Date(new Date().getFullYear() + 5, 11)}
        disabled={(currentDate) =>
          isPast(currentDate) ||
          bookedDates.some((date) => isSameDay(date, currentDate))
        }
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {displayRange.from || displayRange.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={() => resetRange()}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
