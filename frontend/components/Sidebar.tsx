import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { AlignLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import LogginUser from "./app/LogginUser";

export default function Sidebar() {
  return (
    <Sheet>
      <SheetTrigger>
        <AlignLeftIcon />
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className="bg-neutral-200 opacity-100 flex flex-col justify-between"
      >
        <SheetHeader>
          <SheetTitle>Available Routes</SheetTitle>
        </SheetHeader>
        <div className="grid mt-4 gap-2">
          <Link href="/app">
            <SheetClose className="w-full rounded-3xl border-[0.5px] p-2  border-primary">
              Kanban
            </SheetClose>
          </Link>
          <Link href="/app/tasks">
            <SheetClose className="w-full rounded-3xl border-[0.5px] p-2  border-primary">
              All Tasks
            </SheetClose>
          </Link>
        </div>
        <LogginUser />
      </SheetContent>
    </Sheet>
  );
}
