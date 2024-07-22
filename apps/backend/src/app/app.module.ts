import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/user.entity";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AuthGuard } from "./auth/auth.guard";
import { RolesGuard } from "./roles/roles.guard";
import { SharesModule } from "./shares/shares.module";
import { Share } from "./shares/share.entity";
import { S3Module } from "nestjs-s3";
import { FilesModule } from "./files/files.module";
import { File } from "./files/file.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, `.env`, `.env.local`]
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: "postgres",
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [User, Share, File],
        synchronize: true
      })
    }),
    S3Module.forRootAsync({
      useFactory: async () => ({
        config: {
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY
          },
          endpoint: process.env.S3_ENDPOINT,
          region: process.env.S3_REGION,
          forcePathStyle: true
        }
      })
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
    }
  ]
})
export class AppModule {}
