import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AuthGuard } from "./auth/auth.guard";
import { RolesGuard } from "./roles/roles.guard";
import { SharesModule } from "./shares/shares.module";
import { S3Module } from "nestjs-s3";
import { FilesModule } from "./files/files.module";
import { getConfig } from "./config";
import { DbConfig, S3Config } from "@backend/common/types";
import { ResponseInterceptor } from "@backend/common/interceptors";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, `.env`, `.env.local`],
      load: [getConfig],
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get<DbConfig>("db"),
      inject: [ConfigService]
    }),
    S3Module.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        config: configService.get<S3Config>("s3")
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    AuthModule,
    SharesModule,
    FilesModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Guards
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },

    // Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }
  ]
})
export class AppModule {}
