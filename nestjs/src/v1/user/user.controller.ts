import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Body('userId') userId: string) {
    return await this.userService.getUser(userId);
  }

  @Post('/create-task')
  async createTask(@Body() body) {
    return await this.userService.createTask(body);
  }

  @Get('/tasks')
  async listTasksForStatus(@Body('userId') userId, @Query('status') status) {
    return await this.userService.listTasksForStatus(userId, status);
  }

  @Post('/change-task-status')
  async changeTaskStatus(@Body('taskId') taskId, @Body('status') status) {
    return await this.userService.changeTaskStatus(taskId, status);
  }

  @Post('/tasks')
  async filterTasks(@Body() reqBody) {
    return await this.userService.filterTasks(reqBody);
  }

  @Put('/update-task')
  async updateTask(@Body() body) {
    return await this.userService.updateTask(body);
  }

  @Delete('/delete-task')
  async deleteTask(@Query('taskId') taskId) {
    return await this.userService.deleteTask(taskId);
  }
}
