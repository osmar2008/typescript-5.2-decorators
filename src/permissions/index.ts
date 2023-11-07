import { DecoratedMethod, DecoratedMethodArgs } from "../decorators/types";

export type Role = "admin" | "user";
export const Resources = ["location", "service", "user"] as const;
export type ResourceType = (typeof Resources)[number];
export const Actions = ["read", "create", "update", "delete"] as const;
export type ActionType = (typeof Actions)[number];
export const Ownership = ["own", "organization", "*"] as const;
export type OwnershipType = (typeof Ownership)[number];

export type Permission<
  ThisResource extends ResourceType = ResourceType,
  ThisAction extends ActionType = ActionType,
  ThisOwnership extends OwnershipType = OwnershipType
> = `${ThisResource}_${ThisAction}:${ThisOwnership}`;

export type PermissionMap<
  ServiceClass extends new (...args: any) => any,
  MethodName extends keyof InstanceType<ServiceClass>,
  ThisResource extends ResourceType = ResourceType,
  ThisAction extends ActionType = ActionType,
  Method extends DecoratedMethod<ServiceClass, MethodName> = DecoratedMethod<
    ServiceClass,
    MethodName
  >
> = Record<
  Permission<ThisResource, ThisAction>,
  (...args: Parameters<Method>) => Parameters<Method>
>;

export const getPermissionValues = <
  ThisResource extends ResourceType,
  ThisAction extends ActionType,
  ThisOwnership extends OwnershipType
>(
  permission: Permission<ThisResource, ThisAction, ThisOwnership>
) => {
  const [resource, actionOwnership] = permission.split("_");
  const [action, ownership] = actionOwnership.split(":");
  return { resource, action, ownership };
};

export function filterCompatiblePermissions<
  ThisResource extends ResourceType,
  ThisAction extends ActionType
>(
  permissions: Permission[],
  resource: ThisResource,
  action: ThisAction
): Permission<ThisResource, ThisAction>[] {
  return permissions.filter((permission) => {
    const { resource: permissionResource, action: permissionAction } =
      getPermissionValues(permission);

    return (
      (permissionResource === resource || permissionResource === "*") &&
      (permissionAction === action || permissionAction === "*")
    );
  }) as Permission<ThisResource, ThisAction>[];
}

export const getArgModifierFunction =
  <
    T extends new (...args: any) => any,
    Key extends keyof InstanceType<T>,
    ThisResource extends ResourceType = ResourceType,
    ThisAction extends ActionType = ActionType
  >(
    allowedPermissions: PermissionMap<T, Key, ThisResource, ThisAction>
  ) =>
  (
    userPermissions: Permission[],
    resource: ThisResource,
    action: ThisAction
  ): (typeof allowedPermissions)[keyof typeof allowedPermissions] => {
    const permissionsOnMap = Object.keys(
      allowedPermissions
    ) as unknown as keyof typeof allowedPermissions;

    const compatiblePermissions = filterCompatiblePermissions(
      userPermissions,
      resource,
      action
    );

    const matchedPermission = compatiblePermissions.find((userPermission) =>
      permissionsOnMap.includes(userPermission)
    );

    if (!matchedPermission) {
      throw new Error("You don't have permission to perform this action");
    }

    return allowedPermissions[matchedPermission];
  };
