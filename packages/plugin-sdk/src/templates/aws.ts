export const AWS = `import * as Component from "@sst-toolkit/plugin-sdk/component";
import type { ComponentResourceOptions } from "@pulumi/pulumi";
import { Function } from "sst/components/function";
import { ApiGatewayV2 } from "sst/components/api-gateway-v2";
import { DynamoDB } from "sst/components/dynamodb";

export interface I{{ComponentName}}Props {
  handler: string;
}

export class {{ComponentName}} extends Component.Component.SSTComponent {
  private fn: Function;
  private api: ApiGatewayV2;
  private table: DynamoDB;

  constructor(
    name: string,
    props: I{{ComponentName}}Props,
    opts?: ComponentResourceOptions
  ) {
    super("sst:{{namespace}}:{{ComponentName}}", name, props, opts);

    this.fn = new Function(\`\${name}Function\`, {
      handler: props.handler,
    }, { parent: this });

    this.api = new ApiGatewayV2(\`\${name}Api\`, {
      routes: {
        "GET /": this.fn,
      },
    }, { parent: this });

    this.table = new DynamoDB(\`\${name}Table\`, {
      fields: {
        id: "string",
      },
      primaryKey: "id",
    }, { parent: this });

    this.registerOutputs({
      url: this.api.url,
      tableName: this.table.name,
    });
  }

  protected getLinkProperties(): Record<string, unknown> {
    return {
      url: this.api.url,
      tableName: this.table.name,
    };
  }
}
`;

