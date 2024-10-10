"use client";

import { refetchState, tasksState, userState } from "@/store/atoms";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import TaskCard from "./TaskCard";
import { Filters as FiltersType, Task } from "@/components/types";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

async function fetchTasks(filters: FiltersType) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.post(
    API_URL + "/user/tasks",
    {
      status: filters.status.length ? filters.status : undefined,
      priority: filters.priority.length ? filters.priority : undefined,
      sortBy: filters.sortBy,
      dueDateRange: filters.dueDateRange
        ? {
            from: filters.dueDateRange.from?.getTime(),
            to: filters.dueDateRange.to?.getTime(),
          }
        : undefined,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export default function Tasks({ filters }: { filters: FiltersType }) {
  const user = useRecoilValue(userState);
  //prev data, used to compare and update tasks only when data changes
  const [prevData, setPrevData] = useState<any>();

  const [tasks, setTasks] = useRecoilState(tasksState);
  const isRefetch = useRecoilValue(refetchState);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [user, "tasks", filters],
    queryFn: () => fetchTasks(filters),
  });

  useEffect(() => {
    refetch();
  }, [isRefetch]);

  if (isLoading) return <Loading />;
  if (isError) return <p>Error...</p>;
  else if (data?.tasks) {
    if (prevData != data) {
      setTasks(data.tasks);
      setPrevData(data);
    }
  }

  if (tasks.length === 0) {
    return <p>No task found</p>;
  } else {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 items-start ">
        {tasks.map((task: Task) => (
          <TaskCard item={task} key={task.id} />
        ))}
      </div>
    );
  }
}
