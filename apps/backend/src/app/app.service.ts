import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getData() {
    return "Hello, world!";
  }
}
