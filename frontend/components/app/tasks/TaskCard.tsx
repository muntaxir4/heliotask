import { Task } from "@/components/types";
import { Badge } from "@/components/ui/badge";
import { Ellipsis } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EditDialog from "./EditDialog";
import DeleteTask from "./DeleteTask";
import { cn } from "@/lib/utils";

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function TaskCard({ item }: { item: Task }) {
  return (
    <div
      className={cn(
        "bg-card border p-3 m-2 rounded-lg shadow-lg grid gap-2 content-start hover:ring-2",
        item?.isNew && "ring-1 ring-emerald-400"
      )}
    >
      <div className="w-full flex justify-end h-fit">
        <Popover>
          <PopoverTrigger>
            <Ellipsis className="h-4 hover:cursor-pointer hover:bg-muted" />
          </PopoverTrigger>
          <PopoverContent className="w-max p-0 grid">
            <EditDialog task={item} />
            <DeleteTask taskId={item.id} />
          </PopoverContent>
        </Popover>
      </div>
      <p className="font-semibold">{item.title}</p>
      <pre className="text-slate-500 tracking-wide">{item.description}</pre>
      <div className="flex gap-2">
        <Badge
          variant={"secondary"}
          className="rounded-full bg-yellow-100 text-black"
        >
          Priority: {item.priority}
        </Badge>
        <Badge
          variant={"secondary"}
          className={`text-foreground rounded-full text-black ${
            item.status === "COMPLETED" ? "bg-green-300" : "bg-red-300"
          }`}
        >
          Status: {item.status}
        </Badge>
      </div>
      <div className="text-end">
        {item.dueDate && (
          <Badge variant={"outline"} className="text-sm rounded-full w-fit">
            {"Due: " + formatDate(item.dueDate)}
          </Badge>
        )}
      </div>
    </div>
  );
}
