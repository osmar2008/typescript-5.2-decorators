import { UserService } from "../user/user.service";
import { ActionType, PermissionMap, ResourceType } from "./index";
import { getArgModifierFunction } from "./index";
import { getCurrentUser } from "../async-context";
import { DecoratedMethod } from "../decorators/types";

export function AccessControl<
  ServiceClass extends new (...args: any) => any,
  MethodName extends keyof InstanceType<ServiceClass>,
  AccessResource extends ResourceType,
  AccessAction extends ActionType,
  Method extends DecoratedMethod<ServiceClass, MethodName> = DecoratedMethod<
    ServiceClass,
    MethodName
  >
>(
  resource: AccessResource,
  action: AccessAction,
  permissionsMap: PermissionMap<
    ServiceClass,
    MethodName,
    AccessResource,
    AccessAction
  >
) {
  const matchWithUserPermissions = getArgModifierFunction(permissionsMap);

  return function (
    target: Method,
    context: ClassMethodDecoratorContext<InstanceType<ServiceClass>, Method>
  ) {
    function replacementMethod(
      this: ServiceClass,
      ...args: Parameters<Method>
    ): ReturnType<Method> {
      const currentUser = getCurrentUser();

      const matchedPermission = matchWithUserPermissions(
        currentUser.permissions,
        resource,
        action
      );

      const modifiedArgs = matchedPermission(...args);

      return target.call(this, ...modifiedArgs);
    }

    return replacementMethod;
  };
}
