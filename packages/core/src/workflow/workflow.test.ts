import { describe, it, expect } from "vitest";
import { buildWorkflow } from "./workflow";
import * as Relationships from "../relationships/relationships";
import type { ISSTResource } from "@sst-toolkit/shared/types/sst";

describe("Workflow Builder", () => {
  const mockResources: ISSTResource[] = [
    {
      urn: "urn:pulumi:dev::my-app::sst:aws:Function::MyFunction",
      type: "sst:aws:Function",
      custom: true,
      parent: "urn:pulumi:dev::my-app::sst:aws:Api::MyApi",
      outputs: {
        name: "my-app-dev-MyFunction",
      },
      inputs: {},
    },
    {
      urn: "urn:pulumi:dev::my-app::sst:aws:Api::MyApi",
      type: "sst:aws:Api",
      custom: true,
      outputs: {
        url: "https://api.example.com",
      },
      inputs: {},
    },
  ];

  it("should build workflow from resources", () => {
    const relationships = Relationships.parseResourceRelationships(mockResources);
    const workflow = buildWorkflow(mockResources, relationships);

    expect(workflow).toBeDefined();
    expect(workflow.nodes).toBeDefined();
    expect(workflow.edges).toBeDefined();
    expect(workflow.nodes.length).toBe(2);
    expect(workflow.edges.length).toBeGreaterThan(0);
  });

  it("should create nodes for all resources", () => {
    const relationships = Relationships.parseResourceRelationships(mockResources);
    const workflow = buildWorkflow(mockResources, relationships);

    expect(workflow.nodes.length).toBe(mockResources.length);
    expect(workflow.nodes[0].id).toBe(mockResources[0].urn);
    expect(workflow.nodes[1].id).toBe(mockResources[1].urn);
  });

  it("should create edges from relationships", () => {
    const relationships = Relationships.parseResourceRelationships(mockResources);
    const workflow = buildWorkflow(mockResources, relationships);

    expect(workflow.edges).toEqual(relationships);
  });
});

