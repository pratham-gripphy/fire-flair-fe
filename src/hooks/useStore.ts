import { useContext } from 'react';
import { AppContext } from '../context/app-context';

export function useStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useStore must be used within an AppProvider');
  return ctx;
}
