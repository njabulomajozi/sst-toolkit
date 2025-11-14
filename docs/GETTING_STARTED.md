# Getting Started with SST Toolkit

This guide will help you get started with SST Toolkit quickly.

## What is SST Toolkit?

SST Toolkit is a comprehensive toolkit for exploring, visualizing, and extending SST (Serverless Stack). It provides:

- **Explorer**: Visual web application for exploring and visualizing SST infrastructure state
- **CLI**: Command-line tools for finding AWS resources and generating SST components
- **Core Utilities**: State parsing, relationship detection, and workflow building
- **Plugin SDK**: SDK for creating custom SST components and adapters

## Installation

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 10.0.0
- SST >= 3.0.0

### Install SST Toolkit

```bash
# Clone the repository
git clone https://github.com/sst-toolkit/sst-toolkit.git
cd sst-toolkit

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

## Quick Start

### 1. Explore Your SST Infrastructure

#### Using the Explorer Web App

1. **Export your SST state** from your SST project:
   ```bash
   # From your SST project directory
   npx sst state export --stage dev > state.json
   ```

2. **Start the Explorer**:
   ```bash
   cd apps/explorer
   pnpm dev
   # Open http://localhost:5173
   ```

3. **Upload your state file**: Click the "Upload State File" button and select your `state.json` file

The Explorer provides:
- 📤 File upload for easy state file loading
- 🔍 Resource explorer with search functionality
- 📊 Interactive workflow visualization
- ⏳ Pending operations view
- 🔎 Global search (⌘K / Ctrl+K)

#### Using the CLI to Find Resources

Find AWS resources by tags:

```bash
# Build the CLI first
cd apps/cli
pnpm build

# Find resources (uses AWS credentials from environment or profile)
./dist/index.js resources find \
  --tag sst:stage dev \
  --tag sst:app myapp \
  --region us-east-1 \
  --profile myprofile

# Or use environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, etc.)
# The CLI automatically detects and uses these
./dist/index.js resources find \
  --tag sst:stage dev \
  --tag sst:app myapp
```

### 2. Create Your First Component

```bash
# Generate a new component
cd apps/cli
./dist/index.js generate component MyComponent \
  --template basic \
  --namespace mycompany \
  --output ./my-components
```

This creates a complete component structure ready for development.

**Available templates:**
- `basic`: Minimal component template
- `aws`: AWS-focused template with Function, API Gateway, and DynamoDB
- `cloudflare`: Cloudflare-focused template with Worker, KV, and D1

### 3. Generate an Adapter

```bash
./dist/index.js generate adapter MyAdapter \
  --namespace mycompany \
  --output ./my-adapters
```

### 4. Use Your Component

```typescript
// sst.config.ts
import { MyComponent } from "@mycompany/my-component";

export default {
  stacks(app) {
    app.stack(function MyStack({ stack }) {
      const component = new MyComponent("MyComponent", {
        // ... props
      });

      stack.addOutputs({
        output: component.output,
      });
    });
  },
};
```

## Next Steps

- **[Creating Components](./guides/creating-components.md)** - Learn how to create custom components
- **[Using Components](./guides/using-components.md)** - Learn how to use components in your projects
- **[Exploring Infrastructure](./guides/exploring-infrastructure.md)** - Use the CLI and Explorer
- **[Component Examples](./examples/components.md)** - See real-world examples

## Architecture Overview

SST Toolkit follows a modular architecture:

```
sst-toolkit/
├── packages/
│   ├── core/          # Core utilities (state, relationships, workflow, adapters)
│   ├── shared/        # Shared types, schemas, constants
│   └── plugin-sdk/    # SDK for creating plugins and components
├── apps/
│   ├── explorer/      # Visual SST state explorer (React app)
│   └── cli/           # Command-line interface
└── examples/          # Example components and plugins
```

### Core Principles

1. **Extensibility**: Built on adapter pattern to extend SST without modifying core
2. **Type Safety**: Full TypeScript support with shared types
3. **Modularity**: Each package is independently usable
4. **Developer Experience**: CLI tools and SDK for rapid development

## Key Concepts

### Components vs Adapters

In SST Toolkit:
- **Components**: Custom SST components that wrap and combine SST resources
- **Adapters**: Similar to components but typically used for integration patterns

Both use the same base class (`SSTComponent`) and follow the same patterns.

### Pulumi Type Format

All components must use the format: `sst:namespace:Type`

- `sst:` - Required prefix for SST components
- `namespace` - Your company/org name (lowercase, alphanumeric + hyphens)
- `Type` - Component type (PascalCase)

Examples:
- `sst:mycompany:MyComponent`
- `sst:acme:Database`
- `sst:example:ApiGateway`

### Component Structure

A component typically includes:

- Component class extending `SSTComponent`
- Props interface
- Implementation with child resources
- Link properties for SST Link integration
- Outputs registration

## Common Commands

```bash
# Build all packages
pnpm build

# Run tests
pnpm test

# Run linter
pnpm lint

# Generate a new component
cd apps/cli && pnpm build
./dist/index.js generate component MyComponent --template basic --namespace mycompany

# Generate a new adapter
./dist/index.js generate adapter MyAdapter --namespace mycompany

# Find AWS resources
./dist/index.js resources find --tag sst:stage dev --tag sst:app myapp

# Delete AWS resources (with dry-run)
./dist/index.js resources delete --tag sst:stage dev --tag sst:app myapp --dry-run
```

## Getting Help

- **[Documentation Index](./README.md)** - Browse all documentation
- **[API Reference](./API.md)** - Complete API documentation
- **[Examples](./examples/)** - Real-world examples
- **[Best Practices](./guides/best-practices.md)** - Development guidelines

## What's Next?

Now that you're set up, check out:

1. **[Creating Components](./guides/creating-components.md)** - Create your first component
2. **[Component Examples](./examples/components.md)** - See what's possible
3. **[Using Components](./guides/using-components.md)** - Integrate components in your projects
4. **[Exploring Infrastructure](./guides/exploring-infrastructure.md)** - Use the CLI and Explorer
