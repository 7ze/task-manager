import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('validates and returns the user based on Jwt payload', async () => {
      const user = new User();
      user.username = 'mock_user';

      userRepository.findOne.mockResolvedValue(user);
      const result = await jwtStrategy.validate({ username: 'mock_user' });
      expect(userRepository.findOne).toBeCalledWith({ username: 'mock_user' });
      expect(result).toEqual(user);
    });

    it('throws an unauthorized exception when user is not found', () => {
      userRepository.findOne.mockResolvedValue(undefined);
      expect(jwtStrategy.validate({ username: 'mock_user' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
