import { test, expect } from "@playwright/test";

test.describe("Explorer", () => {
  test("should load and display SST state", async ({ page }) => {
    await page.goto("/");
    
    await expect(page.locator("h1")).toContainText("SST State Visualizer");
  });

  test("should navigate to plugins tab", async ({ page }) => {
    await page.goto("/");
    
    const pluginsTab = page.getByRole("tab", { name: "Plugins" });
    await pluginsTab.click();
    
    await expect(page.getByText("Plugin Marketplace")).toBeVisible();
  });

  test("should display installed plugins", async ({ page }) => {
    await page.goto("/");
    
    const pluginsTab = page.getByRole("tab", { name: "Plugins" });
    await pluginsTab.click();
    
    const installedTab = page.getByRole("tab", { name: "Installed" });
    await installedTab.click();
    
    await expect(page.getByText("Installed Plugins")).toBeVisible();
  });
});

