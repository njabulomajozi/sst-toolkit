import * as Component from "@sst-toolkit/plugin-sdk/component";
import * as Resources from "@sst-toolkit/plugin-sdk/resources";
import type { ComponentResourceOptions, Input } from "@pulumi/pulumi";

type FunctionArgs = Resources.AWS.FunctionArgs;

export interface IOpenWebUIProps {
  /**
   * The backend API URL for Open WebUI to connect to.
   * This should be the URL of your Bedrock Gateway or other OpenAI-compatible API.
   *
   * @example
   * ```ts
   * {
   *   backendUrl: "https://api.example.com"
   * }
   * ```
   */
  backendUrl: Input<string>;
  /**
   * Path to the Lambda handler function that serves the Open WebUI frontend.
   *
   * @example
   * ```ts
   * {
   *   handler: "src/webui.handler"
   * }
   * ```
   */
  handler?: Input<string | FunctionArgs>;
  /**
   * The Lambda runtime environment.
   * @default `"nodejs20.x"`
   */
  runtime?: FunctionArgs["runtime"];
  /**
   * The amount of memory allocated to the Lambda function.
   * @default `"512 MB"`
   */
  memory?: Input<string>;
  /**
   * The maximum execution time for the Lambda function.
   * @default `"30 seconds"`
   */
  timeout?: Input<string>;
  /**
   * [Link resources](/docs/linking/) to the Lambda handler function.
   *
   * @example
   * ```ts
   * {
   *   link: [bucket, table]
   * }
   * ```
   */
  link?: FunctionArgs["link"];
  /**
   * Set a custom domain for the API Gateway.
   *
   * @example
   * ```ts
   * {
   *   domain: "webui.example.com"
   * }
   * ```
   */
  domain?: Resources.AWS.ApiGatewayV2Args["domain"];
  /**
   * Customize the CORS (Cross-origin resource sharing) settings for the API.
   * @default Enabled with `allowOrigins: ["*"]`, `allowMethods: ["GET", "POST", "OPTIONS"]`, `allowHeaders: ["*"]`
   */
  cors?: Resources.AWS.ApiGatewayV2Args["cors"];
}

/**
 * The `OpenWebUI` component creates a web UI for interacting with OpenAI-compatible APIs.
 * It deploys a Lambda function behind API Gateway that serves the Open WebUI frontend.
 *
 * @example
 *
 * #### Create an Open WebUI
 *
 * ```ts title="sst.config.ts"
 * import { OpenWebUI } from "@sst-toolkit/community/open-webui";
 * import { BedrockGateway } from "@sst-toolkit/community/bedrock-gateway";
 *
 * const gateway = new BedrockGateway("MyBedrockGateway", {
 *   handler: "src/bedrock-proxy.handler"
 * });
 *
 * const webui = new OpenWebUI("MyWebUI", {
 *   backendUrl: gateway.url,
 *   handler: "src/webui.handler"
 * });
 * ```
 *
 * #### Use with a custom backend
 *
 * ```ts title="sst.config.ts"
 * import { OpenWebUI } from "@sst-toolkit/community/open-webui";
 *
 * new OpenWebUI("MyWebUI", {
 *   backendUrl: "https://api.openai.com/v1",
 *   handler: "src/webui.handler"
 * });
 * ```
 */
export class OpenWebUI extends Component.Component.SSTComponent {
  private readonly _api: Resources.AWS.ApiGatewayV2;

  constructor(
    name: string,
    props: IOpenWebUIProps,
    opts?: ComponentResourceOptions
      ) {
        super("sst:community:OpenWebUI", name, props, opts);

    // Create API Gateway with default handler if not provided
    const handler: FunctionArgs = props.handler
      ? typeof props.handler === "string"
        ? {
            handler: props.handler,
            runtime: props.runtime ?? "nodejs20.x",
            memory: props.memory ?? "512 MB",
            timeout: props.timeout ?? "30 seconds",
            link: props.link,
            environment: {
              BACKEND_URL: props.backendUrl,
            },
          }
        : {
            ...props.handler,
            runtime: props.runtime ?? "nodejs20.x",
            memory: props.memory ?? "512 MB",
            timeout: props.timeout ?? "30 seconds",
            link: props.link,
            environment: {
              BACKEND_URL: props.backendUrl,
              ...(props.handler.environment || {}),
            },
          }
      : {
          // Default handler - serves static Open WebUI files
          handler: "src/webui.handler",
          runtime: props.runtime ?? "nodejs20.x",
          memory: props.memory ?? "512 MB",
          timeout: props.timeout ?? "30 seconds",
          link: props.link,
          environment: {
            BACKEND_URL: props.backendUrl,
          },
        };

    this._api = new Resources.AWS.ApiGatewayV2(
      `${name}Api`,
      {
        domain: props.domain,
        cors:
          props.cors === false
            ? false
            : {
                allowOrigins: ["*"],
                allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                allowHeaders: ["*"],
                exposeHeaders: ["*"],
                maxAge: "1 day",
                ...(typeof props.cors === "object" ? props.cors : {}),
              },
        routes: {
          "$default": handler,
        },
      },
          { parent: this }
    );

    this.registerOutputs({
      url: this._api.url,
    });
  }

  /**
   * The URL of the API Gateway endpoint.
   *
   * If `domain` is set, this is the custom domain URL.
   * Otherwise, it's the auto-generated API Gateway URL.
   */
  public get url() {
    return this._api.url;
  }

  /**
   * The underlying resources this component creates.
   */
  public get nodes() {
    return {
      /**
       * The API Gateway HTTP API.
       */
      api: this._api,
    };
  }

  protected getLinkProperties(): Record<string, unknown> {
    return {
      url: this._api.url,
    };
  }
}

