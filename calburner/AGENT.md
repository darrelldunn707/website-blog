# calburner/AGENT.md — Daily Calorie Burner rules

## Scope
Only edit these files unless explicitly told otherwise:
- calburner/index.html
- calburner/styles.css
- calburner/app.js

## UX rules
- No database, no login.
- Compute results live as inputs change.
- Also provide an optional "Recalculate" button if asked (not required by default).
- Keep Goal/Target section as a readable equation.

## Data rules
- Activity preset list will be provided by the user later.
- Until then: keep presets minimal and do not invent a long “accurate” list.

## Implementation rules
- Use IDs consistently between HTML and JS.
- Avoid adding duplicate output IDs unless necessary.
- Add temporary console logs only when debugging; remove them after confirmation.