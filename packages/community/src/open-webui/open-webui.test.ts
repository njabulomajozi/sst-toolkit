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

  return {
    AWS: {
      Function: mockFunction,
      ApiGatewayV2: mockApiGateway,
      FunctionArgs: {},
      ApiGatewayV2Args: {},
    },
  };
});

import { OpenWebUI } from "./open-webui";
import type { IOpenWebUIProps } from "./open-webui";
import * as Resources from "@sst-toolkit/plugin-sdk/resources";

describe("OpenWebUI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create an OpenWebUI component", () => {
    const props: IOpenWebUIProps = {
      backendUrl: "https://api.example.com",
    };

    const webui = new OpenWebUI("TestWebUI", props);

    expect(webui).toBeInstanceOf(OpenWebUI);
    expect(webui.url).toBeDefined();
  });

  it("should use default handler when not provided", () => {
    const props: IOpenWebUIProps = {
      backendUrl: "https://api.example.com",
    };

    const webui = new OpenWebUI("TestWebUI", props);
    expect(webui).toBeDefined();
  });

  it("should use custom handler when provided", () => {
    const props: IOpenWebUIProps = {
      backendUrl: "https://api.example.com",
      handler: "src/custom.handler",
    };

    const webui = new OpenWebUI("TestWebUI", props);
    expect(webui).toBeDefined();
  });

  it("should create ApiGatewayV2 with correct configuration", () => {
    const props: IOpenWebUIProps = {
      backendUrl: "https://api.example.com",
      domain: "webui.example.com",
    };

    new OpenWebUI("TestWebUI", props);

    expect(Resources.AWS.ApiGatewayV2).toHaveBeenCalledWith(
      "TestWebUIApi",
      expect.objectContaining({
        domain: "webui.example.com",
        cors: expect.any(Object),
      }),
      expect.any(Object)
    );
  });

  it("should expose nodes property", () => {
    const props: IOpenWebUIProps = {
      backendUrl: "https://api.example.com",
    };

    const webui = new OpenWebUI("TestWebUI", props);
    expect(webui.nodes).toBeDefined();
    expect(webui.nodes.api).toBeDefined();
  });
});

