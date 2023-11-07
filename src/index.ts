import { users, UserService } from "./user/user.service";
import { runInContext } from "./async-context";
import { UserController } from "./user/user.controller";

declare global {
  interface SymbolConstructor {
    readonly metadata: unique symbol;
  }
}

const [ownAccess, organizationAccess, allAccess, noAccess] = users;

runInContext(organizationAccess, () => {
  const userController = new UserController(new UserService());
  console.log("before: ", userController.find());
  userController.find({ lastName: "Doe" });

  userController.create({
    organizationId: "b1c2d3e4-f5g6-4h5i-6j7k-8l9m0n1o2p3",
    firstName: "Nikita",
    lastName: "Kolmogorov",
    permissions: [],
  });

  console.log("after: ", userController.find());
});

export {};
