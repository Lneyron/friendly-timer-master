
import { useState } from "react";
import { Play, Pause, Square, Trash2, Edit, Palette } from "lucide-react";
import { Timer as TimerType, formatTime } from "@/hooks/useTimer";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface TimerProps {
  timer: TimerType;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onDelete: () => void;
  onRename: (name: string) => void;
  onColorChange: (color: string) => void;
}

const TIMER_COLORS = [
  { value: "blue", bgClass: "bg-blue-500", hoverClass: "hover:bg-blue-600" },
  { value: "green", bgClass: "bg-green-500", hoverClass: "hover:bg-green-600" },
  { value: "purple", bgClass: "bg-purple-500", hoverClass: "hover:bg-purple-600" },
  { value: "pink", bgClass: "bg-pink-500", hoverClass: "hover:bg-pink-600" },
  { value: "amber", bgClass: "bg-amber-500", hoverClass: "hover:bg-amber-600" },
  { value: "teal", bgClass: "bg-teal-500", hoverClass: "hover:bg-teal-600" },
];

const getColorClasses = (colorName: string = "blue") => {
  const colorConfig = TIMER_COLORS.find(c => c.value === colorName) || TIMER_COLORS[0];
  return {
    bgClass: colorConfig.bgClass,
    hoverClass: colorConfig.hoverClass,
  };
};

const Timer = ({
  timer,
  onStart,
  onPause,
  onStop,
  onDelete,
  onRename,
  onColorChange,
}: TimerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(timer.name);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const { bgClass, hoverClass } = getColorClasses(timer.color);

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
        timer.status === "running" ? `border-${timer.color || 'primary'}/20` : ""
      }`}
      style={{
        borderColor: timer.status === "running" ? `var(--${timer.color || 'primary'})` : undefined,
        opacity: 1
      }}
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
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary/80 transition-colors"
              aria-label="Change timer color"
            >
              <Palette size={14} />
            </button>
          </div>
        )}
        <div className="flex items-center">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              timer.status === "running"
                ? `bg-${timer.color || 'green'}-100 text-${timer.color || 'green'}-800 animate-pulse-light`
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

      {showColorPicker && (
        <div className="mb-4 bg-white/10 p-3 rounded-xl animate-fade-in">
          <div className="flex flex-wrap justify-center gap-2">
            <ToggleGroup type="single" value={timer.color || "blue"} onValueChange={(value) => {
              if (value) onColorChange(value);
              setShowColorPicker(false);
            }}>
              {TIMER_COLORS.map((color) => (
                <ToggleGroupItem
                  key={color.value}
                  value={color.value}
                  aria-label={`Set timer color to ${color.value}`}
                  className={`${color.bgClass} text-white h-8 w-8 p-0 rounded-full`}
                />
              ))}
            </ToggleGroup>
          </div>
        </div>
      )}

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
            className={`timer-button-transition flex items-center justify-center p-3 rounded-full ${bgClass} ${hoverClass} text-white`}
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
