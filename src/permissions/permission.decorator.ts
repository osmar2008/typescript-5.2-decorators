import { Permission } from "./index";
import { getCurrentUser } from "../async-context";

(Symbol as any).metadata ??= Symbol.for("Symbol.metadata");

const getMatchedPermissions = (
  requiredPermissions: Permission[]
): Permission[] => {
  const userPermissions = getCurrentUser().permissions;
  return requiredPermissions.filter((requiredPermission) =>
    userPermissions.includes(requiredPermission)
  );
};

export const PermissionGuard = <This, Args extends any[], Return>(
  requiredPermissions: Permission[]
) => {
  return function PermissionDecorator(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<
      This,
      (this: This, ...args: Args) => Return
    >
  ) {
    const methodName = String(context.name);

    return function (this: This, ...args: Args): ReturnType<typeof target> {
      const matchedPermissions = getMatchedPermissions(requiredPermissions);

      if (matchedPermissions.length === 0) {
        throw new Error("User does not have permission to perform this action");
      }

      return target.call(this, ...args);
    };
  };
};
