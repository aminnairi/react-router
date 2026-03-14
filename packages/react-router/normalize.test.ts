import { describe, it, expect } from "vitest";
import { normalize } from "./index";

describe("normalize", () => {
  it("should trim whitespace from the URI", () => {
    expect(normalize("  /users  ")).toBe("users");
  });

  it("should replace multiple slashes with a single slash", () => {
    expect(normalize("users//profile")).toBe("users/profile");
    expect(normalize("users///profile")).toBe("users/profile");
  });

  it("should remove leading slashes", () => {
    expect(normalize("/users")).toBe("users");
    expect(normalize("//users")).toBe("users");
  });

  it("should remove trailing slashes", () => {
    expect(normalize("users/")).toBe("users");
    expect(normalize("users//")).toBe("users");
  });

  it("should remove both leading and trailing slashes", () => {
    expect(normalize("/users/")).toBe("users");
    expect(normalize("//users//")).toBe("users");
  });

  it("should preserve case-sensitivity in dynamic segments", () => {
    expect(normalize("/users/:userIdentifier")).toBe("users/:userIdentifier");
    expect(normalize("/users/:UserId")).toBe("users/:UserId");
    expect(normalize("/users/:ABC123")).toBe("users/:ABC123");
  });

  it("should handle empty strings", () => {
    expect(normalize("")).toBe("");
  });

  it("should handle paths with multiple segments", () => {
    expect(normalize("/users/123/posts/456")).toBe("users/123/posts/456");
  });
});
