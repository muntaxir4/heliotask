import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlignLeftIcon } from "lucide-react";

export default function Sidebar() {
  return (
    <Sheet>
      <SheetTrigger>
        <AlignLeftIcon />
      </SheetTrigger>
      <SheetContent side={"left"} className="bg-neutral-300 opacity-100">
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
