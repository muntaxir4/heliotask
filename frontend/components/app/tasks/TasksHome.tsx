import CreateDialog from "./CreateDialog";
import TasksView from "./TasksView";

export default function TasksHome() {
  return (
    <div className="m-2 overflow-auto">
      <div className="flex justify-between mx-2">
        <h2 className="text-lg font-semibold">Tasks Viewer</h2>
        <CreateDialog />
      </div>
      <TasksView />
    </div>
  );
}
