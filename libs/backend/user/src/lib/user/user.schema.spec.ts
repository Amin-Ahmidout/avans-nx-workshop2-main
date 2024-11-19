import { Test } from '@nestjs/testing';

import { Model, disconnect } from 'mongoose';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { validate, version } from 'uuid';

import { User, UserDocument, UserSchema } from "./user.schema";

describe('User Schema', () => {
  let mongod: MongoMemoryServer;
  let userModel: Model<UserDocument>;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            return {uri};
          },
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
      ],
    }).compile();

    userModel = app.get<Model<UserDocument>>(getModelToken(User.name));

    // not entirely sure why we need to wait for this...
    // https://github.com/nodkz/mongodb-memory-server/issues/102
    await userModel.ensureIndexes();
  });

  afterAll(async () => {
    await disconnect();
    await mongod.stop();
  });

  it('has a default uuid v4 as id', () => {
    const model = new userModel();

    expect(validate(model.id)).toBeTruthy();
    expect(version(model.id)).toBe(4);
  });

  it('has a required username', () => {
    const model = new userModel();

    const err = model.validateSync();

    expect(err.errors.name).toBeInstanceOf(Error);
  });

  it('has a unique username', async () => {
    const original = new userModel({name: 'henk', emailAddress: 'henk@henk.nl'});
    const duplicate = new userModel({name: 'henk', emailAddress: 'henk@henk.nl'});

    await original.save();

    await expect(duplicate.save()).rejects.toThrow();
  });

  it('has an empty role list by default', () => {
    const model = new userModel();

    expect(model.roles).toStrictEqual([]);
  });

  it('is active by default', () => {
    const model = new userModel();

    expect(model.isActive).toBe(true);
  });

  it('has a required email address', () => {
    const model = new userModel();

    const err = model.validateSync();

    expect(err.errors.emailAddress).toBeInstanceOf(Error);
  });

  it('does not accept an invalid email address', () => {
    const model = new userModel({emailAddress: 'ditisgeenemail'});

    const err = model.validateSync();

    expect(err.errors.emailAddress).toBeInstanceOf(Error);
  });

  it('has an empty list as default tutor topics', () => {
    const model = new userModel();

    expect(model.tutorTopics).toStrictEqual([]);
  });

  it('has an empty list as default pupil topics', () => {
    const model = new userModel();

    expect(model.pupilTopics).toStrictEqual([]);
  });

  it('has an empty list as default meetups', () => {
    const model = new userModel();

    expect(model.meetups).toStrictEqual([]);
  });
});