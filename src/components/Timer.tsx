import { useState } from "react";
import { Play, Pause, Square, Trash2, Edit } from "lucide-react";
import { Timer as TimerType, formatTime } from "@/hooks/useTimer";

interface TimerProps {
  timer: TimerType;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onDelete: () => void;
  onRename: (name: string) => void;
}

const Timer = ({
  timer,
  onStart,
  onPause,
  onStop,
  onDelete,
  onRename,
}: TimerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(timer.name);

  const handleRename = () => {
    if (newName.trim() !== timer.name && newName.trim() !== "") {
      onRename(newName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setNewName(timer.name);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`timer-card-transition glass rounded-2xl p-6 ${
        timer.status === "running" ? "border-primary/20" : ""
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
        {isEditing ? (
          <div className="flex w-full">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              autoFocus
              className="text-lg font-medium bg-white/50 px-3 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 w-full"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">{timer.name}</h3>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary/80 transition-colors"
              aria-label="Edit timer name"
            >
              <Edit size={14} />
            </button>
          </div>
        )}
        <div className="flex items-center">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              timer.status === "running"
                ? "bg-green-100 text-green-800 animate-pulse-light"
                : timer.status === "paused"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {timer.status === "running"
              ? "Running"
              : timer.status === "paused"
              ? "Paused"
              : "Stopped"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center my-6">
        <div className="timer-digit text-4xl md:text-5xl font-light tracking-tight">
          {formatTime(timer.timeElapsed)}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        {timer.status === "running" ? (
          <button
            onClick={onPause}
            className="timer-button-transition flex items-center justify-center p-3 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            aria-label="Pause timer"
          >
            <Pause size={20} />
          </button>
        ) : (
          <button
            onClick={onStart}
            className="timer-button-transition flex items-center justify-center p-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
            aria-label="Start timer"
          >
            <Play size={20} />
          </button>
        )}

        <button
          onClick={onStop}
          className="timer-button-transition flex items-center justify-center p-3 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          aria-label="Stop timer"
        >
          <Square size={20} />
        </button>

        <button
          onClick={onDelete}
          className="timer-button-transition flex items-center justify-center p-3 rounded-full bg-secondary hover:bg-destructive hover:text-destructive-foreground text-secondary-foreground"
          aria-label="Delete timer"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default Timer;
