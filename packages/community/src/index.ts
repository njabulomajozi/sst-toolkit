/**
 * @sst-toolkit/community - Community-maintained SST components
 *
 * This package contains community-maintained components for common use cases.
 * These components are owned by sst-toolkit and serve as examples and can be used
 * as-is or as templates for creating your own components.
 *
 * @example
 * ```typescript
 * import { BedrockGateway } from "@sst-toolkit/community/bedrock-gateway";
 *
 * const gateway = new BedrockGateway("MyGateway", {
 *   handler: "src/bedrock-proxy.handler"
 * });
 * ```
 */

export * as BedrockGateway from "./bedrock-gateway";
export * as OpenWebUI from "./open-webui";

