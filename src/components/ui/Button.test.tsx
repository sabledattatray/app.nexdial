import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button UI Component", () => {
  it("renders correctly with default props", () => {
    render(<Button>Click Me</Button>);
    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn).toBeDefined();
    expect(btn.getAttribute("disabled")).toBeNull();
  });

  it("handles disabled state correctly", () => {
    render(<Button disabled>Disabled Button</Button>);
    const btn = screen.getByRole("button", { name: /disabled button/i });
    expect(btn.hasAttribute("disabled")).toBe(true);
  });

  it("handles loading state with aria-busy", () => {
    render(<Button isLoading>Loading Action</Button>);
    const btn = screen.getByRole("button", { name: /loading action/i });
    expect(btn.getAttribute("aria-busy")).toBe("true");
    expect(btn.hasAttribute("disabled")).toBe(true);
  });
});
