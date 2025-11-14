# Custom Component Example

This is an example custom SST component created using the SST Toolkit.

## Overview

This example demonstrates how to create a custom SST component that:
- Extends the `SSTComponent` base class
- Uses the proper Pulumi type format: `sst:example:MyComponent`
- Registers outputs
- Implements the `Link.Linkable` interface for SST Link integration

## Usage

```typescript
import { MyComponent } from "@example/custom-component";

const component = new MyComponent("MyComponent", {
  message: "Hello World!",
});
```

## Structure

```
custom-component/
├── src/
│   ├── my-component.ts    # Component implementation
│   └── index.ts            # Exports
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── README.md
```

## Building

```bash
pnpm build
```

This will:
- Compile TypeScript to JavaScript
- Generate type definitions (.d.ts files)
- Create both CommonJS and ES Module outputs
- Generate source maps

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Type check
pnpm lint:type

# Lint code
pnpm lint:code
```

## Key Features

### Component Class

The component extends `SSTComponent` which provides:
- Pulumi type validation
- SST Link integration
- Output registration
- Parent-child relationship management

### Pulumi Type Format

The component uses the format: `sst:example:MyComponent`
- `sst:` - Required prefix for SST components
- `example` - Namespace (lowercase, alphanumeric + hyphens)
- `MyComponent` - Component type (PascalCase)

### Link Properties

The component implements `getLinkProperties()` to expose properties via SST Link:

```typescript
protected getLinkProperties(): Record<string, unknown> {
  return {
    message: this.message,
  };
}
```

### Outputs

The component registers outputs that can be accessed:

```typescript
this.registerOutputs({
  message: props.message || "Hello, World!",
});
```

## Using in SST Project

```typescript
// sst.config.ts
import { MyComponent } from "@example/custom-component";

export default {
  stacks(app) {
    app.stack(function MyStack({ stack }) {
      const component = new MyComponent("MyComponent", {
        message: "Hello from SST!",
      });

      stack.addOutputs({
        message: component.message,
      });
    });
  },
};
```

## See Also

- **[Creating Components](../../docs/guides/creating-components.md)** - Learn how to create components
- **[Component Examples](../../docs/examples/components.md)** - More examples
- **[Using Components](../../docs/guides/using-components.md)** - How to use components
- **[Component API](../../docs/guides/component-api.md)** - API reference
