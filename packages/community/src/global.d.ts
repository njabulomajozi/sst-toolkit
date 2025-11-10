/**
 * Module augmentation for @sst-toolkit/community components
 *
 * This file provides global type support for community components.
 * Add your component types here to enable global access.
 */

declare global {
  export namespace sst {
    export namespace community {
      /**
       * BedrockGateway component
       * @example
       * ```ts
       * const gateway = new sst.community.BedrockGateway("MyGateway", {
       *   handler: "src/bedrock-proxy.handler"
       * });
       * ```
       */
      export class BedrockGateway extends import("./bedrock-gateway/bedrock-gateway").BedrockGateway {}

      /**
       * OpenWebUI component
       * @example
       * ```ts
       * const webui = new sst.community.OpenWebUI("MyWebUI", {
       *   backendUrl: "https://api.example.com"
       * });
       * ```
       */
      export class OpenWebUI extends import("./open-webui/open-webui").OpenWebUI {}
    }
  }
}

export {};

