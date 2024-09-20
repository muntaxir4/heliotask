import { Task } from "@/components/types";

export default function TaskCard({ item }: { item: Task }) {
  return (
    <div className="border p-2 m-2 rounded-lg shadow-lg">
      <p className="font-semibold">{item.title}</p>
      <p>{item.description}</p>
      <p>{item.status}</p>
      <p>{item.priority}</p>
      <p>{item.dueDate}</p>
    </div>
  );
}
