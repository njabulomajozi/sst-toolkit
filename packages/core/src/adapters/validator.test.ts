import { describe, it, expect } from "vitest";
import * as Validator from "./validator";

describe("Validator", () => {
  describe("validatePulumiType", () => {
    it("should validate correct Pulumi type format", () => {
      expect(() => Validator.validatePulumiType("sst:example:MyComponent")).not.toThrow();
    });

    it("should reject types not starting with 'sst:'", () => {
      expect(() => Validator.validatePulumiType("aws:s3/bucket:Bucket")).toThrow();
    });

    it("should reject types with incorrect format", () => {
      expect(() => Validator.validatePulumiType("sst:example")).toThrow();
      expect(() => Validator.validatePulumiType("sst::MyComponent")).toThrow();
      expect(() => Validator.validatePulumiType("sst:example:")).toThrow();
    });
  });
});

