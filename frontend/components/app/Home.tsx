"use client";
import { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

const tasks = [
  {
    id: 1,
    title: "To Do",
    data: [
      {
        id: 1,
        title: "Task 1",
        description: "Description for Task 1",
        status: "todo",
        priority: "high",
        due_date: "2023-10-01",
      },
      {
        id: 2,
        title: "Task 2",
        description: "Description for Task 2",
        status: "todo",
        priority: "medium",
        due_date: "2023-10-05",
      },
    ],
  },
  {
    id: 2,
    title: "In Progress",
    data: [
      {
        id: 3,
        title: "Task 3",
        description: "Description for Task 3",
        status: "inprogress",
        priority: "low",
        due_date: "2023-10-10",
      },
      {
        id: 4,
        title: "Task 4",
        description: "Description for Task 4",
        status: "inprogress",
        priority: "high",
        due_date: "2023-10-15",
      },
    ],
  },
  {
    id: 3,
    title: "Completed",
    data: [
      {
        id: 5,
        title: "Task 5",
        description: "Description for Task 5",
        status: "completed",
        priority: "medium",
        due_date: "2023-09-20",
      },
      {
        id: 6,
        title: "Task 6",
        description: "Description for Task 6",
        status: "completed",
        priority: "low",
        due_date: "2023-09-25",
      },
    ],
  },
];

export default function Home() {
  const [columns, setColumns] = useState(tasks);
  const onDragEnd = (result: DropResult) => {
    console.log(result);
    if (!result.destination) return;
    const { source, destination } = result;
    // if (source.droppableId !== destination.droppableId) {
    //   const sourceColumn = columns[source.droppableId];
    //   const destColumn = columns[destination.droppableId];
    //   const sourceItems = [...sourceColumn.items];
    //   const destItems = [...destColumn.items];
    //   const [removed] = sourceItems.splice(source.index, 1);
    //   destItems.splice(destination.index, 0, removed);
    //   setColumns({
    //     ...columns,
    //     [source.droppableId]: {
    //       ...sourceColumn,
    //       items: sourceItems,
    //     },
    //     [destination.droppableId]: {
    //       ...destColumn,
    //       items: destItems,
    //     },
    //   });
    // } else {
    //   const column = columns[source.droppableId];
    //   const copiedItems = [...column.items];
    //   const [removed] = copiedItems.splice(source.index, 1);
    //   copiedItems.splice(destination.index, 0, removed);
    //   setColumns({
    //     ...columns,
    //     [source.droppableId]: {
    //       ...column,
    //       items: copiedItems,
    //     },
    //   });
    // }
  };

  return (
    <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
      <div className="grid sm:grid-cols-3">
        {columns.map((column, index) => (
          <Droppable key={index} droppableId={column.id.toString()}>
            {(provided, snapshot) => (
              <div
                className="border p-2 m-2 rounded-lg "
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <p className="font-semibold">{column.title}</p>
                {column.data.map((item, index) => (
                  <TaskCard key={index} item={item} index={index} />
                ))}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
