import { Test, TestingModule } from "@nestjs/testing";
import { SharesService } from "./shares.service";

describe("SharesService", () => {
  let service: SharesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharesService]
    }).compile();

    service = module.get<SharesService>(SharesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
