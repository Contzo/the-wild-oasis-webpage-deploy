"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

function Filter() {
  const searchParams = useSearchParams(); // get the current search params
  const router = useRouter(); // get the router object
  const currentPath = usePathname(); // get the current path
  const activeFilter = searchParams.get("capacity") ?? "all"; // get the current filter value
  function handleFilter(filter) {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    router.replace(`${currentPath}?${params.toString()}`, { scroll: false }); // navigate to the new URL with the updated search params
  }
  return (
    <div className="border border-primary-800 flex ">
      <Button
        handleFilter={handleFilter}
        filter={"all"}
        activeFilter={activeFilter}
      >
        All cabins
      </Button>
      <Button
        handleFilter={handleFilter}
        filter={"small"}
        activeFilter={activeFilter}
      >
        1&mdash;3 guest
      </Button>
      <Button
        handleFilter={handleFilter}
        filter={"medium"}
        activeFilter={activeFilter}
      >
        4&mdash;7 guest
      </Button>
      <Button
        handleFilter={handleFilter}
        filter={"large"}
        activeFilter={activeFilter}
      >
        8&mdash;12 guest
      </Button>
    </div>
  );
}

function Button({ children, filter, activeFilter, handleFilter }) {
  return (
    <button
      onClick={() => handleFilter(filter)}
      className={`px-5 py-2 hover:bg-primary-700 ${
        activeFilter === filter ? "bg-primary-700" : ""
      }`}
    >
      {children}
    </button>
  );
}

export default Filter;
