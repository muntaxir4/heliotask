"use client";
import { Task } from "../types";
import { Draggable } from "react-beautiful-dnd";

export default function TaskCard({
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
          <div className="border p-2 m-2 rounded-lg bg-white">
            <p className="font-semibold">{item.title}</p>
            <p>{item.description}</p>
            <p>{item.status}</p>
            <p>{item.priority}</p>
            <p>{item.dueDate}</p>
          </div>
        </div>
      )}
    </Draggable>
  );
}
