import { Router, json } from "express";
import { prisma } from "../db";
import Authenticate from "../auth/Authenticate";
import cookieParser from "cookie-parser";

const user = Router();

user.use(json());
user.use(cookieParser());
user.use(Authenticate);

user.get("/", async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: req.body.userId },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Request Successful", user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

user.post("/create-task", async (req, res) => {
  try {
    let { title, description, status, priority, dueDateTime } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    description = description?.length ? description : null;
    status = status?.length ? status : "TO_DO";
    priority = priority?.length ? priority : "LOW";
    // Convert local time string to UTC date object
    const dueDateUTC = dueDateTime ? new Date(dueDateTime) : null;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDateUTC,
        user: { connect: { id: req.body.userId } },
      },
    });
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

user.get("/tasks", async (req, res) => {
  try {
    //@ts-ignore
    const {
      status,
    }: { status: undefined | "TO_DO" | "IN_PROGRESS" | "COMPLETED" } =
      req.query;
    if (!status) return res.status(400).json({ message: "Status is required" });
    const statusTasks = await prisma.task.findMany({
      where: { userId: req.body.userId, status: status },
    });
    return res.status(200).json({ message: "Request Successful", statusTasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

user.post("/change-task-status", async (req, res) => {
  try {
    const { taskId, status } = req.body;
    if (!taskId || !status)
      return res.status(400).json({ message: "Task ID and status required" });
    const task = await prisma.task.update({
      where: { id: taskId, userId: req.body.userId },
      data: { status },
    });
    res.status(200).json({ message: "Task status updated", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

user.post("/tasks", async (req, res) => {
  try {
    const {
      page = 1,
      status,
      priority,
      dueDateRange,
      sortBy,
    }: {
      page: number;
      status: ("TO_DO" | "IN_PROGRESS" | "COMPLETED")[] | undefined;
      priority: ("LOW" | "MEDIUM" | "HIGH")[] | undefined;
      dueDateRange: { from: number; to: number } | undefined;
      sortBy:
        | "priority_asc"
        | "priority_desc"
        | "status_asc"
        | "status_desc"
        | undefined;
    } = req.body;
    const tasks = await prisma.task.findMany({
      where: {
        userId: req.body.userId,
        status: { in: status },
        priority: { in: priority },
        OR: [
          {
            dueDate: {
              gte: dueDateRange?.from ? new Date(dueDateRange.from) : undefined,
              lte: dueDateRange?.to ? new Date(dueDateRange.to) : undefined,
            },
          },
          {
            dueDate: null,
          },
        ],
      },
      skip: (Number(page) - 1) * 10,
      // take: 10,
      orderBy: { createdAt: "desc" },
    });

    // Custom sorting
    if (sortBy && sortBy.includes("status")) {
      const statusOrder = ["TO_DO", "IN_PROGRESS", "COMPLETED"];
      const sign = sortBy.includes("asc") ? 1 : -1;
      tasks.sort((a, b) => {
        const statusComparison =
          sign *
          (statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
        if (statusComparison !== 0) return statusComparison;
        return (
          sign *
          (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        );
      });
    } else if (sortBy && sortBy.includes("priority")) {
      const priorityOrder = ["LOW", "MEDIUM", "HIGH"];
      const sign = sortBy.includes("asc") ? 1 : -1;
      tasks.sort((a, b) => {
        const priorityComparison =
          sign *
          (priorityOrder.indexOf(a.priority) -
            priorityOrder.indexOf(b.priority));
        if (priorityComparison !== 0) return priorityComparison;
        return (
          sign *
          (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        );
      });
    } else if (sortBy && sortBy.includes("dueDate")) {
      const sign = sortBy.includes("asc") ? 1 : -1;
      tasks.sort((a, b) => {
        if (a.dueDate && b.dueDate) {
          return sign * (a.dueDate.getTime() - b.dueDate.getTime());
        } else if (a.dueDate) {
          return -1;
        } else if (b.dueDate) {
          return 1;
        }
        return (
          sign *
          (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        );
      });
    }

    res.status(200).json({ message: "Request Successful", tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

user.put("/update-task", async (req, res) => {
  try {
    const {
      userId,
      taskId,
      title,
      description,
      status,
      priority,
      dueDateTime,
    } = req.body;
    if (!taskId)
      return res.status(400).json({ message: "Task ID is required" });
    const task = await prisma.task.update({
      where: { id: taskId, userId },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDateTime ? new Date(dueDateTime) : null,
      },
    });
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

user.delete("/delete-task", async (req, res) => {
  try {
    const { taskId } = req.query;
    if (!taskId)
      return res.status(400).json({ message: "Task ID is required" });
    await prisma.task.delete({
      where: { id: taskId as string, userId: req.body.userId },
    });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default user;
