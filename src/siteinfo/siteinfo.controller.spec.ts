import { Test, TestingModule } from '@nestjs/testing';
import { SiteinfoController } from './siteinfo.controller';

describe('SiteinfoController', () => {
  let controller: SiteinfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiteinfoController],
    }).compile();

    controller = module.get<SiteinfoController>(SiteinfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
