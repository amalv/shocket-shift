# Design System

## Scope
The first Storybook pass focuses on the real UI already present in the game shell:
- shell layout
- control buttons
- stat cards
- status banner
- board surface container

The puzzle engine, board-state transitions, and input loop stay outside the design-system boundary.

## Principles
- Use semantic tokens for surfaces, text, and accents.
- Keep component APIs narrow and purposeful.
- Prefer real game UI over invented example components.
- Let Storybook and code act as the source of truth for shipped behavior.
- Use Figma and Figma Make for exploration, motion studies, and communication, not for runtime ownership.

## Material Influence
The system borrows from Material-style thinking in a lightweight way:
- surfaces are layered intentionally
- stateful components expose clear variants
- layout primitives are documented as reusable building blocks
- elevation, emphasis, and readable spacing matter more than literal visual mimicry