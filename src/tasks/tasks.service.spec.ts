import { Test } from '@nestjs/testing';
import { User } from 'src/auth/user.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = new User();

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
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
      taskRepository.getTasks.mockResolvedValue('some_value');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const getTasksfilterDto: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'query',
      };

      const result = await tasksService.getTasks(getTasksfilterDto, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('some_value');
    });
  });
});
