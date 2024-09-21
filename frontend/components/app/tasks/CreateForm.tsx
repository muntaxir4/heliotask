"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { DialogClose } from "@/components/ui/dialog";
import { useSetRecoilState } from "recoil";
import { tasksState } from "@/store/atoms";

function DatePickerDemo({
  date,
  setDate,
}: {
  date?: Date;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal md:col-span-2",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? "Due: " + format(date, "PPP") : <span>Pick a Due Date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default function CreateForm() {
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const setTasks = useSetRecoilState(tasksState);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsDisabled(true);
    const formData = new FormData(event.currentTarget);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(
        API_URL + "/user/create-task",
        {
          title: formData.get("title"),
          description: formData.get("description"),
          status: formData.get("status"),
          priority: formData.get("priority"),
          dueDateTime: date?.getTime(),
        },
        { withCredentials: true }
      );
      toast({
        title: "Task Created",
      });
      setTasks((tasks) => [{ ...response.data.task, isNew: true }, ...tasks]);
    } catch {
      toast({
        title: "Failed to create task",
        variant: "destructive",
      });
    }
    dialogCloseRef.current?.click();
  }
  return (
    <form className="grid gap-2" onSubmit={handleSubmit}>
      <div>
        <label>Title: *</label>
        <Input type="text" name="title" required />
      </div>
      <div>
        <label>Description:</label>
        <Textarea name="description" />
      </div>
      <div className="grid grid-cols-2 gap-1">
        <Select name="status">
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TO_DO">Todo</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select name="priority">
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid md:grid-cols-4 w-full gap-2">
        <DatePickerDemo date={date} setDate={setDate} />
        <Button type="submit" className="md:col-start-4" disabled={isDisabled}>
          Create Task
        </Button>
        <DialogClose ref={dialogCloseRef} />
      </div>
    </form>
  );
}
