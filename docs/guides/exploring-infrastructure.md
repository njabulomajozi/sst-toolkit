# Exploring Infrastructure

This guide explains how to use the CLI and Explorer to explore and visualize your SST infrastructure.

## CLI Commands

### Find Resources

Find AWS resources by tags:

```bash
# Basic usage
sst-toolkit resources find \
  --tag sst:stage dev \
  --tag sst:app myapp

# With region and profile
sst-toolkit resources find \
  --tag sst:stage dev \
  --tag sst:app myapp \
  --region us-east-1 \
  --profile myprofile

# Using OR logic for tags
sst-toolkit resources find \
  --tag sst:stage dev \
  --tag sst:app myapp \
  --tagMatch OR
```

**Options:**
- `--tag KEY VALUE`: Tag filter (can be used multiple times)
- `--tagMatch <AND|OR>`: Tag matching logic (default: AND)
- `--region <region>`: AWS region (default: us-east-1)
- `--profile <profile>`: AWS profile (default: default)

**Example Output:**
```
🔍 FINDING AWS RESOURCES
============================================================
Region:   us-east-1
Profile:  default
============================================================

Searching for resources with AND tags:
  - sst:stage=dev
  - sst:app=myapp

Found 15 resource(s)

Resources found:
  lambda: 5 resource(s)
  dynamodb: 2 resource(s)
  apigateway: 1 resource(s)
  s3: 3 resource(s)
  iam: 4 resource(s)
```

### Delete Resources

Delete AWS resources by tags:

```bash
# Dry run (preview only)
sst-toolkit resources delete \
  --tag sst:stage dev \
  --tag sst:app myapp \
  --dry-run

# Actually delete (with confirmation)
sst-toolkit resources delete \
  --tag sst:stage dev \
  --tag sst:app myapp

# Skip confirmation prompt
sst-toolkit resources delete \
  --tag sst:stage dev \
  --tag sst:app myapp \
  --force
```

**Options:**
- `--tag KEY VALUE`: Tag filter (can be used multiple times)
- `--tagMatch <AND|OR>`: Tag matching logic (default: AND)
- `--region <region>`: AWS region
- `--profile <profile>`: AWS profile
- `--dry-run`: Preview changes without deleting
- `--force, -f`: Skip confirmation prompts

**Important:** Always use `--dry-run` first to preview what will be deleted!

### Generate Component

Generate a new SST component from a template:

```bash
# Basic component
sst-toolkit generate component MyComponent \
  --template basic \
  --namespace mycompany

# AWS-focused component
sst-toolkit generate component MyAPI \
  --template aws \
  --namespace mycompany \
  --output ./my-components

# Cloudflare-focused component
sst-toolkit generate component MyWorker \
  --template cloudflare \
  --namespace mycompany
```

**Templates:**
- `basic`: Minimal component template
- `aws`: AWS-focused template with Function, API Gateway, and DynamoDB
- `cloudflare`: Cloudflare-focused template with Worker, KV, and D1

### Generate Adapter

Generate a new SST adapter:

```bash
sst-toolkit generate adapter MyAdapter \
  --namespace mycompany \
  --output ./my-adapters
```

## Explorer Web App

The Explorer provides a visual interface for exploring your SST infrastructure.

### Starting the Explorer

```bash
cd apps/explorer
pnpm dev

# Open http://localhost:5173
```

### Features

#### File Upload

- Upload SST state files directly in the browser
- No need to manually place files in specific directories
- Supports any valid SST state JSON file
- Automatic validation and error handling

#### Explorer Tab

- Resource list with tree view
- Resource type filtering
- Search functionality
- Resource status indicators
- Click to view detailed resource information

#### Pending Operations Tab

- View all pending operations (create, update, delete, replace)
- Grouped by operation type and resource category
- Search and filter pending operations
- Visual indicators for different operation types
- Only appears when there are pending operations in the state file

#### Workflow Tab

- Interactive workflow visualization
- Resource relationships and dependencies
- Interactive canvas with zoom and pan
- Click nodes to view resource details
- Visual representation of infrastructure topology

#### Global Search

- Quick search across all resources (⌘K / Ctrl+K)
- Search by name, type, URN, or category
- Results ranked by relevance
- Visual indicators for pending resources
- Keyboard navigation support

### Loading State

The Explorer uses file upload to load state files. To use your own SST state:

#### Export State from Your SST Project

From your SST project directory, export the state for the stage you want to explore:

```bash
# Export state for a specific stage (e.g., dev, staging, prod)
npx sst state export --stage dev > state.json
```

#### Upload in Explorer

1. Start the Explorer development server
2. Click the "Upload State File" button
3. Select your exported `state.json` file
4. The Explorer will automatically parse and display your infrastructure

**Benefits of File Upload:**
- No need to manually copy files
- Works with any state file location
- Easy to switch between different state files
- No file path configuration needed

## Visualization

### Workflow Visualization

The workflow visualization shows:

- **Nodes**: Resources in your infrastructure
- **Edges**: Relationships between resources
- **Colors**: Different relationship types
  - Blue: Parent-child relationships
  - Purple: Dependencies
  - Green: Events
  - Orange: Data flow

### Resource Relationships

The Explorer detects and visualizes:

- Parent-child relationships
- Dependencies
- Event connections
- Data flow

### Interactive Features

- **Zoom**: Use mouse wheel or pinch gesture
- **Pan**: Click and drag the canvas
- **Select**: Click on nodes to view details
- **Search**: Use global search to find and navigate to resources

## Exporting Data

### Export State

```bash
# Export state from your SST project
npx sst state export --stage dev > state.json
```

The exported state file can then be uploaded to the Explorer for visualization.

## Best Practices

### Finding Resources

1. Always use specific tags to narrow down results
2. Use `--dry-run` when deleting resources
3. Use `--tagMatch OR` when you want to find resources matching any tag
4. Specify region and profile for multi-region/multi-account setups

### Using the Explorer

1. Export state files regularly to track infrastructure changes
2. Use global search (⌘K) for quick navigation
3. Check pending operations tab to see what's being deployed
4. Use workflow visualization to understand dependencies

## Next Steps

- **[Component Examples](../examples/components.md)** - See component examples
- **[Using Components](./using-components.md)** - Learn how to use components
- **[API Reference](../API.md)** - Complete API documentation
- **[Creating Components](./creating-components.md)** - Create your own components
