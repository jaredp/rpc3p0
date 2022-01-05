# rpc3p0
Graphql without the boilerplate

# Setup

1. Clone the repo
2. `(cd client && yarn)`
3. `(cd server && yarn)`

# Running

```
(cd client && yarn start) && (cd server && yarn start)
```

# Push safety (schema checks)
Note: this is extremely janky

```
# Schema checks (Pushsafety)!
ts-node -T -e "import * as ps from './api-lib/pushsafety/check-pushsafety.ts'; ps.run_check()"

# To rebuild (fake a push):
./api-lib/pushsafety/mock-push-prod-for-types-demo.sh
```

# Playground (a-la Graphql Playground)
[http://localhost:9001/api/playground](http://localhost:9001/api/playground) (while running the server, obviously)

# Fragments example
[Typescript playground demoing fragments](https://www.typescriptlang.org/play?#code/LAKALgngDgpgBAVwQSwCZwLxwM5gE7IB2A5gNyihFgx4BmAhgMbwAKN2A9oXAN6hwDEKVAC4c+ImX6DGeGPWqoA+grG4CJciGkDayPLgBy9ALYw1EzTrgAbekdPnxGqSEFwARvrAALVAqdCBBMPGi1rWgIYQlRsMSQ0AG0AXS0AXwoQewhCRjhaBFywZC44NgMuJT0YgEEbGwAKBNiLFxSASjEWPA4TZGwYAB5yzkIUgD5eazkwBDxuFPTM7Nz8wsZi0pGuYzMAMTx6YjNCMAbaLvYudqm3QRm57j479119BzMxWgA6PQMwXYwAA01ncdg+Th+4IBjhBLzgGRAiNAKzyBSKJW420IACFvH56BAWPQ8JADkcTmcLmUroQbs93A95rdXoIvKSCdQvt92b5-NQ4azdFEYnE4PQAO70ZBgMo9PoDb70eoNBqS6Wy7FVIioOqNH6RZDRWLtdrfEz0KBq7A5NEi9AYSYNBlC9zNL7277NQWuwTff3qmU0iqEQHk47RKn29qgwRpU0x+FpJbaLI21bojaYuAAYV6UA4hVQew4HHDlPOlxD9OmMFmzJdrP9SqlQexYcOEdO53aPtZ7vyXuEfdezcDmtpeI5-iJJLJnYrtET7mToERQA)

# Benefits
1. DevX
    1. Cuts 99% of boilerplate!
    2. Co-locate endpoint definition with implementation!
    3. No codegen!
    4. Command click through a client side request to get to the implementation on the server! Command click on the definition to get call sites on the client!
2. Safety and correctness
    1. No type mismatches between Typescript and GraphQL representations! One types language!
    2. ACLs in the API schema
3. Performance
    1. no implicit InMemoryCache on the client to chew through a ton of user CPU
    2. Save 600ms of boot time parsing GraphQL queries; XX kB of bundle size
4. Architecture
    1. unused functions = unused APIs
    2. Tighter coupling between client and server
    3. More flexibility in the future. Codegen is rough on composability, where function calls are great at it. It’s easy to see how this supports route factories, which unlocks abstracting out common patterns for routes. I’m excited for example about CRUD and pagination, which are currently difficult in our system, and have some opportunities to be implemented in an abstract, reusable, composable way on top of this system. This part’s definitely the most nebulous and what-my-gut is telling me, but the code feels really good.
    
    
# Limitations
1. Federation: this forces you to be explicit about which code’s running where. There’s a little extra work for the frontend to know which microservice to send a call to, though it should be all infra and transparent in the code. Graph stitching isn’t free anymore: you have to explicitly make calls to other servers. I suspect that’s good though, because not knowing you’re making a bunch of inter-server requests is a great way to spike p50 latencies. So that’s the fair answer: federation adds some wrinkles and forces you to be explicit about where you’re using the network. You know I’m personally anti-microservices for our tech needs, so to me this is pushing in the right direction, but separating those issues, this can be more or less at par with GraphQL.
2. Cross-language support: We apparently have some GraphQL consumers in Go. Out-of-the-box GQL support is definitely an advantage of Go; we’d need to look for low-lift solutions here. Easiest option: we’re already by default exporting a REST API with great documentation, it just doesn’t have typechecking. Hardest option (with equal or better than GQL results): use [https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API) to write a ts-to-go JSON type codegen. We benefit from the types on the wire being all JSON anyway.
3. Enums: when sharing enum definitions across client and server, how is the client going to get `MyEnum.foo`? It can use `"foo"`, but then you don't get nice command+click, or the source files being linked by import statements. We can move the enum declarations to a `shared-types/` module, but then they're not colocated. Possibly using TS everywhere makes it easier to move more into `shared-types/` overall, which would be great. Similarly for using Typeorm classes as input types, are we going to have to re-type them in zod?
4. Prettier formats the server side pretty ugly. Not a dealbreaker, but annoying.


# Future work needed
1. Boot time assert that no two endpoints have the same name 
2. lint rule to enforce that an RPC function is `export`ed with the same name as the API name. (Or find some better way to not duplicate it. Like auto-import, which also removes the need for a bunch of `index.ts` files.)
3. Playground: send requests like a schema-aware Postman.
4. Pushsafety: check each param type separately, and the return type separately. This will give more detailed information (since tsc's type mismatch error message bails after the first conflict or two), and better error messages. We can do this by stubbing `function check_param${i}_${endpoint}(old_param: Parameters<typeof OLD_${endpoint}>[0]["${param}"]): Parameters<typeof NEW_${endpoint}>[0]["${param}"] {`. We can get the params list by `Object.keys(inputValidator({})._def.shape())`. Same idea for return types, but obviously consider co/contravariance.
5. Webpack has some issues with re-type-checking when the server code changes. I think it’s caching the server code because it’s outside `src/`. VSCode gets this right beautifully, so it's definitely possible. It's also possible we want to turn off webpack's TS typechecking alltogether, and run a single `tsc -w --noEmit` instance monitoring the entire monorepo (client and server) together.
6. syntax: rid of explicit `z.strictObject`
7. Pushsafety could use [https://github.com/microsoft/TypeScript-Website/tree/v2/packages/typescript-vfs](https://github.com/microsoft/TypeScript-Website/tree/v2/packages/typescript-vfs) to not have to touch disk or litter the filesystem. See [https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API) as well, which may have more directly useful APIs
8. Consider [https://typedoc.org/](https://typedoc.org/) for the playground. On the other hand, “browsing” the API should be discouraged because we want tight coupling of client and server.
