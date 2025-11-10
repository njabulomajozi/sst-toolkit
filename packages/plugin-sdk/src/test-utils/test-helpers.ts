import type { ComponentResource } from "@pulumi/pulumi";
import { validateComponent } from "./validator";
import * as MockSST from "./mock-sst";

export interface ITestComponentOptions {
  pulumiType: string;
  name: string;
  linkable?: boolean;
  linkProperties?: Record<string, unknown>;
}

export function createTestComponent(options: ITestComponentOptions): ComponentResource {
  const { pulumiType, name, linkable = false, linkProperties = {} } = options;

  if (linkable) {
    return new MockSST.MockLinkableComponent(pulumiType, name, linkProperties);
  }

  return new MockSST.MockComponent(pulumiType, name);
}

export function validateTestComponent(component: ComponentResource): boolean {
  return validateComponent(component);
}

export function createTestComponentWithValidation(options: ITestComponentOptions): ComponentResource {
  const component = createTestComponent(options);
  validateTestComponent(component);
  return component;
}

