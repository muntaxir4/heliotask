import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { prisma } from '../../db';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status?: 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDateTime?: Date;
  createdAt: Date;
}

@Injectable()
export class UserService {
  async getUser(userId: string) {
    try {
      const user = await prisma.user.findFirst({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      });
      if (!user) throw new BadRequestException('User not found');
      return { message: 'Request Successful', user };
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async createTask(body: any) {
    try {
      let { title, description, status, priority, dueDateTime }: Task = body;
      if (!title) throw new BadRequestException('Title is required');
      description = description?.length ? description : null;
      status = status?.length ? status : 'TO_DO';
      priority = priority?.length ? priority : 'LOW';
      // Convert local time string to UTC date object
      const dueDateUTC = dueDateTime ? new Date(dueDateTime) : null;

      const task = await prisma.task.create({
        data: {
          title,
          description,
          status,
          priority,
          dueDate: dueDateUTC,
          user: { connect: { id: body.userId } },
        },
      });
      return { message: 'Task created successfully', task };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async listTasksForStatus(userId: string, status: Task['status']) {
    try {
      if (!status) throw new BadRequestException('Status is required');
      const statusTasks = await prisma.task.findMany({
        where: { userId: userId, status: status },
      });
      return { message: 'Request Successful', statusTasks };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async changeTaskStatus(taskId: string, status: Task['status']) {
    try {
      if (!status) throw new BadRequestException('Task ID and status required');
      const task = await prisma.task.update({
        where: { id: taskId },
        data: { status },
      });
      return { message: 'Task status updated', task };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async filterTasks(reqBody: any) {
    try {
      const {
        page = 1,
        status,
        priority,
        dueDateRange,
        sortBy,
      }: {
        page: number;
        status: Task['status'][] | undefined;
        priority: Task['priority'][] | undefined;
        dueDateRange: { from: number; to: number } | undefined;
        sortBy:
          | 'priority_asc'
          | 'priority_desc'
          | 'status_asc'
          | 'status_desc'
          | undefined;
      } = reqBody;
      const tasks = await prisma.task.findMany({
        where: {
          userId: reqBody.userId,
          status: { in: status },
          priority: { in: priority },
          OR: [
            {
              dueDate: {
                gte: dueDateRange?.from
                  ? new Date(dueDateRange.from)
                  : undefined,
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
        orderBy: { createdAt: 'desc' },
      });

      // Custom sorting
      if (sortBy && sortBy.includes('status')) {
        const statusOrder = ['TO_DO', 'IN_PROGRESS', 'COMPLETED'];
        const sign = sortBy.includes('asc') ? 1 : -1;
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
      } else if (sortBy && sortBy.includes('priority')) {
        const priorityOrder = ['LOW', 'MEDIUM', 'HIGH'];
        const sign = sortBy.includes('asc') ? 1 : -1;
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
      } else if (sortBy && sortBy.includes('dueDate')) {
        const sign = sortBy.includes('asc') ? 1 : -1;
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

      return { message: 'Request Successful', tasks };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async updateTask(reqBody: any) {
    try {
      const { taskId, title, description, status, priority, dueDateTime } =
        reqBody;
      if (!taskId) throw new BadRequestException('Task ID is required');
      const task = await prisma.task.update({
        where: { id: taskId },
        data: {
          title,
          description,
          status,
          priority,
          dueDate: dueDateTime ? new Date(dueDateTime) : null,
        },
      });
      return { message: 'Task updated successfully', task };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteTask(taskId: string) {
    try {
      if (!taskId) throw new BadRequestException('Task ID is required');
      await prisma.task.delete({
        where: { id: taskId },
      });
      return { message: 'Task deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
