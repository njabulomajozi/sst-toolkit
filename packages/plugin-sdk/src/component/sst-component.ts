import * as Adapters from "@sst-toolkit/core/adapters";
import type { ComponentResourceOptions, Inputs } from "@pulumi/pulumi";

interface ILinkDefinition {
  properties: Record<string, unknown>;
}

interface ILinkable {
  getSSTLink(): ILinkDefinition;
}

export abstract class SSTComponent extends Adapters.Component.ComponentAdapter implements ILinkable {
  constructor(
    pulumiType: string,
    name: string,
    args?: Inputs,
    opts?: ComponentResourceOptions
  ) {
    super(pulumiType, name, args, opts);
  }

  protected abstract getLinkProperties(): Record<string, unknown>;

  public getSSTLink(): ILinkDefinition {
    return {
      properties: this.getLinkProperties(),
    };
  }
}

