import { ComponentResource, type ComponentResourceOptions, type Inputs } from "@pulumi/pulumi";

export class MockComponent extends ComponentResource {
  constructor(
    type: string,
    name: string,
    args?: Inputs,
    opts?: ComponentResourceOptions
  ) {
    super(type, name, args, opts);
  }
}

export interface IMockLinkDefinition {
  properties: Record<string, unknown>;
}

export interface IMockLinkable {
  getSSTLink(): IMockLinkDefinition;
}

export class MockLinkableComponent extends MockComponent implements IMockLinkable {
  private linkProperties: Record<string, unknown>;

  constructor(
    type: string,
    name: string,
    linkProperties: Record<string, unknown> = {},
    args?: Inputs,
    opts?: ComponentResourceOptions
  ) {
    super(type, name, args, opts);
    this.linkProperties = linkProperties;
  }

  public getSSTLink(): IMockLinkDefinition {
    return {
      properties: this.linkProperties,
    };
  }
}

export function createMockSSTEnvironment(): {
  Component: typeof MockComponent;
  Linkable: typeof MockLinkableComponent;
} {
  return {
    Component: MockComponent,
    Linkable: MockLinkableComponent,
  };
}

