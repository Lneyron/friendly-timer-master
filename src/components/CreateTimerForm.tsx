
import { useState } from "react";
import { Timer, Clock } from "lucide-react";

interface CreateTimerFormProps {
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

const CreateTimerForm = ({ onSubmit, onCancel }: CreateTimerFormProps) => {
  const [timerName, setTimerName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timerName.trim()) {
      onSubmit(timerName.trim());
      setTimerName("");
    }
  };

  return (
    <div className="animate-scale glass rounded-2xl p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={20} className="text-primary" />
          <h3 className="text-lg font-medium">Create New Timer</h3>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="timer-name" className="text-sm font-medium text-muted-foreground">
            Timer Name
          </label>
          <input
            id="timer-name"
            type="text"
            placeholder="e.g., Workout Timer"
            value={timerName}
            onChange={(e) => setTimerName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            autoFocus
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="timer-button-transition px-4 py-2 rounded-xl border bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!timerName.trim()}
            className="timer-button-transition px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Timer
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTimerForm;
