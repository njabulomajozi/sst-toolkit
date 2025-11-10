import * as Adapters from "@sst-toolkit/core/adapters";
import type { ComponentResource } from "@pulumi/pulumi";

export function validateComponent(component: ComponentResource): boolean {
  return Adapters.Validator.validateComponent(component, {
    checkPulumiType: true,
    checkParent: false,
    checkOutputs: false,
    checkLinkable: false,
  });
}

