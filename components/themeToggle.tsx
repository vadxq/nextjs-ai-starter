'use client';

import { Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { Button } from '~/components/ui/button';
import { useTheme } from '~/components/provider/themeProvider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { theme: currentTheme, setTheme, resolvedTheme } = useTheme();
  // 用 useSyncExternalStore 实现“是否已水合”标记，避免在 effect 里同步 setState
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <Button variant="outline" size="icon">
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {resolvedTheme === 'dark' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>Light {currentTheme === 'light' && '✓'}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark {currentTheme === 'dark' && '✓'}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>System {currentTheme === 'system' && '✓'}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
