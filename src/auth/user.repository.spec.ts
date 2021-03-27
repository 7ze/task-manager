import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DatabaseErrors } from 'src/utils/database-errors.enum';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';

const mockAuthCredentialsDto: AuthCredentialsDto = {
  username: 'mock_user',
  password: 'password',
};

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save: jest.Mock<any, any>;

    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('successfully signs up the user', () => {
      save.mockResolvedValue(true);
      expect(
        userRepository.signUp(mockAuthCredentialsDto),
      ).resolves.not.toThrow();
    });

    it('throws a conflict exception if username already exists', async () => {
      save.mockRejectedValue({ code: DatabaseErrors.CONFLICT });
      await expect(
        userRepository.signUp(mockAuthCredentialsDto),
      ).rejects.toThrow(ConflictException);
    });

    it('throws an internal server error exception on catching any other error', async () => {
      save.mockRejectedValue({ code: 'someother_error_code' });
      await expect(
        userRepository.signUp(mockAuthCredentialsDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
