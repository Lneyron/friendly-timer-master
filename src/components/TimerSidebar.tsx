
import { useState } from "react";
import { Timer as TimerType, formatTime } from "@/hooks/useTimer";
import { Check, Clock, ListX, Clock4, Archive, ArchiveX, ExternalLink } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface TimerSidebarProps {
  timers: TimerType[];
  onArchiveTimer: (id: string) => void;
  onUnarchiveTimer: (id: string) => void;
}

const TimerSidebar = ({ timers, onArchiveTimer, onUnarchiveTimer }: TimerSidebarProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const activeTimers = timers.filter(timer => !timer.archived);
  const archivedTimers = timers.filter(timer => timer.archived);

  const handleArchive = (id: string, name: string) => {
    onArchiveTimer(id);
    toast({
      title: "Timer archived",
      description: `"${name}" has been moved to archives.`,
    });
  };

  const handleUnarchive = (id: string, name: string) => {
    onUnarchiveTimer(id);
    toast({
      title: "Timer unarchived",
      description: `"${name}" has been restored.`,
    });
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-green-500 hover:bg-green-600">Running</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Paused</Badge>;
      case 'stopped':
        return <Badge className="bg-gray-500 hover:bg-gray-600">Stopped</Badge>;
      default:
        return null;
    }
  };

  const renderTimerRow = (timer: TimerType, archived: boolean) => (
    <TableRow key={timer.id}>
      <TableCell className="py-2 pl-0">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: timer.color || 'blue' }}
          />
          <span className="font-medium truncate max-w-[120px]">{timer.name}</span>
        </div>
      </TableCell>
      <TableCell className="py-2">{formatTime(timer.timeElapsed)}</TableCell>
      <TableCell className="py-2">{renderStatusBadge(timer.status)}</TableCell>
      <TableCell className="py-2 pr-0">
        <div className="flex justify-end gap-1">
          {timer.jiraTaskId && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              asChild
              title={`Open Jira task: ${timer.jiraTaskId}`}
            >
              <a href={timer.jiraTaskUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
          {archived ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => handleUnarchive(timer.id, timer.name)}
              title="Unarchive timer"
            >
              <ArchiveX className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => handleArchive(timer.id, timer.name)}
              title="Archive timer"
            >
              <Archive className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2 fixed bottom-4 right-4 shadow-md z-10"
        onClick={() => setOpen(true)}
      >
        <Clock className="h-4 w-4" />
        <span>Timers</span>
        {activeTimers.length > 0 && (
          <Badge className="ml-1">{activeTimers.length}</Badge>
        )}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle>Timer Dashboard</SheetTitle>
          </SheetHeader>
          
          <Tabs defaultValue="active" className="mt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active" className="flex gap-2 items-center">
                <Clock className="h-4 w-4" />
                <span>Active</span>
                {activeTimers.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{activeTimers.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="archived" className="flex gap-2 items-center">
                <Archive className="h-4 w-4" />
                <span>Archived</span>
                {archivedTimers.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{archivedTimers.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-4">
              {activeTimers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Clock4 className="h-12 w-12 mb-2 opacity-20" />
                  <p>No active timers</p>
                  <p className="text-sm mt-1">
                    All your active timers will appear here
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-0">Name</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right pr-0">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeTimers.map(timer => renderTimerRow(timer, false))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="archived" className="mt-4">
              {archivedTimers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <ListX className="h-12 w-12 mb-2 opacity-20" />
                  <p>No archived timers</p>
                  <p className="text-sm mt-1">
                    Archived timers will appear here
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-0">Name</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right pr-0">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {archivedTimers.map(timer => renderTimerRow(timer, true))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default TimerSidebar;
