# Panini — Feature Tracker

This file tracks all planned, in-progress, and completed features.
Codex agents: treat each item as a discrete task. Status markers are `[ ]` (todo), `[~]` (in progress), `[x]` (done).

---

## Infrastructure & Setup

- [x] npm workspaces monorepo scaffold (server + client)
- [x] Prisma schema (Board, Column, Card, Label, Comment, User, Activity, CardLabel)
- [x] MySQL database setup + initial migration (all tables created)
- [x] `.env.example` with all required variables
- [x] Root `npm run dev` script (concurrent server + client)
- [x] Root `npm run build` script
- [x] EC2 deployment notes (README)

---

## Auth

- [x] User model (single-user local auth, bcrypt passwords)
- [x] POST /api/auth/register — create account
- [x] POST /api/auth/login — password login, set session cookie
- [x] POST /api/auth/logout
- [x] GET /api/auth/me — return current session user
- [x] Auth middleware — guard all non-auth routes
- [x] Login page (React) — login + register tabs, light mode
- [x] Redirect to login if unauthenticated

---

## Boards

- [x] GET /api/boards — list all boards
- [x] POST /api/boards — create board (with default To Do / In Progress / Done columns)
- [x] GET /api/boards/:id — get board with columns + cards
- [x] PATCH /api/boards/:id — rename, change color
- [x] DELETE /api/boards/:id — delete board (cascades)
- [x] Board list page (React) — grid of color tiles
- [x] Create board modal with color picker (10 preset colors)
- [x] Board background color picker

---

## Columns

- [x] POST /api/boards/:id/columns — add column
- [x] PATCH /api/columns/:id — rename column
- [x] DELETE /api/columns/:id — delete column (cascades)
- [x] PATCH /api/columns/:id/reorder — update column sort order
- [x] Column drag-and-drop reordering (React + dnd-kit)
- [x] Add column UI button (inline form)
- [x] Inline column rename (double-click header)

---

## Cards

- [x] POST /api/columns/:id/cards — create card
- [x] GET /api/cards/:id — get card detail (with labels, comments, activity)
- [x] PATCH /api/cards/:id — update title, description, due date
- [x] DELETE /api/cards/:id — delete card
- [x] PATCH /api/cards/:id/move — move card to different column + position
- [x] PATCH /api/cards/:id/archive — soft-delete (archive)
- [x] Card drag-and-drop between columns (React + dnd-kit, DragOverlay)
- [x] Card reordering within a column
- [x] Card detail modal (title, description, labels, due date, comments)
- [ ] Markdown support in card description (render markdown preview)
- [x] Due date picker
- [x] Due date badge (overdue highlight — red if past due)

---

## Labels

- [x] GET /api/boards/:id/labels — list labels for a board
- [x] POST /api/boards/:id/labels — create label (name + color)
- [x] DELETE /api/labels/:id — delete label
- [x] POST /api/cards/:id/labels — attach label to card
- [x] DELETE /api/cards/:id/labels/:labelId — detach label
- [x] Label picker in card modal (toggle active labels)
- [x] Label color chips on card previews
- [ ] Create label UI in board view (currently labels must be created via API)

---

## Comments & Activity

- [x] GET /api/cards/:id/comments — list comments
- [x] POST /api/cards/:id/comments — add comment (Cmd+Enter shortcut)
- [x] DELETE /api/comments/:id — delete own comment
- [x] Activity log model — records card moves, edits, creations
- [ ] Activity feed display in card modal (model exists, not rendered yet)

---

## Search

- [x] GET /api/search?q= — search cards by title across all boards
- [x] Search bar in board view (React) — inline column filtering
- [ ] Global search bar in boards list page
- [ ] Search results dropdown with board + column context (currently filters inline)

---

## UI / UX Polish

- [x] Light mode (no dark mode) — clean gray/white palette, blue accents
- [ ] Responsive layout (works on tablet)
- [ ] Loading skeletons for board view
- [ ] Toast notifications (success/error)
- [ ] Keyboard shortcut: N to add card in focused column
- [x] Keyboard shortcut: Escape to close modal
- [ ] Empty state for boards list (placeholder text exists, needs illustration)
- [ ] Create label UI in board/card modal
- [ ] Archived cards view

---

## Completed Summary

All backend routes are implemented and TypeScript-clean. All frontend pages and components are implemented:
- `LoginPage.tsx` — auth
- `BoardsPage.tsx` — board list + create modal
- `BoardPage.tsx` — full board with columns, cards, drag-and-drop, inline search
- `CardModal.tsx` — card detail, labels, comments, due date, archive

**Remaining work (next session):**
1. Create label UI in board/card modal (currently labels are API-only)
2. Markdown render in card description
3. Activity feed display in card modal
4. Toast notifications
5. Archived cards view
6. Global search dropdown
7. Loading skeletons / empty state polish
