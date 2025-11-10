import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock SST components - must use factory function for hoisting
vi.mock("@sst-toolkit/plugin-sdk/resources", () => {
  const mockFunction = vi.fn().mockImplementation((name, props, opts) => ({
    name: `${name}Function`,
    url: `https://${name}.lambda.amazonaws.com`,
    ...props,
    ...opts,
  }));

  const mockApiGateway = vi.fn().mockImplementation((name, props, opts) => ({
    name: `${name}Api`,
    url: `https://${name}.execute-api.amazonaws.com`,
    ...props,
    ...opts,
  }));

  const mockDynamoDB = vi.fn().mockImplementation((name, props, opts) => ({
    name: `${name}Table`,
    ...props,
    ...opts,
  }));

  const mockGetRegionOutput = vi.fn().mockReturnValue({
    name: "us-east-1",
  });

  return {
    AWS: {
      Function: mockFunction,
      ApiGatewayV2: mockApiGateway,
      DynamoDB: mockDynamoDB,
      getRegionOutput: mockGetRegionOutput,
      FunctionArgs: {},
      ApiGatewayV2Args: {},
    },
  };
});

import { BedrockGateway } from "./bedrock-gateway";
import type { IBedrockGatewayProps } from "./bedrock-gateway";
import * as Resources from "@sst-toolkit/plugin-sdk/resources";

// Mock Pulumi
vi.mock("@pulumi/pulumi", () => ({
  output: (value: unknown) => ({ value, apply: (fn: (v: unknown) => unknown) => fn(value) }),
  interpolate: (strings: TemplateStringsArray, ...values: unknown[]) => 
    strings.reduce((acc, str, i) => acc + str + (values[i] || ""), ""),
}));

describe("BedrockGateway", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a BedrockGateway component", () => {
    const props: IBedrockGatewayProps = {
      handler: "src/handler.main",
    };

    const gateway = new BedrockGateway("TestGateway", props);

    expect(gateway).toBeInstanceOf(BedrockGateway);
    expect(gateway.url).toBeDefined();
  });

  it("should use default modelId when not provided", () => {
    const props: IBedrockGatewayProps = {
      handler: "src/handler.main",
    };

    const gateway = new BedrockGateway("TestGateway", props);
    expect(gateway).toBeDefined();
  });

  it("should use custom modelId when provided", () => {
    const props: IBedrockGatewayProps = {
      handler: "src/handler.main",
      modelId: "anthropic.claude-3-5-haiku-20241022-v1:0",
    };

    const gateway = new BedrockGateway("TestGateway", props);
    expect(gateway).toBeDefined();
  });

  it("should create DynamoDB table for API keys", () => {
    const props: IBedrockGatewayProps = {
      handler: "src/handler.main",
    };

    new BedrockGateway("TestGateway", props);

    expect(Resources.AWS.DynamoDB).toHaveBeenCalledWith(
      "TestGatewayApiKeys",
      expect.objectContaining({
        fields: {
          api_key: "string",
        },
        primaryKey: "api_key",
        ttl: "expires_at",
      }),
      expect.any(Object)
    );
  });

  it("should create Function with correct configuration", () => {
    const props: IBedrockGatewayProps = {
      handler: "src/handler.main",
      runtime: "python3.12",
      memory: "512 MB",
      timeout: "30 seconds",
    };

    new BedrockGateway("TestGateway", props);

    expect(Resources.AWS.Function).toHaveBeenCalledWith(
      "TestGatewayFunction",
      expect.objectContaining({
        handler: "src/handler.main",
        runtime: "python3.12",
        memory: "512 MB",
        timeout: "30 seconds",
      }),
      expect.any(Object)
    );
  });

  it("should create ApiGatewayV2 with correct configuration", () => {
    const props: IBedrockGatewayProps = {
      handler: "src/handler.main",
      domain: "api.example.com",
    };

    new BedrockGateway("TestGateway", props);

    expect(Resources.AWS.ApiGatewayV2).toHaveBeenCalledWith(
      "TestGatewayApi",
      expect.objectContaining({
        domain: "api.example.com",
        cors: expect.any(Object),
      }),
      expect.any(Object)
    );
  });

  it("should expose nodes property", () => {
    const props: IBedrockGatewayProps = {
      handler: "src/handler.main",
    };

    const gateway = new BedrockGateway("TestGateway", props);
    expect(gateway.nodes).toBeDefined();
    expect(gateway.nodes.api).toBeDefined();
    expect(gateway.nodes.table).toBeDefined();
  });
});

