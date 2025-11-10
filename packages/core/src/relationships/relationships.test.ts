import { describe, it, expect } from "vitest";
import * as Relationships from "./relationships";
import type { ISSTResource } from "@sst-toolkit/shared/types/sst";

describe("Relationships", () => {
  describe("parseResourceRelationships", () => {
    it("should detect parent relationships", () => {
      const resources: ISSTResource[] = [
        {
          urn: "urn:pulumi:test::test::sst:aws:Function::parent",
          type: "sst:aws:Function",
          custom: true,
          inputs: {},
          outputs: {},
        },
        {
          urn: "urn:pulumi:test::test::aws:lambda/function:Function::child",
          type: "aws:lambda/function:Function",
          custom: false,
          inputs: {},
          outputs: {},
          parent: "urn:pulumi:test::test::sst:aws:Function::parent",
        },
      ];

      const relationships = Relationships.parseResourceRelationships(resources);
      expect(relationships).toBeDefined();
      expect(relationships.length).toBeGreaterThan(0);
    });

    it("should handle resources without relationships", () => {
      const resources: ISSTResource[] = [
        {
          urn: "urn:pulumi:test::test::aws:s3/bucket:Bucket::test-bucket",
          type: "aws:s3/bucket:Bucket",
          custom: false,
          inputs: {},
          outputs: {},
        },
      ];

      const relationships = Relationships.parseResourceRelationships(resources);
      expect(relationships).toBeDefined();
      expect(Array.isArray(relationships)).toBe(true);
    });
  });
});

