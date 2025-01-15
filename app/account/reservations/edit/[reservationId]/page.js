import UpdateReservationButton from "@/app/_components/UpdateReservationButton";
import { updateReservation } from "@/app/_lib/actions";
import { getBooking } from "@/app/_lib/data-service";

export default async function Page({ params }) {
  const { reservationId } = params; // get reserved id from the dynamic segment of the route
  const {
    numGuests,
    observations,
    cabins: { maxCapacity },
  } = await getBooking(reservationId); // get the cabin data
  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{reservationId}
      </h2>

      <form
        action={updateReservation}
        className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
            defaultValue={`${numGuests}`}
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            defaultValue={observations}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          />
        </div>
        <UpdateReservationButton />
        <input
          type="number"
          name="reservationId"
          defaultValue={reservationId}
          className="hidden"
        />
      </form>
    </div>
  );
}
