import { Task } from "@/components/types";
import { Badge } from "@/components/ui/badge";

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
    <div className="border p-3 m-2 rounded-lg shadow-lg grid gap-2 content-start hover:ring-2">
      <p className="font-semibold">{item.title}</p>
      <p className="text-slate-500 tracking-wide">{item.description}</p>
      <div className="flex gap-2">
        <Badge variant={"secondary"} className="rounded-full bg-yellow-100">
          Priority: {item.priority}
        </Badge>
        <Badge
          variant={"secondary"}
          className={`text-foreground rounded-full ${
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
