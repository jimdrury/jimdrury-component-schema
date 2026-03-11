# Setup

## Quick start

```bash
# Install dependencies
yarn install

# Preview what would change in your Storyblok space
yarn plan

# Apply changes
yarn apply
```

---

## Environment variables

Create a `.env.local` file (or `.env`) with your Storyblok Management API credentials:

```
STORYBLOK_API_TOKEN=your-management-api-token
STORYBLOK_SPACE_ID=your-space-id
```

Both values are required. The API token must have write access to the space.

---

## Commands

### `yarn plan`

Compares local component definitions against the current state of your Storyblok space and outputs a plan of what would change. Nothing is modified — this is a read-only preview.

```
Discovered 4 local component(s)
Refreshing Storyblok state...

Folder changes:

  + create folder "content"  (known after apply)

Component changes:

  + create component "page"   (known after apply)
  ~ update component "blog"   id: 12345
  - delete component "legacy"  id: 67890

Plan: 2 to create, 1 to update, 1 to delete.
```

| Symbol | Meaning |
|--------|---------|
| `+` | Resource will be **created** in Storyblok. ID is not yet known. |
| `~` | Resource exists remotely and will be **updated** in-place. |
| `-` | Resource exists in Storyblok but **not** locally — it will be **deleted**. |

### `yarn apply`

Runs the same plan, then executes all changes against the Storyblok Management API. Changes are applied in dependency order:

1. Create missing **folders** (shallowest first).
2. Create missing **tags**.
3. **Create** new components and **update** existing ones.
4. **Delete** orphaned components.
5. **Delete** orphaned folders (deepest first).

This repo is the **only source of truth**. Any components or folders that exist in Storyblok but are not defined locally will be deleted.
