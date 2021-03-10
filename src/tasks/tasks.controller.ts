import { Controller } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // @Post()
  // @UsePipes(ValidationPipe)
  // createTask(@Body() createTaskDto: CreateTaskDto): Task {
  //   return this.tasksService.createTask(createTaskDto);
  // }

  // @Get()
  // getTasks(@Query(ValidationPipe) filterTasksDto: GetTasksFilterDto): Task[] {
  //   if (Object.keys(filterTasksDto).length) {
  //     return this.tasksService.getTasksWithFilter(filterTasksDto);
  //   } else {
  //     return this.tasksService.getAllTasks();
  //   }
  // }

  // @Get(':id')
  // getTaskById(@Param('id') id: string): Task {
  //   return this.tasksService.getTaskById(id);
  // }

  // @Patch(':id/status')
  // updateTaskStatus(
  //   @Param('id') id: string,
  //   @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  // ): Task {
  //   return this.tasksService.updateTask(id, status);
  // }

  // @Delete(':id')
  // @HttpCode(204)
  // deleteTask(@Param('id') id: string): void {
  //   this.tasksService.deleteTask(id);
  // }
}
