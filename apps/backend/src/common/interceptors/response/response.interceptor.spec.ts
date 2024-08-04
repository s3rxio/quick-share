import { HttpStatus } from "@nestjs/common";
import { ResponseInterceptor } from "./response.interceptor";
import { PaginationResponse } from "@backend/common/dtos/pagination-response.dto";

describe("ResponseInterceptor", () => {
  const interceptor = new ResponseInterceptor();

  it("should be defined", () => {
    expect(new ResponseInterceptor()).toBeDefined();
  });

  it("should generate response", () => {
    expect(interceptor.generateResponse(HttpStatus.OK)).toEqual({
      message: "OK"
    });
  });

  it("should generate paginated response", () => {
    expect(
      interceptor.generateResponse(
        HttpStatus.OK,
        new PaginationResponse([1, 2, 3], 3)
      )
    ).toEqual({
      message: "OK",
      items: [1, 2, 3],
      total: 3
    });
  });

  it("should generate paginated response without total", () => {
    expect(
      interceptor.generateResponse(
        HttpStatus.OK,
        new PaginationResponse([1, 2, 3])
      )
    ).toEqual({
      message: "OK",
      items: [1, 2, 3],
      total: 3
    });
  });

  it("should generate respnose with string", () => {
    expect(interceptor.generateResponse(HttpStatus.OK, "test")).toEqual({
      message: "test"
    });
  });

  it("should generate response with number", () => {
    expect(interceptor.generateResponse(HttpStatus.OK, 2)).toEqual({
      message: "OK",
      data: 2
    });
  });

  it("should generate response with object", () => {
    expect(
      interceptor.generateResponse(HttpStatus.OK, { test: "test" })
    ).toEqual({
      message: "OK",
      data: { test: "test" }
    });
  });

  it("should generate response with array", () => {
    expect(interceptor.generateResponse(HttpStatus.OK, [1, 2, 3])).toEqual({
      message: "OK",
      data: [1, 2, 3]
    });
  });
});
