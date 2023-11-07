import {AsyncLocalStorage} from "node:async_hooks";
import type {User} from "../user/user.service";

const asyncLocalStorage = new AsyncLocalStorage<User>();

export function getCurrentUser(): User {
    const currentUser = asyncLocalStorage.getStore();

    if (!currentUser) {
        throw new Error("No user in the current context");
    }

    return currentUser;
}

export function runInContext(user: User, callback: () => any) {
    asyncLocalStorage.run(user, callback)
}