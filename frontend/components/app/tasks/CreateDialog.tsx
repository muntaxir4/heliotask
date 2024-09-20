import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PencilIcon } from "lucide-react";
import CreateForm from "./CreateForm";

export default function CreateDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <PencilIcon />
      </DialogTrigger>
      <DialogContent className="bg-card w-[80%] grid">
        <DialogHeader>
          <DialogTitle>Create a Task</DialogTitle>
          <DialogDescription>
            This will create a new todo task
          </DialogDescription>
        </DialogHeader>
        <CreateForm />
      </DialogContent>
    </Dialog>
  );
}
