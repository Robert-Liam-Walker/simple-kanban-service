export interface User {
  id: number;
  username: string;
}

export interface Label {
  id: number;
  name: string;
  color: string;
  boardId: number;
}

export interface CardLabel {
  label: Label;
}

export interface Activity {
  id: number;
  action: string;
  detail: string | null;
  createdAt: string;
}

export interface Comment {
  id: number;
  body: string;
  createdAt: string;
  user: { id: number; username: string };
}

export interface Card {
  id: number;
  title: string;
  description: string | null;
  position: number;
  dueDate: string | null;
  priority: "LOW" | "MED" | "HIGH" | null;
  archived: boolean;
  columnId: number;
  labels: CardLabel[];
  comments?: Comment[];
  activity?: Activity[];
}

export interface Column {
  id: number;
  title: string;
  position: number;
  boardId: number;
  cards: Card[];
}

export interface Board {
  id: number;
  title: string;
  color: string;
  columns: Column[];
  labels: Label[];
}

export interface BoardSummary {
  id: number;
  title: string;
  color: string;
  _count: { columns: number };
}
