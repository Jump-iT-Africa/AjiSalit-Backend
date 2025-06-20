import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.schema';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<UserDocument>;

  // Mock saved user data
  const mockSavedUser = {
    _id: 'someId',
    name: 'Test User',
    phoneNumber: '+212697042868',
    role: 'client',
    password: 'hashedPassword',
    isVerified: false,
    otp: '123456',
    otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    save: jest.fn().mockResolvedValue(true)
  };

  beforeEach(async () => {
    class MockUserModel {
      constructor(private data: any) {
        Object.assign(this, data);
      }
      save = jest.fn().mockResolvedValue(mockSavedUser);
      static findOne = jest.fn();
      static deleteOne = jest.fn();
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.Fname),
          useValue: MockUserModel
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.Fname));

    jest.spyOn(service as any, 'sendSMS').mockImplementation(() => Promise.resolve());
    
    process.env.JWT_SECRET = 'test-secret-key';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      name: 'Test User',
      phoneNumber: '+212697042868',
      password: 'testPassword',
      role: 'client',
      city: "ait ourir",
      field: "Masbana",
      ice: "12345678910123",
      refBy: "E1381FB0"
    };

    it('should successfully register a new user', async () => {
      // Mock findOne to return null (no existing user)
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      } as any);

      // Mock bcrypt hash
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      const result = await service.register(registerDto);

      expect(result).toEqual({
        message: 'OTP sent successfully',
        userId: expect.any(String)
      });
      expect(service['sendSMS']).toHaveBeenCalled();
    });

    it('should throw BadRequestException if phone number already exists', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockSavedUser)
      } as any);

      await expect(service.register(registerDto))
        .rejects
        .toThrow(BadRequestException);
      await expect(service.register(registerDto))
        .rejects
        .toThrow('هاد الرقم مستعمل من قبل جرب رقم أخر');
    });

    it('should throw BadRequestException if SMS sending fails', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      } as any);

      jest.spyOn(service as any, 'sendSMS').mockRejectedValue(new Error('SMS failed'));

      await expect(service.register(registerDto))
        .rejects
        .toThrow(BadRequestException);
      await expect(service.register(registerDto))
        .rejects
        .toThrow('Failed to send OTP');
    });
  });

 

  describe('login', () => {
    const loginDto = {
      phoneNumber: '+212697042868',
      password: 'testPassword'
    };

    it('should successfully login a verified user', async () => {
      const hashedPassword = await bcrypt.hash(loginDto.password, 10);
      const mockVerifiedUser = {
        _id: 'someId',
        phoneNumber: loginDto.phoneNumber,
        password: hashedPassword,
        isVerified: true,
        role: 'client'
      };

      jest.spyOn(userModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockVerifiedUser)
      } as any);

      // Mock bcrypt.compare to return true for the correct password
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      jest.spyOn(jwt, 'sign').mockImplementation(() => 'mocked-token');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        message: 'Login successful',
        User: mockVerifiedUser,
        token: 'mocked-token'
      });
    });

    it('should throw BadRequestException for non-existent user', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      } as any);

      await expect(service.login(loginDto))
        .rejects
        .toThrow(new BadRequestException('This User Does not exists'));
    });

    it('should throw BadRequestException for unverified user', async () => {
      const mockUnverifiedUser = {
        _id: 'someId',
        phoneNumber: loginDto.phoneNumber,
        password: await bcrypt.hash(loginDto.password, 10),
        isVerified: false,
        role: 'client'
      };

      jest.spyOn(userModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUnverifiedUser)
      } as any);

      await expect(service.login(loginDto))
        .rejects
        .toThrow(new BadRequestException('Phone number not verified'));
    });

    it('should throw BadRequestException for incorrect password', async () => {
  const mockUser = {
    _id: 'someId',
    phoneNumber: loginDto.phoneNumber,
    password: await bcrypt.hash('differentPassword', 10),
    isVerified: true,
    role: 'client',
  };

  jest.spyOn(userModel, 'findOne').mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockUser),
  } as any);

  await expect(service.login(loginDto)).rejects.toThrowError(BadRequestException);
  await expect(service.login(loginDto)).rejects.toThrow('Password incorrect');
});

  });
});