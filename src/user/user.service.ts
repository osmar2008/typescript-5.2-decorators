import { randomUUID } from "node:crypto";
import { logger } from "../decorators/logger.decorator";
import { Permission } from "../permissions";
import { AccessControl } from "../permissions/access-control.decorator";
import {
  getUserPermissionsMap,
  postUserPermissionsMap,
} from "./user.permissions";

export type User = {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  permissions: Permission[];
};

export const users: User[] = [
  {
    id: "d9c8a7b5-8d6b-4c3e-9f4a-7e0c9e7d6f1a",
    organizationId: "b1c2d3e4-f5g6-4h5i-6j7k-8l9m0n1o2p3",
    firstName: "John",
    lastName: "Doe",
    permissions: ["user_read:own"],
  },
  {
    id: "e5f6g7h8-9i1j-2k3l-4m5n-6o7p8q9r0s1",
    organizationId: "b1c2d3e4-f5g6-4h5i-6j7k-8l9m0n1o2p3",
    firstName: "Jane",
    lastName: "Doe",
    permissions: ["user_read:organization", "user_create:organization"],
  },
  {
    id: "1a2b3c4d-5e6f-7g8h-9i1j-2k3l4m5n6o7",
    organizationId: "c2d3e4f5-g6h7-8i9j-1k2l-3m4n5o6p7q",
    firstName: "Bob",
    lastName: "Smith",
    permissions: ["user_read:*", "user_create:*"],
  },
  {
    id: "8p9q0r1s-2t3u-4v5w-6x7y-8z9a0b1c2d3",
    organizationId: "c2d3e4f5-g6h7-8i9j-1k2l-3m4n5o6p7q",
    firstName: "Alice",
    lastName: "Doe",
    permissions: [],
  },
];

export class UserService {
  @AccessControl("user", "read", getUserPermissionsMap)
  getUsers(filters?: Partial<User>): User[] {
    if (!filters) {
      return users;
    }

    return users.filter((user) => {
      return Object.keys(filters).every((key) => {
        return user[key as keyof User] === filters[key as keyof User];
      });
    });
  }

  @AccessControl("user", "create", postUserPermissionsMap)
  createUser(user: Omit<User, "id">): User {
    const newUser = { id: randomUUID(), ...user };

    users.push(newUser);
    return newUser;
  }
}
