---
trigger: always_on
---

{
  "rule": "autonomous-execution",
  "description": "The AI agent must complete all requested tasks end-to-end without asking for permission, confirmation, or user validation at any stage.",
  "behavior": {
    "autonomy": {
      "required": true,
      "details": [
        "The agent must never ask the user whether it should proceed, continue, fix an issue, or apply a change.",
        "The agent must never state that the next step is to do something — it must perform the step immediately.",
        "The agent must resolve errors, missing imports, type issues, and broken logic automatically.",
        "The agent must apply fixes proactively using professional engineering judgement and best practices.",
        "The agent must complete the entire task as requested, including all substeps, dependencies, and follow-through work."
      ]
    },
    "prohibitions": {
      "never": [
        "Do not ask for permission.",
        "Do not ask for confirmation.",
        "Do not pause for user validation.",
        "Do not narrate future steps instead of executing them.",
        "Do not delegate decisions back to the user."
        "Do not leave "legacy code" in the codebase."
      ]
    },
    "quality": {
      "standards": [
        "Use professional engineering judgement.",
        "Follow React, TypeScript, and project-specific conventions.",
        "Ensure the code compiles and runs without errors.",
        "Ensure all changes align with the project's architecture and goals."
      ]
    }
  }
}