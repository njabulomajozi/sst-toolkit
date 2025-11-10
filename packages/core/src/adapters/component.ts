import { ComponentResource, type ComponentResourceOptions, type Inputs } from "@pulumi/pulumi";

export class ComponentAdapter extends ComponentResource {
  static __pulumiType?: string;

  constructor(
    pulumiType: string,
    name: string,
    args?: Inputs,
    opts?: ComponentResourceOptions
  ) {
    super(pulumiType, name, args, opts);
    (this.constructor as typeof ComponentAdapter).__pulumiType = pulumiType;
  }
}

