import { Task, User } from "@/components/types";
import { atom } from "recoil";

const userState = atom<User | null>({
  key: "userState",
  default: null,
});

const tasksState = atom<Task[]>({
  key: "tasksState",
  default: [],
});

export { userState, tasksState };
