import type { ComponentResource } from "@pulumi/pulumi";

export function validatePulumiType(pulumiType: string): boolean {
  if (!pulumiType.startsWith("sst:")) {
    throw new Error(
      `Invalid Pulumi type format: "${pulumiType}". Must start with "sst:"`
    );
  }

  const parts = pulumiType.split(":");
  if (parts.length !== 3) {
    throw new Error(
      `Invalid Pulumi type format: "${pulumiType}". Expected format: "sst:namespace:Type"`
    );
  }

  const [, namespace, type] = parts;

  if (!namespace || namespace.trim() === "") {
    throw new Error(
      `Invalid Pulumi type format: "${pulumiType}". Namespace cannot be empty`
    );
  }

  if (!type || type.trim() === "") {
    throw new Error(
      `Invalid Pulumi type format: "${pulumiType}". Type cannot be empty`
    );
  }

  return true;
}

export function validateParent(_component: ComponentResource): boolean {
  return true;
}

export function validateOutputs(_component: ComponentResource): boolean {
  return true;
}

interface ILinkable {
  getSSTLink(): { properties: Record<string, unknown> };
}

export function validateLinkable(component: ComponentResource): boolean {
  if (!("getSSTLink" in component)) {
    throw new Error(
      `Component ${component.constructor.name} does not implement Link.Linkable. Missing getSSTLink() method.`
    );
  }

  if (typeof (component as ILinkable).getSSTLink !== "function") {
    throw new Error(
      `Component ${component.constructor.name} has getSSTLink but it's not a function.`
    );
  }

  try {
    const link = (component as ILinkable).getSSTLink();
    if (!link || typeof link !== "object") {
      throw new Error(
        `Component ${component.constructor.name}.getSSTLink() must return a Link.Definition object.`
      );
    }
    if (!("properties" in link)) {
      throw new Error(
        `Component ${component.constructor.name}.getSSTLink() must return an object with a "properties" field.`
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      `Component ${component.constructor.name}.getSSTLink() threw an error: ${String(error)}`
    );
  }

  return true;
}

export function validateComponent(
  component: ComponentResource,
  options: {
    checkPulumiType?: boolean;
    checkParent?: boolean;
    checkOutputs?: boolean;
    checkLinkable?: boolean;
  } = {}
): boolean {
  const {
    checkPulumiType = true,
    checkParent = false,
    checkOutputs = false,
    checkLinkable = false,
  } = options;

  if (checkPulumiType) {
    const constructor = component.constructor as typeof ComponentResource & {
      __pulumiType?: string;
    };
    const pulumiType = constructor.__pulumiType;
    if (pulumiType) {
      validatePulumiType(pulumiType);
    }
  }

  if (checkParent) {
    validateParent(component);
  }

  if (checkOutputs) {
    validateOutputs(component);
  }

  if (checkLinkable) {
    validateLinkable(component);
  }

  return true;
}

