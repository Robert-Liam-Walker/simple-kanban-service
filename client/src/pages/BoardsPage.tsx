import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { BoardSummary, User } from "../api/types";

const BOARD_COLORS = [
  "#0052cc", "#00875a", "#de350b", "#6554c0", "#ff8b00",
  "#0065ff", "#36b37e", "#ff5630", "#8777d9", "#ff7452",
];

interface Props {
  user: User;
  onLogout: () => void;
}

export default function BoardsPage({ user, onLogout }: Props) {
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState(BOARD_COLORS[0]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get<BoardSummary[]>("/boards").then(setBoards);
  }, []);

  const createBoard = async () => {
    if (!newTitle.trim()) return;
    const board = await api.post<BoardSummary>("/boards", { title: newTitle.trim(), color: newColor });
    setBoards((prev) => [...prev, board]);
    setNewTitle("");
    setNewColor(BOARD_COLORS[0]);
    setCreating(false);
    navigate(`/boards/${board.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <span className="font-bold text-lg text-gray-900">Panini</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.username}</span>
          <button
            onClick={onLogout}
            className="text-sm text-gray-500 hover:text-gray-800 transition"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Your Boards</h2>
          <button
            onClick={() => setCreating(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            + New Board
          </button>
        </div>

        {/* Board grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {boards.map((b) => (
            <button
              key={b.id}
              onClick={() => navigate(`/boards/${b.id}`)}
              className="rounded-xl h-24 p-3 text-left text-white font-semibold shadow hover:opacity-90 transition relative overflow-hidden"
              style={{ backgroundColor: b.color }}
            >
              <span className="block truncate">{b.title}</span>
              <span className="absolute bottom-2 right-3 text-xs opacity-70">
                {b._count.columns} columns
              </span>
            </button>
          ))}
          {boards.length === 0 && (
            <p className="col-span-4 text-gray-400 text-sm">No boards yet. Create one to get started.</p>
          )}
        </div>
      </div>

      {/* Create Board Modal */}
      {creating && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80">
            <h3 className="font-semibold text-gray-800 mb-4">New Board</h3>
            <input
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Board title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createBoard()}
            />
            <div className="flex flex-wrap gap-2 mb-4">
              {BOARD_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition ${
                    newColor === c ? "border-gray-800 scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={createBoard}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition"
              >
                Create
              </button>
              <button
                onClick={() => { setCreating(false); setNewTitle(""); }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
