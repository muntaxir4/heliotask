"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { refetchState } from "@/store/atoms";
import axios from "axios";
import { useState } from "react";
import { useSetRecoilState } from "recoil";

export default function DeleteTask({ taskId }: { taskId: string }) {
  const { toast } = useToast();
  const [isDisabled, setIsDisabled] = useState(false);
  const setRefetch = useSetRecoilState(refetchState);

  async function handleSubmit() {
    setIsDisabled(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      await axios.delete(API_URL + "/user/delete-task?taskId=" + taskId, {
        withCredentials: true,
      });
      setRefetch((prev) => !prev);
      toast({ title: "Task deleted successfully" });
    } catch {
      toast({
        title: "An error occurred while deleting the task",
        variant: "destructive",
      });
    }
  }

  return (
    <Button
      variant={"destructive"}
      className="rounded-t-none"
      disabled={isDisabled}
      onClick={handleSubmit}
    >
      Delete
    </Button>
  );
}
