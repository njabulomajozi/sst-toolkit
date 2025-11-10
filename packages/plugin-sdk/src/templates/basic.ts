export const Basic = `import * as Component from "@sst-toolkit/plugin-sdk/component";
import type { ComponentResourceOptions } from "@pulumi/pulumi";

export interface I{{ComponentName}}Props {
}

export class {{ComponentName}} extends Component.Component.SSTComponent {
  constructor(
    name: string,
    props: I{{ComponentName}}Props = {},
    opts?: ComponentResourceOptions
  ) {
    super("sst:{{namespace}}:{{ComponentName}}", name, props, opts);

    this.registerOutputs({
    });
  }

  protected getLinkProperties(): Record<string, unknown> {
    return {
    };
  }
}
`;

