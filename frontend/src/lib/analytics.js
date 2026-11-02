import { isPastDate, isToday } from './utils';

export function calculateProjectProgress(projectId, tasks) {
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  if (projectTasks.length === 0) return { total: 0, completed: 0, percentage: 0 };
  
  const completed = projectTasks.filter(t => t.status === 'Done').length;
  const percentage = Math.round((completed / projectTasks.length) * 100);
  
  return {
    total: projectTasks.length,
    completed,
    percentage
  };
}

export function calculateDashboardMetrics(tasks) {
  const activeTasks = tasks.filter(t => t.status !== 'Done');
  
  // Weekly completed (last 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const completedLast7Days = tasks.filter(t => {
    if (t.status !== 'Done' || !t.completedAt) return false;
    const completedDate = new Date(t.completedAt);
    return completedDate >= sevenDaysAgo;
  });

  // Overdue: status != Done and dueDate < today
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'Done' || !t.dueDate) return false;
    return isPastDate(t.dueDate) && !isToday(t.dueDate);
  });

  // Weekly completion rate: completed tasks in 7 days / (completed in 7 days + current active) * 100
  const totalRelevant = completedLast7Days.length + activeTasks.length;
  const weeklyRate = totalRelevant > 0 
    ? Math.round((completedLast7Days.length / totalRelevant) * 100)
    : 0;

  return {
    activeTasksCount: activeTasks.length,
    completedThisWeekCount: completedLast7Days.length,
    overdueCount: overdueTasks.length,
    weeklyCompletionRate: weeklyRate
  };
}

export function calculateAnalyticsMetrics(tasks, daysRange = 30) {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - daysRange);
  cutoff.setHours(0, 0, 0, 0);

  // Filter tasks within the range (by created, due, or completed)
  // Or all tasks relevant in this window
  const relevantTasks = tasks.filter(t => {
    const d = t.completedAt || t.dueDate;
    if (!d) return true;
    const dt = new Date(d);
    return dt >= cutoff;
  });

  const completedTasks = relevantTasks.filter(t => t.status === 'Done');
  const totalTasks = relevantTasks.length;

  // Completion Rate
  const completionRate = totalTasks > 0 
    ? Math.round((completedTasks.length / totalTasks) * 100) 
    : '—';

  // On-time completion rate: completed on or before dueDate
  const completedWithDue = completedTasks.filter(t => t.dueDate);
  const onTimeTasks = completedWithDue.filter(t => {
    if (!t.completedAt) return true;
    const comp = new Date(t.completedAt);
    const due = new Date(t.dueDate);
    due.setHours(23, 59, 59, 999);
    return comp <= due;
  });

  const onTimeRate = completedWithDue.length > 0 
    ? Math.round((onTimeTasks.length / completedWithDue.length) * 100) 
    : '—';

  // Average task completion time in minutes (actualMinutes)
  const completedWithDuration = completedTasks.filter(t => typeof t.actualMinutes === 'number' && t.actualMinutes > 0);
  const totalMinutes = completedWithDuration.reduce((acc, t) => acc + t.actualMinutes, 0);
  const avgMinutes = completedWithDuration.length > 0 
    ? Math.round(totalMinutes / completedWithDuration.length) 
    : '—';

  return {
    tasksCompleted: completedTasks.length,
    completionRate,
    onTimeRate,
    avgCompletionMinutes: avgMinutes,
    totalTasks
  };
}

export function generateProductivityTrend(tasks, daysRange = 30) {
  const points = [];
  const now = new Date();

  // Create buckets (e.g., 7 days = daily, 30 days = 5-day intervals or daily)
  const step = daysRange === 7 ? 1 : daysRange === 30 ? 3 : 7;
  const numBuckets = Math.floor(daysRange / step);

  for (let i = numBuckets - 1; i >= 0; i--) {
    const bucketEnd = new Date(now);
    bucketEnd.setDate(now.getDate() - (i * step));
    const bucketStart = new Date(bucketEnd);
    bucketStart.setDate(bucketEnd.getDate() - step);

    const label = bucketEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const completedCount = tasks.filter(t => {
      if (t.status !== 'Done' || !t.completedAt) return false;
      const d = new Date(t.completedAt);
      return d > bucketStart && d <= bucketEnd;
    }).length;

    points.push({
      date: label,
      completed: completedCount
    });
  }

  return points;
}

export function generateDailyCompletedChart(tasks) {
  // Last 7 days daily counts
  const result = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dayName = daysOfWeek[d.getDay()];
    const dateStr = d.toISOString().split('T')[0];

    const count = tasks.filter(t => {
      return t.status === 'Done' && t.completedAt === dateStr;
    }).length;

    result.push({
      day: dayName,
      date: dateStr,
      completed: count
    });
  }

  return result;
}

export function generateEstimatedVsActual(tasks) {
  // Return top 6 tasks with both estimated and actual
  return tasks
    .filter(t => t.estimatedMinutes > 0 && t.actualMinutes > 0)
    .slice(0, 6)
    .map(t => ({
      name: t.title.length > 20 ? t.title.slice(0, 18) + '...' : t.title,
      estimated: Math.round(t.estimatedMinutes / 60 * 10) / 10,
      actual: Math.round(t.actualMinutes / 60 * 10) / 10
    }));
}

export function getEfficiencyInsights(tasks) {
  const insights = [];

  // Overdue count
  const overdue = tasks.filter(t => t.status !== 'Done' && t.dueDate && isPastDate(t.dueDate) && !isToday(t.dueDate));
  if (overdue.length > 0) {
    insights.push({
      type: 'warning',
      text: `You have ${overdue.length} overdue task${overdue.length > 1 ? 's' : ''} needing attention.`
    });
  } else {
    insights.push({
      type: 'success',
      text: 'All your pending tasks are currently on schedule.'
    });
  }

  // Duration variance
  const longerThanEstimated = tasks.filter(t => t.actualMinutes > t.estimatedMinutes && t.estimatedMinutes > 0);
  if (longerThanEstimated.length > 0) {
    insights.push({
      type: 'info',
      text: `${longerThanEstimated.length} task${longerThanEstimated.length > 1 ? 's' : ''} took longer than initially planned. Consider adding buffer time to estimates.`
    });
  }

  // Most productive day
  const dailyCounts = {};
  tasks.filter(t => t.status === 'Done' && t.completedAt).forEach(t => {
    const day = new Date(t.completedAt).toLocaleDateString('en-US', { weekday: 'long' });
    dailyCounts[day] = (dailyCounts[day] || 0) + 1;
  });

  const bestDay = Object.entries(dailyCounts).sort((a, b) => b[1] - a[1])[0];
  if (bestDay && bestDay[1] > 0) {
    insights.push({
      type: 'positive',
      text: `${bestDay[0]} is your most productive day with ${bestDay[1]} task completions recorded.`
    });
  }

  return insights;
}

