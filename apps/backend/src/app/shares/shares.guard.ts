import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { SharesService } from "./shares.service";

@Injectable()
export class SharesGuard implements CanActivate {
  constructor(private readonly sharesService: SharesService) {}

  async canActivate(context: ExecutionContext) {
    const { user, params } = context.switchToHttp().getRequest();

    const share = await this.sharesService.findOneOrFail(params.id);

    return user.id === share.user.id;
  }
}
