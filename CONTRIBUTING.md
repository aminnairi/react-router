# Contributing to @aminnairi/react-router

## Development Setup

```bash
# Install dependencies for all workspaces
npm install

# Run the example in development mode
npm -w example run dev

# Lint the library
npm -w packages/react-router run lint
```

## Building the Library

```bash
# Build the library (runs TypeScript then rolldown)
npm -w packages/react-router run build

# Build the example
npm -w example run build
```

## Pre-Release Checklist

Before releasing a new version, follow these steps to avoid common issues:

### 1. Verify the Build Output

**Critical**: Ensure React is externalized in the build to prevent hooks mismatch errors in consumer applications.

Check `packages/react-router/rolldown.config.ts`:

```typescript
export default defineConfig({
  input: "index.tsx",
  external: ["react"],  // <- Must include this!
  output: {
    file: "dist/index.js",
    format: "esm"
  }
});
```

### 2. Test the Production Build

```bash
# Clean and rebuild everything
rm -rf node_modules example/node_modules
npm install

# Build the library
npm -w packages/react-router run build

# Build the example (this will fail if React is bundled)
npm -w example run build
```

### 3. Verify the Packed Files

```bash
# Pack the library
npm pack -w packages/react-router

# List the contents (should include dist/index.js and dist/index.d.ts)
tar -tzf aminnairi-react-router-*.tgz
```

Expected files:
```
package/LICENSE
package/dist/index.js
package/dist/index.d.ts
package/package.json
package/README.md
```

### 4. Run Linting

```bash
npm -w packages/react-router run lint
```

## Release Process

1. **Update the version** in `packages/react-router/package.json`:
   ```bash
   # For major breaking changes
   npm version major
   
   # For new features (backwards compatible)
   npm version minor
   
   # For bug fixes
   npm version patch
   ```

2. **Add changelog entries** in both:
   - `README.md`
   - `packages/react-router/README.md`

   Include sections:
   - Major changes
   - Minor changes
   - Bug & security fixes

3. **Rebuild and pack**:
   ```bash
   npm -w packages/react-router run build
   npm pack -w packages/react-router
   ```

4. **Verify the package**:
   ```bash
   tar -tzf aminnairi-react-router-*.tgz
   ```

5. **Publish** (if ready):
   ```bash
   npm publish -w packages/react-router
   ```

## Common Issues

### React Hooks Mismatch Error

**Error**: `Cannot read properties of null (reading 'useMemo')`

**Cause**: React was bundled into the library instead of being externalized.

**Solution**: Add `external: ["react"]` to `rolldown.config.ts` (see section 1.1).

### Vite fdir Error

**Error**: `Cannot find package 'fdir'`

**Cause**: npm workspaces not hoisting transitive dependencies properly.

**Solution**: 
```bash
rm -rf node_modules example/node_modules package-lock.json example/package-lock.json
npm install
```

## Versioning Strategy

- **Major (4.0.0)**: Breaking changes (e.g., externalizing dependencies, API changes)
- **Minor (3.1.0)**: New features, backwards compatible
- **Patch (3.0.3)**: Bug fixes, backwards compatible
