"use client";
import { Task } from "../types";
import { Draggable } from "react-beautiful-dnd";
import { Badge } from "@/components/ui/badge";
import { GripHorizontal } from "lucide-react";

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function DraggableTaskCard({
  item,
  index,
}: {
  item: Task;
  index: number;
}) {
  return (
    <Draggable draggableId={item.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="border p-3 m-2 rounded-lg bg-card grid gap-2 hover:ring-1">
            <div className="flex justify-between">
              <p className="font-semibold">{item.title}</p>
              <GripHorizontal className="h-4" />
            </div>
            <pre className="text-slate-500 tracking-wide w-full overflow-auto pb-2">
              {item.description}
            </pre>
            <div className="flex gap-2">
              <Badge
                variant={"secondary"}
                className="rounded-full bg-yellow-100 text-black"
              >
                Priority: {item.priority}
              </Badge>
              <Badge
                variant={"secondary"}
                className={`rounded-full text-black ${
                  item.status === "COMPLETED" ? "bg-green-300" : "bg-red-300"
                }`}
              >
                Status: {item.status}
              </Badge>
            </div>
            <div className="text-end">
              {item.dueDate && (
                <Badge
                  variant={"outline"}
                  className="text-sm rounded-full w-fit"
                >
                  {"Due: " + formatDate(item.dueDate)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
