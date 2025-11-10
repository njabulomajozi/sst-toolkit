import * as Component from "@sst-toolkit/plugin-sdk/component";
import * as Resources from "@sst-toolkit/plugin-sdk/resources";
import type { ComponentResourceOptions, Input, Output } from "@pulumi/pulumi";
import { interpolate, output } from "@pulumi/pulumi";

type FunctionArgs = Resources.AWS.FunctionArgs;

export interface IBedrockGatewayProps {
  /**
   * The Amazon Bedrock model ID to use for inference.
   *
   * @default `"anthropic.claude-3-5-sonnet-20241022-v2:0"`
   * @example
   * ```ts
   * {
   *   modelId: "anthropic.claude-3-5-haiku-20241022-v1:0"
   * }
   * ```
   */
  modelId?: Input<string>;
  /**
   * Path to the Lambda handler function that implements the OpenAI-compatible API.
   *
   * The handler should implement three endpoints:
   * - `POST /v1/chat/completions` - Chat completions endpoint
   * - `GET /v1/models` - List available models
   * - `GET /health` - Health check endpoint
   *
   * @example
   * ```ts
   * {
   *   handler: "src/bedrock-proxy.handler"
   * }
   * ```
   */
  handler: Input<string | FunctionArgs>;
  /**
   * The Lambda runtime environment.
   * @default `"python3.12"`
   * @example
   * ```ts
   * {
   *   runtime: "python3.11"
   * }
   * ```
   */
  runtime?: Input<
    | "python3.9"
    | "python3.10"
    | "python3.11"
    | "python3.12"
    | "nodejs18.x"
    | "nodejs20.x"
    | "nodejs22.x"
  >;
  /**
   * The amount of memory allocated to the Lambda function.
   * @default `"512 MB"`
   * @example
   * ```ts
   * {
   *   memory: "1024 MB"
   * }
   * ```
   */
  memory?: Input<string>;
  /**
   * The maximum execution time for the Lambda function.
   * @default `"30 seconds"`
   * @example
   * ```ts
   * {
   *   timeout: "60 seconds"
   * }
   * ```
   */
  timeout?: Input<string>;
  /**
   * [Link resources](/docs/linking/) to the Lambda handler function.
   *
   * @example
   * ```ts
   * {
   *   link: [bucket, stripeKey]
   * }
   * ```
   */
  link?: FunctionArgs["link"];
  /**
   * Set a custom domain for the API Gateway.
   *
   * Automatically manages domains hosted on AWS Route 53, Cloudflare, and Vercel.
   *
   * @example
   * ```ts
   * {
   *   domain: "api.example.com"
   * }
   * ```
   */
  domain?: Resources.AWS.ApiGatewayV2Args["domain"];
  /**
   * Customize the CORS (Cross-origin resource sharing) settings for the API.
   * @default Enabled with `allowOrigins: ["*"]`, `allowMethods: ["GET", "POST", "OPTIONS"]`, `allowHeaders: ["*"]`
   * @example
   * Disable CORS.
   * ```ts
   * {
   *   cors: false
   * }
   * ```
   */
  cors?: Resources.AWS.ApiGatewayV2Args["cors"];
}

/**
 * The `BedrockGateway` component creates an OpenAI-compatible API gateway for Amazon Bedrock
 * on AWS. It deploys a Lambda function behind API Gateway that translates OpenAI API requests
 * to Amazon Bedrock API calls.
 *
 * @example
 *
 * #### Create a Bedrock Gateway
 *
 * ```ts title="sst.config.ts"
 * import { BedrockGateway } from "@sst-toolkit/community/bedrock-gateway";
 *
 * const gateway = new BedrockGateway("MyBedrockGateway", {
 *   handler: "src/bedrock-proxy.handler"
 * });
 * ```
 *
 * #### Configure the model
 *
 * ```ts title="sst.config.ts" {4}
 * import { BedrockGateway } from "@sst-toolkit/community/bedrock-gateway";
 *
 * new BedrockGateway("MyBedrockGateway", {
 *   handler: "src/bedrock-proxy.handler",
 *   modelId: "anthropic.claude-3-5-haiku-20241022-v1:0"
 * });
 * ```
 *
 * #### Add a custom domain
 *
 * ```ts title="sst.config.ts" {4}
 * import { BedrockGateway } from "@sst-toolkit/community/bedrock-gateway";
 *
 * new BedrockGateway("MyBedrockGateway", {
 *   handler: "src/bedrock-proxy.handler",
 *   domain: "api.example.com"
 * });
 * ```
 */
export class BedrockGateway extends Component.Component.SSTComponent {
  private readonly _api: Resources.AWS.ApiGatewayV2;
  private readonly _table: Resources.AWS.DynamoDB;

  constructor(
    name: string,
    props: IBedrockGatewayProps,
    opts?: ComponentResourceOptions
      ) {
        super("sst:community:BedrockGateway", name, props, opts);
        const region = Resources.AWS.getRegionOutput(undefined, { parent: this }).name;
    const modelId = output(props.modelId ?? "anthropic.claude-3-5-sonnet-20241022-v2:0");

    // Create DynamoDB table for API key storage
    this._table = new Resources.AWS.DynamoDB(
      `${name}ApiKeys`,
      {
        fields: {
          api_key: "string",
        },
        primaryKey: "api_key",
        ttl: "expires_at",
      },
          { parent: this }
    );

    // Create Lambda function
    const fn = new Resources.AWS.Function(
      `${name}Function`,
      typeof props.handler === "string"
        ? {
            handler: props.handler,
            runtime: (props.runtime ?? "python3.12") as FunctionArgs["runtime"],
            memory: props.memory ?? "512 MB",
            timeout: props.timeout ?? "30 seconds",
            link: props.link ? [...props.link, this._table] : [this._table],
            environment: {
              MODEL_ID: modelId,
              REGION: region,
              API_KEYS_TABLE: this._table.name,
            },
            permissions: [
              {
                actions: [
                  "bedrock:InvokeModel",
                  "bedrock:InvokeModelWithResponseStream",
                ],
                resources: [
                  interpolate`arn:aws:bedrock:${region}::foundation-model/*`,
                ],
              },
            ],
          }
        : {
            ...props.handler,
            runtime: (props.runtime ?? "python3.12") as FunctionArgs["runtime"],
            memory: props.memory ?? "512 MB",
            timeout: props.timeout ?? "30 seconds",
            link: props.link ? [...props.link, this._table] : [this._table],
            environment: {
              MODEL_ID: modelId,
              REGION: region,
              API_KEYS_TABLE: this._table.name,
              ...(props.handler.environment || {}),
            },
            permissions: [
              {
                actions: [
                  "bedrock:InvokeModel",
                  "bedrock:InvokeModelWithResponseStream",
                ],
                resources: [
                  interpolate`arn:aws:bedrock:${region}::foundation-model/*`,
                ],
              },
              ...(props.handler.permissions || []),
            ],
          },
          { parent: this }
    );

    // Create API Gateway
    this._api = new Resources.AWS.ApiGatewayV2(
      `${name}Api`,
      {
        domain: props.domain,
        cors:
          props.cors === false
            ? false
            : {
                allowOrigins: ["*"],
                allowMethods: ["GET", "POST", "OPTIONS"],
                allowHeaders: ["*"],
                exposeHeaders: ["*"],
                maxAge: "1 day",
                ...(typeof props.cors === "object" ? props.cors : {}),
              },
        routes: {
          "$default": fn,
        },
      },
          { parent: this }
    );

    this.registerOutputs({
      url: this._api.url,
      tableName: this._table.name,
    });
  }

  /**
   * The URL of the API Gateway endpoint.
   *
   * If `domain` is set, this is the custom domain URL.
   * Otherwise, it's the auto-generated API Gateway URL.
   */
  public get url(): Output<string> {
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
      /**
       * The DynamoDB table for storing API keys.
       */
      table: this._table,
    };
  }

  protected getLinkProperties(): Record<string, unknown> {
    return {
      url: this._api.url,
      tableName: this._table.name,
    };
  }
}

