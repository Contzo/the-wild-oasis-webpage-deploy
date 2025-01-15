"use client";

import { useState } from "react";

export default function Counter({ users }) {
  const [counter, setCounter] = useState(0);
  return (
    <div>
      <p>There are {users.length} users</p>
      <button onClick={() => setCounter((curr) => curr + 1)}>{counter}</button>
    </div>
  );
}
