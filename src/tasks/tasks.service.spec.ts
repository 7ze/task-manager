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
      const mockTasks = [
        { title: 'foo', description: 'bar' },
        { title: 'bar', description: 'baz' },
      ];
      taskRepository.getTasks.mockResolvedValue(mockTasks);

      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const getTasksfilterDto: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'some_query',
      };

      const result = await tasksService.getTasks(getTasksfilterDto, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });
  });

  describe('getTaskById', () => {
    it('calls taskRepository.findOne() and successfully retrieves and returns the task', async () => {
      const mockTask = {
        title: 'test',
        description: 'test',
      };
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
    });

    it('throws an error when task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('creates a new task', async () => {
      const expectedResult = {
        title: 'test',
        description: 'test',
        status: TaskStatus.OPEN,
        user: mockUser,
      };
      taskRepository.createTask.mockResolvedValue(expectedResult);

      const createTaskDto: CreateTaskDto = {
        title: 'test',
        description: 'test',
      };

      expect(taskRepository.createTask).not.toHaveBeenCalled();
      const task = await tasksService.createTask(createTaskDto, mockUser);
      expect(task).toEqual(expectedResult);
    });
  });
});
