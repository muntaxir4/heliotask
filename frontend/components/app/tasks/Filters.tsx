"use client";

import { Filters as FiltersType } from "@/components/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const statusOptions: {
  label: string;
  value: "TO_DO" | "IN_PROGRESS" | "COMPLETED";
}[] = [
  { label: "Todo", value: "TO_DO" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
];

const priorityOptions: {
  label: string;
  value: "LOW" | "MEDIUM" | "HIGH";
}[] = [
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
];

function DateRangePicker({
  filters,
  setFilters,
}: {
  filters: FiltersType;
  setFilters: Dispatch<SetStateAction<FiltersType>>;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "w-fit justify-start text-left font-base font-medium",
            !filters.dueDateRange && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {filters.dueDateRange?.from ? (
            filters.dueDateRange.to ? (
              <>
                {format(filters.dueDateRange.from, "LLL dd, y")} -{" "}
                {format(filters.dueDateRange.to, "LLL dd, y")}
              </>
            ) : (
              format(filters.dueDateRange.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a Date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={filters.dueDateRange?.from}
          selected={filters.dueDateRange}
          onSelect={(e) => setFilters((prev) => ({ ...prev, dueDateRange: e }))}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}

export default function Filters({
  filters,
  setFilters,
}: {
  filters: FiltersType;
  setFilters: Dispatch<SetStateAction<FiltersType>>;
}) {
  return (
    <div className="m-2 grid sm:flex gap-2 justify-between">
      <div className="flex items-center gap-2">
        <p>Filters:</p>
        <div className="grid sm:flex gap-2 sm:gap-3">
          <div className="flex gap-3">
            <Popover>
              <PopoverTrigger>
                <Button type="button" variant={"outline"} className="text-base">
                  Status <ChevronDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="grid w-fit">
                {statusOptions.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="checkbox"
                      name={option.label}
                      id={option.label}
                      checked={filters.status.includes(option.value)}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          status: e.target.checked
                            ? [...prev.status, option.value]
                            : prev.status.filter(
                                (status) => status !== option.value
                              ),
                        }))
                      }
                    />
                    <label htmlFor={option.label}>{option.label}</label>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger>
                <Button type="button" variant={"outline"} className="text-base">
                  Priority <ChevronDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="grid w-fit">
                {priorityOptions.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="checkbox"
                      name={option.label}
                      id={option.label}
                      checked={filters.priority.includes(option.value)}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          priority: e.target.checked
                            ? [...prev.priority, option.value]
                            : prev.priority.filter(
                                (priority) => priority !== option.value
                              ),
                        }))
                      }
                    />
                    <label htmlFor={option.label}>{option.label}</label>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          </div>
          <DateRangePicker filters={filters} setFilters={setFilters} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p>Sort by</p>
        <Select
          value={filters.sortBy}
          onValueChange={(e) => {
            // @ts-expect-error - 'e' value is a string
            setFilters((prev) => ({ ...prev, sortBy: e }));
          }}
        >
          <SelectTrigger className="w-fit text-base font-medium">
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="status_asc">Status Asc</SelectItem>
            <SelectItem value="status_dsc">Status Dsc</SelectItem>
            <SelectItem value="priority_asc">Priority Asc</SelectItem>
            <SelectItem value="priority_dsc">Priority Dsc</SelectItem>
            <SelectItem value="dueDate_asc">Due Date Asc</SelectItem>
            <SelectItem value="dueDate_dsc">Due Date Dsc</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
