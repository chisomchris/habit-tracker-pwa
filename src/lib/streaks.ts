export function calculateCurrentStreak(
  completions: string[],
  today?: string,
): number {
  if (!completions || completions.length === 0) return 0;
  const _today = today || new Date().toISOString().split("T")[0];
  const uniqueDates = Array.from(new Set(completions)).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );
  if (!uniqueDates.includes(_today)) {
    return 0;
  }
  let streak = 0;
  let currentDate = new Date(_today);
  for (let i = 0; i < uniqueDates.length; i++) {
    const dateString = currentDate.toISOString().split("T")[0];
    if (uniqueDates.includes(dateString)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
