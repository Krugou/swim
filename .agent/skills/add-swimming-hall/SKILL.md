# Skill: Add Swimming Hall

Use this skill when the user asks to "add a new swimming hall" or "update swimming hall data".

## Steps

1. Open `lib/swimming-halls-data.ts`.
2. Define the new `SwimmingHall` object:
   - `swimmingHallName`: The display name of the hall.
   - `latitude` and `longitude`: Geo-coordinates for the hall.
   - `relatedLinks`: Array of `RelatedLink` objects containing:
     - `relatedLinkName`: Name of the resource (e.g., "Terapia-allas", "Kuntosali").
     - `url`: The resource ID(s) from Espoo's booking system. Separate multiple IDs with commas.
3. Append the new object to the `swimmingHallData` array.
4. If there are new UI strings (like the name of the hall), add them to `/messages/en.json`, `/messages/fi.json`, and `/messages/sv.json`.

## Guidelines

- Resource IDs can be found by inspecting the Espoo booking site or provided by the user.
- Always verify that the types match the `SwimmingHall` interface.
