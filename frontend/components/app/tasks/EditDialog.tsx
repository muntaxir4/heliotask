import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import EditForm from "./EditForm";
import { Task } from "@/components/types";

export default function EditDialog({ task }: { task: Task }) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"ghost"} className="rounded-none w-full">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card min-w-[80%] w-fit grid">
        <DialogHeader>
          <DialogTitle>Edit a Task</DialogTitle>
          <DialogDescription>
            This will edit the selected task
          </DialogDescription>
        </DialogHeader>
        <EditForm task={task} />
      </DialogContent>
    </Dialog>
  );
}
