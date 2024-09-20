import { DateRange } from "react-day-picker";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Filters {
  status: ("TO_DO" | "IN_PROGRESS" | "COMPLETED")[];
  priority: ("LOW" | "MEDIUM" | "HIGH")[];
  sortBy:
    | "priority_asc"
    | "priority_desc"
    | "status_asc"
    | "status_desc"
    | "dueDate_asc"
    | "dueDate_desc"
    | undefined;
  dueDateRange: DateRange | undefined;
}
