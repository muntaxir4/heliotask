"use client";

import { useState } from "react";
import Filters from "./Filters";
import Tasks from "./Tasks";
import { Filters as FiltersType } from "@/components/types";
import { addDays } from "date-fns";

export default function TasksView() {
  const [filters, setFilters] = useState<FiltersType>({
    status: [],
    priority: [],
    sortBy: undefined,
    dueDateRange: {
      from: new Date(),
      to: addDays(new Date(), 90),
    },
  });
  return (
    <>
      <Filters filters={filters} setFilters={setFilters} />
      <hr className="my-2" />
      <Tasks filters={filters} />
    </>
  );
}
