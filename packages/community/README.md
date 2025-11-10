# @sst-toolkit/community

Community-maintained SST components for common use cases. These components are owned by sst-toolkit and serve as examples and can be used as-is or as templates for creating your own components.

## Components

### BedrockGateway

Creates an OpenAI-compatible API gateway for Amazon Bedrock on AWS.

```typescript
import { BedrockGateway } from "@sst-toolkit/community/bedrock-gateway";

const gateway = new BedrockGateway("MyBedrockGateway", {
  handler: "src/bedrock-proxy.handler",
  modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0"
});
```

### OpenWebUI

Creates a web UI for interacting with OpenAI-compatible APIs.

```typescript
import { OpenWebUI } from "@sst-toolkit/community/open-webui";
import { BedrockGateway } from "@sst-toolkit/community/bedrock-gateway";

const gateway = new BedrockGateway("MyBedrockGateway", {
  handler: "src/bedrock-proxy.handler"
});

const webui = new OpenWebUI("MyWebUI", {
  backendUrl: gateway.url,
  handler: "src/webui.handler"
});
```

## Installation

```bash
pnpm add @sst-toolkit/community
```

## Usage

See individual component documentation for detailed usage examples.

## Contributing

These components serve as examples for creating your own SST components. Feel free to use them as templates or reference implementations.

