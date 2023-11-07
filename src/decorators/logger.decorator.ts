import {UserService} from "../user/user.service";

export function logger<
    This extends InstanceType<typeof UserService>,
    Args extends any[],
    Return
>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<
        This,
        (this: This, ...args: Args) => Return
    >
) {
    const methodName = String(context.name);



    function replacementMethod(this: This, ...args: Args) {
        console.log(this)
        const result = target.call(this, ...args);
        console.log(
            `LOG: Method '${methodName}' called with args: ${JSON.stringify(
                args,
                null,
                2
            )}`
        );
        console.log(
            `LOG: Method '${methodName}' returned: ${JSON.stringify(result, null, 2)}`
        );
        return result;
    }

    return replacementMethod;
}