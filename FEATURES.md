# Panini — Feature Tracker

This file tracks all planned, in-progress, and completed features.
Codex agents: treat each item as a discrete task. Status markers are `[ ]` (todo), `[~]` (in progress), `[x]` (done).

---

## Infrastructure & Setup

- [ ] npm workspaces monorepo scaffold (server + client)
- [ ] Prisma schema (Board, Column, Card, Label, Comment, User)
- [ ] MySQL database setup + initial migration
- [ ] `.env.example` with all required variables
- [ ] Root `npm run dev` script (concurrent server + client)
- [ ] Root `npm run build` script
- [ ] EC2 deployment notes (README)

---

## Auth

- [ ] User model (single-user local auth)
- [ ] POST /api/auth/register — create account
- [ ] POST /api/auth/login — password login, set session cookie
- [ ] POST /api/auth/logout
- [ ] GET /api/auth/me — return current session user
- [ ] Auth middleware — guard all non-auth routes
- [ ] Login page (React)
- [ ] Redirect to login if unauthenticated

---

## Boards

- [ ] GET /api/boards — list all boards
- [ ] POST /api/boards — create board
- [ ] GET /api/boards/:id — get board with columns + cards
- [ ] PATCH /api/boards/:id — rename, change color
- [ ] DELETE /api/boards/:id — delete board (cascades)
- [ ] Board list page (React)
- [ ] Create board modal
- [ ] Board background color picker

---

## Columns

- [ ] POST /api/boards/:id/columns — add column
- [ ] PATCH /api/columns/:id — rename column
- [ ] DELETE /api/columns/:id — delete column (cascades)
- [ ] PATCH /api/columns/:id/reorder — update column sort order
- [ ] Column drag-and-drop reordering (React + dnd-kit)
- [ ] Add column UI button
- [ ] Inline column rename

---

## Cards

- [ ] POST /api/columns/:id/cards — create card
- [ ] GET /api/cards/:id — get card detail
- [ ] PATCH /api/cards/:id — update title, description, due date, assignee
- [ ] DELETE /api/cards/:id — delete card
- [ ] PATCH /api/cards/:id/move — move card to different column + position
- [ ] PATCH /api/cards/:id/archive — soft-delete (archive)
- [ ] Card drag-and-drop between columns (React + dnd-kit)
- [ ] Card reordering within a column
- [ ] Card detail modal (title, description, labels, due date, comments)
- [ ] Markdown support in card description
- [ ] Due date picker
- [ ] Due date badge (overdue highlight)

---

## Labels

- [ ] GET /api/boards/:id/labels — list labels for a board
- [ ] POST /api/boards/:id/labels — create label (name + color)
- [ ] DELETE /api/labels/:id — delete label
- [ ] POST /api/cards/:id/labels — attach label to card
- [ ] DELETE /api/cards/:id/labels/:labelId — detach label
- [ ] Label picker in card modal
- [ ] Label color chips on card previews

---

## Comments & Activity

- [ ] GET /api/cards/:id/comments — list comments
- [ ] POST /api/cards/:id/comments — add comment
- [ ] DELETE /api/comments/:id — delete comment
- [ ] Activity log model — record card moves, edits, creations
- [ ] Activity feed in card detail modal

---

## Search

- [ ] GET /api/search?q= — search cards by title across all boards
- [ ] Search bar in top nav (React)
- [ ] Search results dropdown with board + column context

---

## UI / UX Polish

- [ ] Responsive layout (works on tablet)
- [ ] Loading skeletons for board view
- [ ] Toast notifications (success/error)
- [ ] Keyboard shortcut: N to add card in focused column
- [ ] Keyboard shortcut: Escape to close modal
- [ ] Empty state illustrations for boards list + empty columns
- [ ] Dark mode toggle

---

## Completed

_Nothing yet — development starting now._
