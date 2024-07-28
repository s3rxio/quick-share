import { Test, TestingModule } from "@nestjs/testing";
import { UsersMeController } from "./users-me.controller";

describe("UsersMeController", () => {
  let controller: UsersMeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersMeController]
    }).compile();

    controller = module.get<UsersMeController>(UsersMeController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
