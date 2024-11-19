import { Test } from '@nestjs/testing';

import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect, Model } from 'mongoose';
import { MongoClient } from 'mongodb';

import { UserService } from './user.service';
import { User, UserDocument, UserSchema } from './user.schema';
import { Meetup, MeetupDocument, MeetupSchema } from '../meetup/meetup.schema';

describe('UserService', () => {
  let service: UserService;
  let mongod: MongoMemoryServer;
  let mongoc: MongoClient;
  let userModel: Model<UserDocument>;
  let meetupModel: Model<MeetupDocument>;

  const testMeetups = [{
    topic: 'math',
    datetime: new Date(),
    review: {text: 'Great help! (1)', rating: 4},
    accepted: true,
  }, {
    topic: 'math',
    datetime: new Date(),
    review: {text: 'Great help! (2)', rating: 4},
    accepted: true,
  }, {
    topic: 'math',
    datetime: new Date(),
    review: {text: 'Great help! (3)', rating: 5},
    accepted: true,
  }, {
    topic: 'math',
    datetime: new Date(),
    accepted: true,
  }]

  const testUsers = [{
    id: 'jan123',
    name: 'jan',
    emailAddress: 'mail@address.com',
    tutorTopics: [],
    pupilTopics: [],
    meetups: [],
  }, {
    id: 'dion123',
    name: 'dion',
    emailAddress: 'mail@address.com',
    tutorTopics: [],
    pupilTopics: [],
    meetups: [],
  }, {
    id: 'davide123',
    name: 'davide',
    emailAddress: 'mail@address.com',
    tutorTopics: [],
    pupilTopics: [],
    meetups: [],
  }];
  
  beforeAll(async () => {
    let uri: string;
    
    const app = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            return {uri};
          },
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Meetup.name, schema: MeetupSchema }]),
      ],
      providers: [UserService],
    }).compile();

    service = app.get<UserService>(UserService);
    userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
    meetupModel = app.get<Model<MeetupDocument>>(getModelToken(Meetup.name));

    mongoc = new MongoClient(uri);
    await mongoc.connect();
  });

  beforeEach(async () => {
    await mongoc.db('test').collection('users').deleteMany({});
    await mongoc.db('test').collection('meetups').deleteMany({});

    const user1 = new userModel(testUsers[0]);
    const user2 = new userModel(testUsers[1]);
    const user3 = new userModel(testUsers[2]);

    const meetup1 = new meetupModel({
      ...testMeetups[0], 
      tutorRef: user1._id, 
      pupilRef: user2._id,
      tutor: {id: user1.id, name: user1.name},
      pupil: {id: user2.id, name: user2.name},
    });
    const meetup2 = new meetupModel({
      ...testMeetups[1], 
      tutorRef: user3._id, 
      pupilRef: user1._id,
      tutor: {id: user3.id, name: user3.name},
      pupil: {id: user1.id, name: user1.name},
    });
    const meetup3 = new meetupModel({
      ...testMeetups[2], 
      tutorRef: user1._id, 
      pupilRef: user2._id,
      tutor: {id: user1.id, name: user1.name},
      pupil: {id: user2.id, name: user2.name},
    });
    const meetup4 = new meetupModel({
      ...testMeetups[3], 
      tutorRef: user1._id, 
      pupilRef: user2._id,
      tutor: {id: user1.id, name: user3.name},
      pupil: {id: user2.id, name: user1.name},
    });

    user1.meetups.push(meetup1);
    user1.meetups.push(meetup2);
    user1.meetups.push(meetup3);
    user1.meetups.push(meetup4);
    user2.meetups.push(meetup1);
    user2.meetups.push(meetup3);
    user2.meetups.push(meetup4);
    user3.meetups.push(meetup2);

    await Promise.all([user1.save(), user2.save(), user3.save(), meetup1.save(), meetup2.save(), meetup3.save(), meetup4.save()]);
  });

  afterAll(async () => {
    await mongoc.close();
    await disconnect();
    await mongod.stop();
  });

  describe('getAll', () => {
    it('should retrieve all users', async () => {
      const results = await service.getAll();
  
      expect(results).toHaveLength(3);
      expect(results.map(r => r.name)).toContain('jan');
      expect(results.map(r => r.name)).toContain('dion');
      expect(results.map(r => r.name)).toContain('davide');
    });
    
    it('should not give meetups or reviews', async () => {
      const results = await service.getAll();

      expect(results[0]).not.toHaveProperty('meetups');
      expect(results[0]).not.toHaveProperty('reviews');
    });

    it('gives the average rating, id, name, topics', async () => {
      const results = await service.getAll();

      expect(results[0]).toHaveProperty('id');
      expect(results[0]).toHaveProperty('name');
      expect(results[0]).toHaveProperty('rating');
      expect(results[0]).toHaveProperty('tutorTopics');
      expect(results[0]).toHaveProperty('pupilTopics');
      expect(results.filter(u => u.name == 'jan')[0].rating).toBe(4.5);
    });
  });

  describe('getOne', () => {
    it('should retrieve a specific user', async () => {
      const result = await service.getOne('jan123');

      expect(result).toHaveProperty('name', 'jan');
    });
    
    it('returns null when user is not found', async () => {
      const result = await service.getOne('niemand');
      
      expect(result).toBeUndefined();
    });
    
    it('should not give meetups', async () => {
      const result = await service.getOne('jan123');
      
      expect(result).not.toHaveProperty('meetups');
    });
    
    it('gives the average rating', async () => {
      const result = await service.getOne('jan123');
      
      expect(result).toHaveProperty('rating', 4.5);
    });
    
    it('gives all reviews of this user', async () => {
      const result = await service.getOne('jan123');

      expect(result).toHaveProperty('reviews');
      expect(result.reviews).toHaveLength(2);
    });
  });
});
