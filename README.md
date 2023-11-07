## Permission system architecture POC

Simulating a barebones webserver, to highlight the architecture without nestjs additions

Check this line of code in `src/index.ts`:

```typescript
const [ownAccess, organizationAccess, allAccess, noAccess] = users;
```

Each user has a diferent access level for creating/reading from /users

modify the user accessing the resource, changing it here:

```typescript
runInContext(organizationAccess, () => {...})
```

Run the example with `yarn ts-node-esm src/index.ts` and check the results.

//TODO: add explanation and more examples.
