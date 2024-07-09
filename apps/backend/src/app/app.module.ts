import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, `.env`, `.env.local`]
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
