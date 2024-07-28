import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Share } from "@/shares/share.entity";
import { UsersMeController } from "./users-me/users-me.controller";

@Module({
  providers: [UsersService],
  controllers: [UsersMeController, UsersController],
  imports: [TypeOrmModule.forFeature([User, Share])],
  exports: [UsersService, TypeOrmModule]
})
export class UsersModule {}
