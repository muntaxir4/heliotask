"use client";

import { refetchState, userState } from "@/store/atoms";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { statusColumns } from "./Home";
import { DroppableProvided } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import { useEffect } from "react";

async function fetchKanbanTasks(id: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const status = id;
  const response = await axios.get(API_URL + "/user/tasks?status=" + status, {
    withCredentials: true,
  });
  return response.data;
}

export default function StatusColumn({
  column,
  provided,
}: {
  column: (typeof statusColumns)[0];
  provided: DroppableProvided;
}) {
  const user = useRecoilValue(userState);
  const isRefetch = useRecoilValue(refetchState);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [user, "kanban", column.id],
    queryFn: () => fetchKanbanTasks(column.id),
  });

  useEffect(() => {
    refetch();
  }, [isRefetch]);

  if (isLoading) return <div>Loading...</div>;
  else if (error) return <div>Error fetching {column.title} tasks</div>;
  return (
    <div
      className="border p-2 m-2 rounded-lg overflow-auto grid content-start shadow-md"
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      <p className="font-semibold text-lg text-center">{column.title}</p>
      <div className="">
        {data.statusTasks?.map((item: any, index: any) => (
          <TaskCard key={index} item={item} index={index} />
        ))}
      </div>
      {provided.placeholder}
    </div>
  );
}
