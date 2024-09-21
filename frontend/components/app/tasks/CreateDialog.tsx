import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { PencilIcon } from "lucide-react";
import CreateForm from "./CreateForm";

export default function CreateDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip delayDuration={40}>
            <TooltipTrigger>
              <PencilIcon />
            </TooltipTrigger>
            <TooltipContent>Create a Task</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="bg-card min-w-[80%] w-fit grid">
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
