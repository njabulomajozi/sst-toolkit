# SST Toolkit - Usage Guide

> **Complete guide to using SST Toolkit when fully implemented**

## Table of Contents

1. [Creating Custom SST Components](#creating-custom-sst-components)
2. [Using Components in Your SST Project](#using-components-in-your-sst-project)
3. [Exploring Your Infrastructure](#exploring-your-infrastructure)
4. [Publishing Plugins](#publishing-plugins)
5. [Installing Community Plugins](#installing-community-plugins)

---

## Creating Custom SST Components

### Quick Start: Generate a Component

The easiest way to create a custom SST component is using the CLI generator:

```bash
# Generate a new component from a template
sst-toolkit plugin create my-custom-api \
  --template aws \
  --namespace mycompany

# This creates:
# - my-custom-api/src/my-custom-api.ts (component implementation)
# - my-custom-api/global.d.ts (TypeScript module augmentation)
# - my-custom-api/package.json (with correct dependencies)
# - my-custom-api/tsconfig.json (TypeScript configuration)
```

### Example: Creating a Custom API Component

```bash
sst-toolkit plugin create my-api \
  --template aws \
  --namespace acme
```

**Generated Component** (`my-api/src/my-api.ts`):

```typescript
import { SSTComponent } from "@sst-toolkit/plugin-sdk";
import { ApiGatewayV2, Function, DynamoDB } from "sst/aws";

export class MyApi extends SSTComponent {
  private api: ApiGatewayV2;
  private handler: Function;
  private table: DynamoDB.Table;

  constructor(name: string, props: MyApiProps) {
    super(name, {
      pulumiType: "sst:acme:MyApi", // Auto-generated from namespace
    });

    // Create child resources with proper parent
    this.table = new DynamoDB.Table(`${name}Table`, {
      parent: this, // Automatically handled by SSTComponent
      fields: {
        id: "string",
        data: "string",
      },
    });

    this.handler = new Function(`${name}Handler`, {
      parent: this,
      handler: props.handler,
      environment: {
        TABLE_NAME: this.table.name,
      },
    });

    this.api = new ApiGatewayV2(`${name}Api`, {
      parent: this,
      routes: {
        "GET /": this.handler,
        "POST /items": this.handler,
      },
    });

    // Register outputs (automatically handled)
    this.registerOutputs({
      url: this.api.url,
      tableName: this.table.name,
    });
  }

  // Implement Link.Linkable interface
  getLinkProperties() {
    return {
      url: this.api.url,
      tableName: this.table.name,
    };
  }
}

export interface MyApiProps {
  handler: string;
}
```

**TypeScript Module Augmentation** (`my-api/global.d.ts`):

```typescript
import "@sst-toolkit/my-api";

declare module "sst" {
  export namespace Resource {
    interface MyApi {
      url: string;
      tableName: string;
    }
  }
}
```

### Manual Component Creation

If you prefer to create components manually:

```typescript
import { SSTComponent } from "@sst-toolkit/plugin-sdk";
import { Function, ApiGatewayV2 } from "sst/aws";

export class CustomService extends SSTComponent {
  private api: ApiGatewayV2;
  private handler: Function;

  constructor(name: string, props: CustomServiceProps) {
    super(name, {
      pulumiType: "sst:mycompany:CustomService",
    });

    this.handler = new Function(`${name}Handler`, {
      parent: this,
      handler: props.handler,
    });

    this.api = new ApiGatewayV2(`${name}Api`, {
      parent: this,
      routes: {
        "GET /": this.handler,
      },
    });

    this.registerOutputs({
      url: this.api.url,
    });
  }

  getLinkProperties() {
    return {
      url: this.api.url,
    };
  }
}
```

---

## Using Components in Your SST Project

### 1. Install Your Component

```bash
# If published to npm
pnpm add @mycompany/my-api

# If local development
pnpm add ./my-api
```

### 2. Use in Your SST Config

```typescript
// sst.config.ts
import { MyApi } from "@mycompany/my-api";

export default {
  config() {
    return {};
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      // Use your custom component
      const api = new MyApi("MyApi", {
        handler: "packages/functions/api.handler",
      });

      // Access outputs with full type safety
      stack.addOutputs({
        apiUrl: api.url, // ✅ TypeScript knows this exists
        tableName: api.tableName, // ✅ TypeScript knows this exists
      });
    });
  },
};
```

### 3. Use with Links

```typescript
import { MyApi } from "@mycompany/my-api";
import { Link } from "sst";

export default {
  stacks(app) {
    app.stack(function Site({ stack }) {
      const api = new MyApi("MyApi", {
        handler: "packages/functions/api.handler",
      });

      // Link to your component
      const link = Link.create(api);
      
      // Use in your functions
      const function = new Function("MyFunction", {
        handler: "packages/functions/my-function.handler",
        link: [link], // ✅ Full type safety
      });
    });
  },
};
```

### 4. Type Safety in Functions

```typescript
// packages/functions/my-function.ts
import { Resource } from "sst";

export async function handler() {
  // ✅ Full type safety - TypeScript knows the shape
  const apiUrl = Resource.MyApi.url;
  const tableName = Resource.MyApi.tableName;

  return {
    statusCode: 200,
    body: JSON.stringify({
      apiUrl,
      tableName,
    }),
  };
}
```

---

## Exploring Your Infrastructure

### Using the CLI

```bash
# Explore your SST state
sst-toolkit explore .sst/state.json

# Output:
# Found 42 resources
# Found 38 relationships

# Generate a visualization
sst-toolkit visualize .sst/state.json --format png --output infrastructure.png

# Export to JSON for further analysis
sst-toolkit visualize .sst/state.json --format json --output infrastructure.json
```

### Using the Explorer Web App

```bash
# Start the explorer
pnpm dev

# Open http://localhost:5173
# The explorer will automatically load your state.json file
```

**Features:**
- **Overview Tab**: Resource statistics, provider breakdown, cost estimates
- **Explorer Tab**: Hierarchical resource tree with search
- **Workflow Tab**: Interactive visual graph of resource relationships
- **Costs Tab**: Cost breakdown by resource type and provider

### Visualizing Custom Components

The explorer automatically detects and visualizes your custom components:

```
┌─────────────────────────────────────┐
│  SST State Visualizer               │
├─────────────────────────────────────┤
│  Stack: production                  │
│  Version: 3.0.0                     │
│  Last updated: 2024-12-XX           │
├─────────────────────────────────────┤
│  Resources: 42                       │
│  Custom Components: 3                │
│  - MyApi (acme:MyApi)                │
│  - CustomService (mycompany:Service) │
│  - DataPipeline (acme:Pipeline)     │
└─────────────────────────────────────┘
```

---

## Publishing Plugins

### 1. Validate Your Component

```bash
# Validate before publishing
sst-toolkit plugin test

# Checks:
# ✅ Pulumi type format is correct
# ✅ Parent relationships are set
# ✅ Outputs are registered
# ✅ Link.Linkable interface is implemented
# ✅ TypeScript types are correct
```

### 2. Build Your Plugin

```bash
cd my-api
pnpm build
```

### 3. Publish to npm

```bash
# Publish to npm registry
sst-toolkit plugin publish

# This will:
# - Run validation
# - Build the package
# - Update version
# - Publish to npm
# - Update plugin registry
```

### 4. Plugin Registry

Your plugin will be automatically listed in the plugin registry:

```bash
# Browse available plugins
sst-toolkit plugin browse

# Search for plugins
sst-toolkit plugin search api

# View plugin details
sst-toolkit plugin info @mycompany/my-api
```

---

## Installing Community Plugins

### Browse Available Plugins

```bash
# List all available plugins
sst-toolkit plugin list

# Browse by category
sst-toolkit plugin browse --category api
sst-toolkit plugin browse --category database
sst-toolkit plugin browse --category auth

# Search plugins
sst-toolkit plugin search "api gateway"
```

### Install a Plugin

```bash
# Install from npm
sst-toolkit plugin install @acme/custom-api

# Install from GitHub
sst-toolkit plugin install github:acme/sst-custom-api

# Install from local path
sst-toolkit plugin install ./local-plugin
```

### Use Installed Plugin

```typescript
// sst.config.ts
import { CustomApi } from "@acme/custom-api";

export default {
  stacks(app) {
    app.stack(function Site({ stack }) {
      const api = new CustomApi("MyApi", {
        // Plugin-specific props
      });

      stack.addOutputs({
        apiUrl: api.url,
      });
    });
  },
};
```

### Plugin Marketplace in Explorer

The explorer includes a plugin marketplace:

1. Open the explorer: `pnpm dev`
2. Navigate to the "Plugins" tab
3. Browse available plugins
4. Click "Install" to add to your project
5. View installed plugins and their status

---

## Complete Example: Full Workflow

### Step 1: Create a Custom Component

```bash
# Generate component
sst-toolkit plugin create blog-api \
  --template aws \
  --namespace mycompany
```

### Step 2: Implement Your Component

```typescript
// blog-api/src/blog-api.ts
import { SSTComponent } from "@sst-toolkit/plugin-sdk";
import { ApiGatewayV2, Function, DynamoDB } from "sst/aws";

export class BlogApi extends SSTComponent {
  private api: ApiGatewayV2;
  private postsTable: DynamoDB.Table;
  private commentsTable: DynamoDB.Table;
  private handler: Function;

  constructor(name: string, props: BlogApiProps) {
    super(name, {
      pulumiType: "sst:mycompany:BlogApi",
    });

    // Create tables
    this.postsTable = new DynamoDB.Table(`${name}Posts`, {
      parent: this,
      fields: {
        id: "string",
        title: "string",
        content: "string",
        createdAt: "number",
      },
    });

    this.commentsTable = new DynamoDB.Table(`${name}Comments`, {
      parent: this,
      fields: {
        id: "string",
        postId: "string",
        content: "string",
        createdAt: "number",
      },
    });

    // Create handler
    this.handler = new Function(`${name}Handler`, {
      parent: this,
      handler: props.handler,
      environment: {
        POSTS_TABLE: this.postsTable.name,
        COMMENTS_TABLE: this.commentsTable.name,
      },
    });

    // Create API
    this.api = new ApiGatewayV2(`${name}Api`, {
      parent: this,
      routes: {
        "GET /posts": this.handler,
        "POST /posts": this.handler,
        "GET /posts/{id}": this.handler,
        "POST /posts/{id}/comments": this.handler,
      },
    });

    // Register outputs
    this.registerOutputs({
      url: this.api.url,
      postsTable: this.postsTable.name,
      commentsTable: this.commentsTable.name,
    });
  }

  getLinkProperties() {
    return {
      url: this.api.url,
      postsTable: this.postsTable.name,
      commentsTable: this.commentsTable.name,
    };
  }
}

export interface BlogApiProps {
  handler: string;
}
```

### Step 3: Use in Your SST Project

```typescript
// sst.config.ts
import { BlogApi } from "@mycompany/blog-api";

export default {
  config() {
    return {};
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const blogApi = new BlogApi("BlogApi", {
        handler: "packages/functions/blog.handler",
      });

      stack.addOutputs({
        blogUrl: blogApi.url,
      });
    });
  },
};
```

### Step 4: Deploy and Explore

```bash
# Deploy your SST stack
sst deploy

# Explore the deployed infrastructure
sst-toolkit explore .sst/state.json

# Or use the web explorer
pnpm dev
# Open http://localhost:5173
```

### Step 5: Publish Your Plugin

```bash
cd blog-api

# Test your component
sst-toolkit plugin test

# Publish to npm
sst-toolkit plugin publish
```

---

## Advanced Usage

### Creating Composite Components

```typescript
import { SSTComponent } from "@sst-toolkit/plugin-sdk";
import { MyApi } from "@mycompany/my-api";
import { Database } from "@acme/database";

export class FullStackApp extends SSTComponent {
  private api: MyApi;
  private database: Database;

  constructor(name: string, props: FullStackAppProps) {
    super(name, {
      pulumiType: "sst:mycompany:FullStackApp",
    });

    this.database = new Database(`${name}Database`, {
      parent: this,
      // Database props
    });

    this.api = new MyApi(`${name}Api`, {
      parent: this,
      handler: props.handler,
      // Link to database
      link: [Link.create(this.database)],
    });

    this.registerOutputs({
      apiUrl: this.api.url,
      databaseUrl: this.database.url,
    });
  }

  getLinkProperties() {
    return {
      apiUrl: this.api.url,
      databaseUrl: this.database.url,
    };
  }
}
```

### Custom Validation

```typescript
import { SSTComponent, validateComponent } from "@sst-toolkit/plugin-sdk";

export class MyComponent extends SSTComponent {
  constructor(name: string, props: MyComponentProps) {
    super(name, {
      pulumiType: "sst:mycompany:MyComponent",
    });

    // Custom validation
    validateComponent(this, {
      checkParent: true,
      checkOutputs: true,
      checkLinkable: true,
    });

    // Component implementation...
  }
}
```

---

## Summary

When fully implemented, SST Toolkit provides:

1. **Component Creation**: Easy CLI-based component generation
2. **Type Safety**: Full TypeScript support with module augmentation
3. **Visualization**: Rich web-based explorer for infrastructure
4. **Plugin Ecosystem**: Publish and share components with the community
5. **Validation**: Built-in validation to catch common mistakes
6. **Integration**: Seamless integration with SST's component system

The toolkit enables developers to:
- ✅ Create reusable SST components
- ✅ Share components with the community
- ✅ Visualize and understand infrastructure
- ✅ Build complex applications with type safety
- ✅ Extend SST without modifying core

