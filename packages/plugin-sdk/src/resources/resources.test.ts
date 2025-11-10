import { describe, it, expect, vi } from "vitest";

// Mock SST components before importing
vi.mock("sst/components/function", () => ({
  Function: vi.fn(),
}));

vi.mock("sst/components/api-gateway-v2", () => ({
  ApiGatewayV2: vi.fn(),
}));

vi.mock("sst/components/dynamodb", () => ({
  DynamoDB: vi.fn(),
}));

vi.mock("sst/components/bucket", () => ({
  Bucket: vi.fn(),
}));

vi.mock("sst/components/event-bridge", () => ({
  EventBridge: vi.fn(),
}));

vi.mock("sst/components/queue", () => ({
  Queue: vi.fn(),
}));

vi.mock("sst/components/topic", () => ({
  Topic: vi.fn(),
}));

vi.mock("@pulumi/aws", () => ({
  getRegionOutput: vi.fn(),
}));

import * as Resources from "./index";

describe("Resources Module", () => {
  it("should export AWS namespace", () => {
    expect(Resources.AWS).toBeDefined();
  });

  it("should export AWS Function", () => {
    expect(Resources.AWS.Function).toBeDefined();
    expect(typeof Resources.AWS.Function).toBe("function");
  });

  it("should export AWS ApiGatewayV2", () => {
    expect(Resources.AWS.ApiGatewayV2).toBeDefined();
    expect(typeof Resources.AWS.ApiGatewayV2).toBe("function");
  });

  it("should export AWS DynamoDB", () => {
    expect(Resources.AWS.DynamoDB).toBeDefined();
    expect(typeof Resources.AWS.DynamoDB).toBe("function");
  });

  it("should export AWS getRegionOutput", () => {
    expect(Resources.AWS.getRegionOutput).toBeDefined();
    expect(typeof Resources.AWS.getRegionOutput).toBe("function");
  });

  it("should export AWS FunctionArgs type", () => {
    // Type check - if this compiles, the type is exported
    const _test: Resources.AWS.FunctionArgs = {} as Resources.AWS.FunctionArgs;
    expect(_test).toBeDefined();
  });

  it("should export AWS ApiGatewayV2Args type", () => {
    // Type check - if this compiles, the type is exported
    const _test: Resources.AWS.ApiGatewayV2Args = {} as Resources.AWS.ApiGatewayV2Args;
    expect(_test).toBeDefined();
  });
});
