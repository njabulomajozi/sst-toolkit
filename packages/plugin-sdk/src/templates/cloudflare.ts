export const Cloudflare = `import * as Component from "@sst-toolkit/plugin-sdk/component";
import type { ComponentResourceOptions } from "@pulumi/pulumi";
import { Worker } from "sst/components/worker";
import { KV } from "sst/components/kv";
import { D1 } from "sst/components/d1";

export interface I{{ComponentName}}Props {
  script: string;
}

export class {{ComponentName}} extends Component.Component.SSTComponent {
  private worker: Worker;
  private kv: KV;
  private d1: D1;

  constructor(
    name: string,
    props: I{{ComponentName}}Props,
    opts?: ComponentResourceOptions
  ) {
    super("sst:{{namespace}}:{{ComponentName}}", name, props, opts);

    this.worker = new Worker(\`\${name}Worker\`, {
      script: props.script,
    }, { parent: this });

    this.kv = new KV(\`\${name}KV\`, {}, { parent: this });

    this.d1 = new D1(\`\${name}D1\`, {}, { parent: this });

    this.registerOutputs({
      workerUrl: this.worker.url,
      kvNamespace: this.kv.namespace,
      d1Database: this.d1.database,
    });
  }

  protected getLinkProperties(): Record<string, unknown> {
    return {
      workerUrl: this.worker.url,
      kvNamespace: this.kv.namespace,
      d1Database: this.d1.database,
    };
  }
}
`;

