'use client';
import { QrCode, RotateCcw, Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Timer } from './Timer';
import { useSettingsStore } from '@/stores/settingsStore';

interface HeaderProps {
  onReset: () => void;
  onScanQR: () => void;
}

export function Header({ onReset, onScanQR }: HeaderProps) {
  const { theme, setTheme } = useSettingsStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-br from-slate-900 to-blue-700 text-white shadow-xl">
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <Image src="/bustech-logo.svg" alt="BusTech Engineering" width={176} height={44} className="h-11 w-auto" priority />
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-blue-200 hover:bg-white/10 w-8 h-8"
            onClick={onScanQR}
            title="Scan QR"
          >
            <QrCode className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-blue-200 hover:bg-white/10 w-8 h-8"
            onClick={onReset}
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-blue-200 hover:bg-white/10 w-8 h-8"
            onClick={toggleTheme}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 pb-3 text-sm">
        <span className="text-blue-200 text-xs">Chassis Level-2 · Grouped Inspection</span>
        <Timer />
      </div>
    </header>
  );
}
