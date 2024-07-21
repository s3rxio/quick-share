import { Test, TestingModule } from "@nestjs/testing";
import { SharesController } from "./shares.controller";

describe("SharesController", () => {
  let controller: SharesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SharesController]
    }).compile();

    controller = module.get<SharesController>(SharesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
