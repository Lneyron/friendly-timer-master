
import { Clock } from "lucide-react";

interface EmptyStateProps {
  onCreateTimer: () => void;
}

const EmptyState = ({ onCreateTimer }: EmptyStateProps) => {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center p-8 my-12 glass rounded-2xl">
      <div className="mb-6 p-6 rounded-full bg-primary/10 text-primary">
        <Clock size={40} strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-medium mb-2 text-center">No timers yet</h2>
      <p className="text-muted-foreground mb-6 text-center max-w-md text-balance">
        Create your first timer to get started. You can create multiple timers and run them simultaneously.
      </p>
      <button
        onClick={onCreateTimer}
        className="timer-button-transition px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-lg hover:shadow-xl"
      >
        Create a timer
      </button>
    </div>
  );
};

export default EmptyState;
