# SST Toolkit - Usage Examples

> **Quick reference examples for common use cases**

## 🚀 Quick Start

### 1. Create a Custom Component

```bash
# Generate a new component
sst-toolkit plugin create my-api --template aws --namespace mycompany
```

**Generated files:**
```
my-api/
├── src/
│   └── my-api.ts          # Component implementation
├── global.d.ts            # TypeScript module augmentation
├── package.json           # Package configuration
└── tsconfig.json          # TypeScript configuration
```

### 2. Use in Your SST Project

```typescript
// sst.config.ts
import { MyApi } from "@mycompany/my-api";

export default {
  stacks(app) {
    app.stack(function Site({ stack }) {
      const api = new MyApi("MyApi", {
        handler: "packages/functions/api.handler",
      });

      stack.addOutputs({
        apiUrl: api.url, // ✅ Full type safety
      });
    });
  },
};
```

### 3. Explore Your Infrastructure

```bash
# CLI exploration
sst-toolkit explore .sst/state.json

# Web explorer
pnpm dev
# Open http://localhost:5173
```

---

## 📦 Component Examples

### Example 1: Simple API Component

```typescript
import { SSTComponent } from "@sst-toolkit/plugin-sdk";
import { ApiGatewayV2, Function } from "sst/aws";

export class SimpleApi extends SSTComponent {
  private api: ApiGatewayV2;
  private handler: Function;

  constructor(name: string, props: SimpleApiProps) {
    super(name, {
      pulumiType: "sst:mycompany:SimpleApi",
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
    return { url: this.api.url };
  }
}
```

### Example 2: Database-Backed API

```typescript
import { SSTComponent } from "@sst-toolkit/plugin-sdk";
import { ApiGatewayV2, Function, DynamoDB } from "sst/aws";

export class DatabaseApi extends SSTComponent {
  private api: ApiGatewayV2;
  private handler: Function;
  private table: DynamoDB.Table;

  constructor(name: string, props: DatabaseApiProps) {
    super(name, {
      pulumiType: "sst:mycompany:DatabaseApi",
    });

    this.table = new DynamoDB.Table(`${name}Table`, {
      parent: this,
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
        "GET /items": this.handler,
        "POST /items": this.handler,
      },
    });

    this.registerOutputs({
      url: this.api.url,
      tableName: this.table.name,
    });
  }

  getLinkProperties() {
    return {
      url: this.api.url,
      tableName: this.table.name,
    };
  }
}
```

### Example 3: Event-Driven Component

```typescript
import { SSTComponent } from "@sst-toolkit/plugin-sdk";
import { Bus, Function, Queue } from "sst/aws";

export class EventProcessor extends SSTComponent {
  private bus: Bus;
  private processor: Function;
  private queue: Queue;

  constructor(name: string, props: EventProcessorProps) {
    super(name, {
      pulumiType: "sst:mycompany:EventProcessor",
    });

    this.bus = new Bus(`${name}Bus`, {
      parent: this,
    });

    this.queue = new Queue(`${name}Queue`, {
      parent: this,
    });

    this.processor = new Function(`${name}Processor`, {
      parent: this,
      handler: props.handler,
      environment: {
        QUEUE_URL: this.queue.url,
      },
    });

    this.bus.subscribe("events", this.processor);

    this.registerOutputs({
      busName: this.bus.name,
      queueUrl: this.queue.url,
    });
  }

  getLinkProperties() {
    return {
      busName: this.bus.name,
      queueUrl: this.queue.url,
    };
  }
}
```

---

## 🔍 CLI Commands

### Component Management

```bash
# Create a new component
sst-toolkit plugin create <name> --template <template> --namespace <namespace>

# List installed plugins
sst-toolkit plugin list

# Install a plugin
sst-toolkit plugin install <package>

# Remove a plugin
sst-toolkit plugin remove <package>

# Test a plugin
sst-toolkit plugin test

# Publish a plugin
sst-toolkit plugin publish
```

### Exploration

```bash
# Explore SST state
sst-toolkit explore <state-file>

# Visualize infrastructure
sst-toolkit visualize <state-file> --format png --output diagram.png

# Export to JSON
sst-toolkit visualize <state-file> --format json --output state.json
```

### Plugin Discovery

```bash
# Browse available plugins
sst-toolkit plugin browse

# Search plugins
sst-toolkit plugin search <query>

# View plugin details
sst-toolkit plugin info <package>
```

---

## 🎨 Explorer Features

### Overview Tab
- Resource statistics
- Provider breakdown
- Cost estimates
- Resource type distribution

### Explorer Tab
- Hierarchical resource tree
- Search and filter
- Resource details
- Parent-child relationships

### Workflow Tab
- Interactive visual graph
- Resource relationships
- Dependency visualization
- Custom component highlighting

### Costs Tab
- Cost breakdown by resource
- Provider cost analysis
- Monthly cost estimates
- Cost trends

### Plugins Tab (Future)
- Installed plugins
- Plugin marketplace
- Plugin dependencies
- Plugin status

---

## 🔗 Integration Examples

### Using Links

```typescript
import { MyApi } from "@mycompany/my-api";
import { Link } from "sst";

export default {
  stacks(app) {
    app.stack(function Site({ stack }) {
      const api = new MyApi("MyApi", {
        handler: "packages/functions/api.handler",
      });

      // Create link
      const link = Link.create(api);

      // Use in function
      const function = new Function("MyFunction", {
        handler: "packages/functions/my-function.handler",
        link: [link],
      });
    });
  },
};
```

### Type Safety in Functions

```typescript
// packages/functions/my-function.ts
import { Resource } from "sst";

export async function handler() {
  // ✅ Full type safety
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

## 📊 Visualization Examples

### CLI Output

```bash
$ sst-toolkit explore .sst/state.json

Found 42 resources
Found 38 relationships

Resources by Provider:
  - SST: 15
  - AWS: 27

Resources by Type:
  - Function: 8
  - ApiGateway: 3
  - Table: 2
  - Bucket: 4
  - Queue: 2
  - Bus: 1
  - Custom Components: 3
    - MyApi (acme:MyApi)
    - CustomService (mycompany:Service)
    - DataPipeline (acme:Pipeline)

Estimated Monthly Cost: $45.23
```

### Web Explorer

The web explorer provides:
- Interactive resource tree
- Visual workflow graph
- Cost breakdown charts
- Resource relationship visualization
- Search and filter capabilities

---

## 🏗️ Complete Workflow Example

### Step 1: Create Component

```bash
sst-toolkit plugin create blog-api --template aws --namespace mycompany
```

### Step 2: Implement Component

```typescript
// blog-api/src/blog-api.ts
import { SSTComponent } from "@sst-toolkit/plugin-sdk";
import { ApiGatewayV2, Function, DynamoDB } from "sst/aws";

export class BlogApi extends SSTComponent {
  // Implementation...
}
```

### Step 3: Use in Project

```typescript
// sst.config.ts
import { BlogApi } from "@mycompany/blog-api";

export default {
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

### Step 4: Deploy

```bash
sst deploy
```

### Step 5: Explore

```bash
# CLI
sst-toolkit explore .sst/state.json

# Web
pnpm dev
```

### Step 6: Publish

```bash
cd blog-api
sst-toolkit plugin publish
```

---

## 🎯 Key Benefits

1. **Type Safety**: Full TypeScript support with module augmentation
2. **Reusability**: Create once, use everywhere
3. **Validation**: Built-in checks catch common mistakes
4. **Visualization**: Understand your infrastructure at a glance
5. **Community**: Share and discover components
6. **Integration**: Seamless SST integration

---

## 📚 Next Steps

1. Read the [Full Usage Guide](./USAGE_GUIDE.md)
2. Check out [Architecture Plan](../plan/ARCHITECTURE_IMPROVEMENT_PLAN.md)
3. Review [Implementation Tasks](../plan/TASKS.md)
4. Explore the [Examples](../examples/) directory

