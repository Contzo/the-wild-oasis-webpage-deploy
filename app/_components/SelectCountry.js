import { getCountries } from "@/app/_lib/data-service";

async function SelectCountry({ defaultCountry, name, id, className }) {
  const countries = await getCountries();
  const flag =
    countries.find((country) => country.name.common === defaultCountry)?.flags
      .png ?? "";

  return (
    <select
      name={name}
      id={id}
      defaultValue={`${defaultCountry}%${flag}`}
      className={className}
    >
      <option value="">Select country...</option>
      {countries.map((country) => (
        <option
          key={country.name.common}
          value={`${country.name.common}%${country.flags.png}`}
        >
          {country.name.common}
        </option>
      ))}
    </select>
  );
}

export default SelectCountry;
