import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from './user.controller';

import { UserService } from './user.service';

describe('TopicController', () => {
  let app: TestingModule;
  let userController: UserController;
  let userService: UserService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ // mock the service, to avoid providing its dependencies
        provide: UserService,
        useValue: {
          getAll: jest.fn(),
          getOne: jest.fn(),
        },
      }],
    }).compile();

   userController = app.get<UserController>(UserController);
   userService = app.get<UserService>(UserService);
  });

  describe('getAll', () => {
    it('should call getAll on the service', async () => {
      const exampleUser = {
        id: 'id123',
        name: 'alexander',
        isActive: true,
        emailAddress: 'alexander@avans.nl',
        roles: [],
        meetups: [],
        tutorTopics: ["nosql"],
        pupilTopics: ["flying"],
        rating: 4,
      };

      const getAll = jest.spyOn(userService, 'getAll')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .mockImplementation(async () => [exampleUser]);

      const results = await userController.getAll();

      expect(getAll).toBeCalledTimes(1);
      expect(results).toHaveLength(1);
      expect(results[0]).toHaveProperty('id', exampleUser.id);
    });
  });

  describe('getOne & getSelf', () => {
    it('should call getOne on the service with id from parameter', async () => {
      const exampleUser = {
        id: 'id123',
        name: 'alexander',
        isActive: true,
        emailAddress: 'alexander@avans.nl',
        roles: [],
        meetups: [],
        tutorTopics: ["nosql"],
        pupilTopics: ["flying"],
        rating: 4,
        reviews: [{id: 'r123', text: 'Great help', rating: 4, pupil: 'id4321', tutor: 'id123', datetime: new Date()}],
      };

      const getOne = jest.spyOn(userService, 'getOne')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .mockImplementation(async () => exampleUser);

      const result = await userController.getOne(exampleUser.id);

      expect(getOne).toBeCalledTimes(1);
      expect(result).toHaveProperty('id', exampleUser.id);
    });
  });
});
