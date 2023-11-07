import { User, UserService } from "./user.service";
import { PermissionGuard } from "../permissions/permission.decorator";

export class UserController {
  constructor(private readonly userService: UserService) {}
  @PermissionGuard(["user_read:*", "user_read:organization", "user_read:own"])
  find(queryParams?: Partial<User>): User[] {
    return this.userService.getUsers(queryParams);
  }

  @PermissionGuard(["user_create:*", "user_create:organization"])
  create(user: Omit<User, "id">): User {
    return this.userService.createUser(user);
  }
}
