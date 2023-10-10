# team-map

A map of all your team members

Installing dev containers took about 10 minutes

In the provided `imports` map from the `deno.json` file, there are several
conventions being used. Let's break them down:

1. **`$` Prefix**:
   - The `$` character is used as a custom namespace. It's a convention to avoid
     potential naming collisions with other modules. By using this, you're
     explicitly marking certain imports as special or distinct from regular
     package names.
   - For example, `$fresh/` and `$std/` are custom namespaces.

2. **`@` Prefix**:
   - The `@` character is often used in package names to denote scoped packages.
     This convention comes from the npm ecosystem, where organizations or users
     can have their own "namespace" under which they can publish multiple
     packages.
   - For example, `@preact/signals` is a package under the `preact` namespace.

3. **Trailing `/`**:
   - A trailing `/` in the import map key indicates that this is a namespace for
     a collection of modules, not just a single module.
   - For example, `"preact/": "https://esm.sh/preact@10.15.1/"` allows you to
     import any module within the `preact` package, like
     `import { h } from "preact/hooks"`.

4. **No Prefix**:
   - Regular package names without any `$` or `@` prefix are just standard
     package names.
   - For example, `preact` is a standard package name.

5. **Asterisk (*) in the URL**:
   - The asterisk (`*`) in the URL, like in
     `"preact-render-to-string": "https://esm.sh/*preact-render-to-string@6.2.1"`,
     is specific to `esm.sh` and it's a way to tell the CDN to load any exports
     from the package, not just the default export.

These conventions allow for a flexible and descriptive way to define how modules
are imported in a Deno application, ensuring clarity and avoiding potential
naming collisions.

Here's a summary of why we had to modify a local version of the Leaflet types:

1. **Import Resolution Issues in Deno**: Deno does not support Node.js-style
   module resolution. Instead, Deno requires full, explicit module paths,
   including the file extension. The original Leaflet type definitions from
   DefinitelyTyped were written for a Node.js environment and use implicit
   module specifiers, which are not compatible with Deno.

2. **GeoJSON Name Conflicts**: The Leaflet type definitions had naming
   conflicts, specifically with the `GeoJSON` name. This conflict arose because
   both Leaflet's type definitions and the standard TypeScript library define a
   type named `GeoJSON`. In a typical TypeScript setup, this might not be a
   problem, but in our specific scenario, it led to errors. Modifying the local
   copy allowed us to rename and resolve these conflicts.

3. **Flexibility and Control**: Having a local copy of the type definitions
   gives us more control. It allows for easier modification and adaptation of
   the types to fit specific needs or work around any issues or limitations in
   the future.

4. **Deno's Strict Type Resolution**: Deno is strict about type resolution, and
   when it encounters issues, they need to be addressed directly. Modifying the
   local version provided a direct way to address and fix these issues.

In essence, the local modification of the Leaflet types was necessitated by
Deno's specific module and type resolution behavior, as well as conflicts with
global type names. This approach provided a controlled and adaptable solution to
ensure compatibility.
