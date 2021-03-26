import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = new User();

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      const ListOftasks = 'list_of_tasks';
      taskRepository.getTasks.mockResolvedValue(ListOftasks);
      const getTasksfilterDto: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'some_query',
      };

      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const result = await tasksService.getTasks(getTasksfilterDto, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual(ListOftasks);
    });
  });

  describe('getTaskById', () => {
    it('calls taskRepository.findOne() and successfully retrieves and returns the task', async () => {
      const task = 'mock_task';
      taskRepository.findOne.mockResolvedValue(task);

      const result = await tasksService.getTaskById(1, mockUser);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
      expect(result).toEqual(task);
    });

    it('throws a NotFoundException error when task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    const createdTask = 'created_task';
    it('creates a new task', async () => {
      taskRepository.createTask.mockResolvedValue(createdTask);
      const createTaskDto: CreateTaskDto = {
        title: 'test',
        description: 'test',
      };

      expect(taskRepository.createTask).not.toHaveBeenCalled();
      const result = await tasksService.createTask(createTaskDto, mockUser);
      expect(taskRepository.createTask).toHaveBeenCalledWith(
        createTaskDto,
        mockUser,
      );
      expect(result).toEqual(createdTask);
    });
  });

  describe('updateTask', () => {
    it('updates task status', async () => {
      const save = jest.fn().mockResolvedValue(true);
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        save,
        status: TaskStatus.OPEN,
      });

      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      const result = await tasksService.updateTask(
        1,
        TaskStatus.DONE,
        mockUser,
      );

      expect(tasksService.getTaskById).toHaveBeenCalledWith(1, mockUser);
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });

  describe('deleteTask', () => {
    it('call taskRepository.delete() to delete a task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });

      expect(taskRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteTask(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });

    it('throws a NotFoundException error when task is not found', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });

      expect(taskRepository.delete).not.toHaveBeenCalled();
      expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
