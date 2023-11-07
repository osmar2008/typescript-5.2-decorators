export type DecoratedMethodArgs<
    T extends abstract new (...args: any) => any,
    Key extends keyof InstanceType<T>
> = InstanceType<T>[Key] extends (...args: infer Args) => any ? Args : never;

export type DecoratedMethod<
    T extends abstract new (...args: any) => any,
    Key extends keyof InstanceType<T>
> = InstanceType<T>[Key] extends (...args: any) => any ? InstanceType<T>[Key] : never;