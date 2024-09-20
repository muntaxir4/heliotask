import { Task, User } from "@/components/types";
import { atom } from "recoil";

const userState = atom<User | null>({
  key: "userState",
  default: null,
});
const refetchState = atom<boolean>({
  key: "refetchState",
  default: false,
});

const tasksState = atom<Task[]>({
  key: "tasksState",
  default: [],
});

export { userState, refetchState, tasksState };
