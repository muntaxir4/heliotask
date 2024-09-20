"use client";
import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  DropResult,
  resetServerContext,
} from "react-beautiful-dnd";
import StatusColumn from "./StatusColumn";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { refetchState } from "@/store/atoms";
import { useToast } from "@/hooks/use-toast";

export const statusColumns = [
  { id: "TO_DO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "COMPLETED", title: "Completed" },
];

export default function Home() {
  resetServerContext();
  const setRefetch = useSetRecoilState(refetchState);
  const { toast } = useToast();
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, source, destination } = result;
    async function changeTaskStatus() {
      toast({
        title: "Updating Task Status",
      });
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const taskId = draggableId;
        const status = destination.droppableId;
        await axios.post(
          API_URL + "/user/change-task-status",
          { taskId, status },
          { withCredentials: true }
        );
        setRefetch((prev) => !prev);
        toast({
          title: "Task Status Updated",
        });
      } catch (error) {
        toast({
          title: "Error updating task status",
          variant: "destructive",
        });
      }
    }
    if (source.droppableId !== destination.droppableId) changeTaskStatus();
  };

  return (
    <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
      <div className="grid sm:grid-cols-3 overflow-hidden">
        {statusColumns.map((column, index) => (
          <Droppable key={index} droppableId={column.id.toString()}>
            {(provided) => <StatusColumn provided={provided} column={column} />}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
