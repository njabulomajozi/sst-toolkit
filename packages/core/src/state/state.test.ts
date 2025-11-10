import { describe, it, expect } from "vitest";
import * as State from "./state";
import type { ISSTState, ISSTResource } from "@sst-toolkit/shared/types/sst";

describe("State", () => {
  describe("parseState", () => {
    it("should parse valid SST state", () => {
      const mockState: ISSTState = {
        stack: "test-stack",
        latest: {
          manifest: {
            version: "1.0.0",
            time: new Date().toISOString(),
            magic: "magic-value",
          },
          secrets_providers: {
            type: "passphrase",
            state: {
              salt: "salt-value",
            },
          },
          resources: [
            {
              urn: "urn:pulumi:test::test::aws:s3/bucket:Bucket::test-bucket",
              type: "aws:s3/bucket:Bucket",
              custom: false,
              inputs: {},
              outputs: {
                bucket: "test-bucket",
              },
            },
          ],
        },
      };

      const result = State.parseState(mockState);
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].resource.urn).toBe(mockState.latest.resources[0].urn);
    });

    it("should handle empty resources", () => {
      const mockState: ISSTState = {
        stack: "test-stack",
        latest: {
          manifest: {
            version: "1.0.0",
            time: new Date().toISOString(),
            magic: "magic-value",
          },
          secrets_providers: {
            type: "passphrase",
            state: {
              salt: "salt-value",
            },
          },
          resources: [],
        },
      };

      const result = State.parseState(mockState);
      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });
  });

  describe("getResourceName", () => {
    it("should extract resource name from URN", () => {
      const resource: ISSTResource = {
        urn: "urn:pulumi:test::test::aws:s3/bucket:Bucket::test-bucket",
        type: "aws:s3/bucket:Bucket",
        custom: false,
        inputs: {},
        outputs: {},
      };

      const name = State.getResourceName(resource);
      expect(name).toBe("test-bucket");
    });
  });

  describe("getResourceTypeCategory", () => {
    it("should categorize AWS resources", () => {
      const resource: ISSTResource = {
        urn: "urn:pulumi:test::test::aws:s3/bucket:Bucket::test-bucket",
        type: "aws:s3/bucket:Bucket",
        custom: false,
        inputs: {},
        outputs: {},
      };

      const category = State.getResourceTypeCategory(resource.type, resource);
      expect(category).toBeDefined();
      expect(typeof category).toBe("string");
    });
  });
});

