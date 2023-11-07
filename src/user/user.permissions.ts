import { UserService } from "./user.service";
import {
  ActionType,
  OwnershipType,
  Permission,
  PermissionMap,
} from "../permissions";
import { getCurrentUser } from "../async-context";

type UserPermission = Permission<"user", ActionType, OwnershipType>;

type T1 = typeof UserService;

type T2 = UserService;

export const getUserPermissionsMap: PermissionMap<
  typeof UserService,
  "getUsers",
  "user",
  "read"
> = {
  "user_read:own": (filters) => {
    const currentUser = getCurrentUser();
    return [{ ...filters, id: currentUser.id }];
  },
  "user_read:organization": (filters) => {
    const currentUser = getCurrentUser();
    return [{ ...filters, organizationId: currentUser.organizationId }];
  },
  "user_read:*": (filters) => {
    return [filters];
  },
};

export const postUserPermissionsMap: PermissionMap<
  typeof UserService,
  "createUser",
  "user",
  "create"
> = {
  "user_create:own": (user) => {
    const currentUser = getCurrentUser();
    return [
      {
        ...user,
        id: currentUser.id,
        permissions: currentUser.permissions,
        organizationId: currentUser.organizationId,
      },
    ];
  },
  "user_create:organization": (user) => {
    const currentUser = getCurrentUser();
    return [
      {
        ...user,
        permissions: currentUser.permissions,
        organizationId: currentUser.organizationId,
      },
    ];
  },
  "user_create:*": (user) => {
    return [user];
  },
};
