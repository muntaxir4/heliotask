"use client";
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
import LoggedinUser from "./app/LoggedinUser";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/atoms";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const user = useRecoilValue(userState);
  const pathname = usePathname();
  if (!user) return <div></div>;
  return (
    <Sheet>
      <SheetTrigger>
        <AlignLeftIcon />
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className="bg-background opacity-100 flex flex-col justify-between"
      >
        <SheetHeader>
          <SheetTitle>Available Routes</SheetTitle>
        </SheetHeader>
        <div className="grid mt-4 gap-2">
          <Link href="/app">
            <SheetClose
              className={cn(
                "w-full rounded-3xl border-[0.5px] p-2  border-primary font-medium",
                pathname.endsWith("/app") && "bg-slate-300 dark:bg-slate-800"
              )}
            >
              Kanban
            </SheetClose>
          </Link>
          <Link href="/app/tasks">
            <SheetClose
              className={cn(
                "w-full rounded-3xl border-[0.5px] p-2  border-primary font-medium",
                pathname.endsWith("/app/tasks") &&
                  "bg-slate-300 dark:bg-slate-800"
              )}
            >
              All Tasks
            </SheetClose>
          </Link>
        </div>
        <LoggedinUser />
      </SheetContent>
    </Sheet>
  );
}
