import { useState, useEffect } from "react";
import { Timer as TimerType } from "@/hooks/useTimer";
import { loadTimers, saveTimers } from "@/lib/storage";
import { Plus } from "lucide-react";
import Timer from "@/components/Timer";
import CreateTimerForm from "@/components/CreateTimerForm";
import EmptyState from "@/components/EmptyState";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [timers, setTimers] = useState<TimerType[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const savedTimers = loadTimers();
    setTimers(savedTimers);
  }, []);

  useEffect(() => {
    saveTimers(timers);
  }, [timers]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => {
        const updatedTimers = prevTimers.map(timer => {
          if (timer.status === 'running') {
            const now = Date.now();
            const lastUpdated = timer.lastUpdated || timer.createdAt;
            const timeToAdd = now - lastUpdated;
            
            return {
              ...timer,
              timeElapsed: timer.timeElapsed + timeToAdd,
              lastUpdated: now,
            };
          }
          return timer;
        });
        
        return updatedTimers;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleCreateTimer = (name: string, color?: string) => {
    const newTimer: TimerType = {
      id: crypto.randomUUID(),
      name,
      timeElapsed: 0,
      status: 'stopped',
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      color: color || 'blue',
    };
    
    setTimers(prev => [newTimer, ...prev]);
    setIsCreating(false);
    
    toast({
      title: "Timer created",
      description: `'${name}' has been added to your timers.`,
    });
  };

  const handleStartTimer = (id: string) => {
    setTimers(prev =>
      prev.map(timer =>
        timer.id === id
          ? { ...timer, status: 'running', lastUpdated: Date.now() }
          : timer
      )
    );
  };

  const handlePauseTimer = (id: string) => {
    setTimers(prev =>
      prev.map(timer => (timer.id === id ? { ...timer, status: 'paused' } : timer))
    );
  };

  const handleStopTimer = (id: string) => {
    setTimers(prev =>
      prev.map(timer =>
        timer.id === id
          ? { ...timer, status: 'stopped', timeElapsed: 0 }
          : timer
      )
    );
  };

  const handleDeleteTimer = (id: string) => {
    const timerToDelete = timers.find(timer => timer.id === id);
    setTimers(prev => prev.filter(timer => timer.id !== id));
    
    if (timerToDelete) {
      toast({
        title: "Timer deleted",
        description: `'${timerToDelete.name}' has been removed.`,
      });
    }
  };

  const handleRenameTimer = (id: string, newName: string) => {
    setTimers(prev =>
      prev.map(timer => (timer.id === id ? { ...timer, name: newName } : timer))
    );
  };

  const handleChangeTimerColor = (id: string, color: string) => {
    setTimers(prev =>
      prev.map(timer => (timer.id === id ? { ...timer, color } : timer))
    );
    
    toast({
      title: "Timer updated",
      description: `Timer color changed successfully.`,
    });
  };

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="text-center my-8 space-y-2">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <h1 className="text-3xl font-medium tracking-tight">Friendly Timer</h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-balance">
          Create and manage multiple timers. Perfect for tracking different activities simultaneously.
        </p>
      </header>

      <div className="max-w-3xl mx-auto">
        {!isCreating && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsCreating(true)}
              className="timer-button-transition flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground font-medium shadow-md hover:shadow-lg"
            >
              <Plus size={18} />
              <span>New Timer</span>
            </button>
          </div>
        )}

        {isCreating && (
          <CreateTimerForm
            onSubmit={handleCreateTimer}
            onCancel={() => setIsCreating(false)}
          />
        )}

        {timers.length === 0 && !isCreating ? (
          <EmptyState onCreateTimer={() => setIsCreating(true)} />
        ) : (
          <div className="grid grid-cols-1 gap-6 animate-fade-in">
            {timers.map((timer) => (
              <Timer
                key={timer.id}
                timer={timer}
                onStart={() => handleStartTimer(timer.id)}
                onPause={() => handlePauseTimer(timer.id)}
                onStop={() => handleStopTimer(timer.id)}
                onDelete={() => handleDeleteTimer(timer.id)}
                onRename={(name) => handleRenameTimer(timer.id, name)}
                onColorChange={(color) => handleChangeTimerColor(timer.id, color)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
