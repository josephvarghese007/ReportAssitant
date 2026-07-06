'use client';
import { Pause, Play, RotateCcw, Timer as TimerIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTimer } from '@/hooks/useTimer';
import { formatTime, cn } from '@/lib/utils';

export function Timer() {
  const { secondsLeft, isRunning, toggle, reset } = useTimer(7200);

  const urgent = secondsLeft <= 900 && secondsLeft > 0;
  const expired = secondsLeft <= 0;

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-mono',
        expired ? 'bg-red-500/30 text-red-200' : urgent ? 'bg-amber-500/30 text-amber-200' : 'bg-white/10 text-white'
      )}
    >
      <TimerIcon className="w-3 h-3" />
      <span className="tabular-nums min-w-[4.5rem] text-center">{formatTime(secondsLeft)}</span>
      <Button variant="ghost" size="icon" className="w-5 h-5 text-current hover:bg-white/10" onClick={toggle}>
        {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
      </Button>
      <Button variant="ghost" size="icon" className="w-5 h-5 text-current hover:bg-white/10" onClick={reset}>
        <RotateCcw className="w-3 h-3" />
      </Button>
    </div>
  );
}
