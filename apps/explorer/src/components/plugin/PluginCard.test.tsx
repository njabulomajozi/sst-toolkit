import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PluginCard } from "./PluginCard";
import type { IPluginMetadata } from "~/lib/plugin-loader";

describe("PluginCard", () => {
  const mockPlugin: IPluginMetadata = {
    name: "@sst/example",
    version: "1.0.0",
    description: "Test plugin",
    author: "Test Author",
  };

  it("should render plugin card with name and version", () => {
    render(<PluginCard plugin={mockPlugin} />);
    expect(screen.getByText("@sst/example")).toBeInTheDocument();
    expect(screen.getByText("Version: 1.0.0")).toBeInTheDocument();
  });

  it("should render description when provided", () => {
    render(<PluginCard plugin={mockPlugin} />);
    expect(screen.getByText("Test plugin")).toBeInTheDocument();
  });

  it("should call onInstall when install button is clicked", async () => {
    const onInstall = vi.fn();
    const user = userEvent.setup();
    render(<PluginCard plugin={mockPlugin} onInstall={onInstall} />);
    
    const installButton = screen.getByText("Install");
    await user.click(installButton);
    
    expect(onInstall).toHaveBeenCalledTimes(1);
  });
});

