import { Test, TestingModule } from '@nestjs/testing';
import { SiteinfoService } from './siteinfo.service';

describe('SiteinfoService', () => {
  let service: SiteinfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SiteinfoService],
    }).compile();

    service = module.get<SiteinfoService>(SiteinfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
