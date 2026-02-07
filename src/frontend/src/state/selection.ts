import { useState, useEffect } from 'react';

// Week selection utilities
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function useWeekSelection() {
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const stored = localStorage.getItem('selectedWeekStart');
    return stored ? new Date(stored) : getMonday(new Date());
  });

  useEffect(() => {
    localStorage.setItem('selectedWeekStart', weekStart.toISOString());
  }, [weekStart]);

  const weekEnd = addDays(weekStart, 6);

  const goToPreviousWeek = () => {
    setWeekStart(addDays(weekStart, -7));
  };

  const goToNextWeek = () => {
    setWeekStart(addDays(weekStart, 7));
  };

  const formatWeekRange = () => {
    return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
  };

  return {
    weekStart,
    weekEnd,
    goToPreviousWeek,
    goToNextWeek,
    formatWeekRange,
  };
}

// Semester selection utilities
export function useSemesterSelection() {
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>(() => {
    return localStorage.getItem('selectedSemesterId') || '';
  });

  useEffect(() => {
    if (selectedSemesterId) {
      localStorage.setItem('selectedSemesterId', selectedSemesterId);
    } else {
      localStorage.removeItem('selectedSemesterId');
    }
  }, [selectedSemesterId]);

  return {
    selectedSemesterId,
    setSelectedSemesterId,
  };
}
