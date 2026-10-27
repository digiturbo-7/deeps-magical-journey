import { db } from '../db';

export async function exportAllUserData(): Promise<void> {
  const profile = await db.profiles.toArray();
  const preferences = await db.preferences.toArray();
  const foodLogs = await db.foodLogs.toArray();
  const activityLogs = await db.activityLogs.toArray();
  const menstrualLogs = await db.menstrualLogs.toArray();
  const moodLogs = await db.moodLogs.toArray();
  const hydrationLogs = await db.hydrationLogs.toArray();
  const sleepLogs = await db.sleepLogs.toArray();
  const nonScaleWins = await db.nonScaleWins.toArray();
  const weightLogs = await db.weightLogs.toArray();

  const fullData = {
    exportedAt: new Date().toISOString(),
    appName: 'DEEPS MAGICAL JOURNEY — BODY, MIND & US ❤️',
    profile,
    preferences,
    foodLogs,
    activityLogs,
    menstrualLogs,
    moodLogs,
    hydrationLogs,
    sleepLogs,
    nonScaleWins,
    weightLogs
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(fullData, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `deeps_magical_journey_export_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export async function exportActivityCSV(): Promise<void> {
  const activities = await db.activityLogs.toArray();
  if (activities.length === 0) {
    alert('No activity logs recorded yet.');
    return;
  }

  const headers = ['Date', 'Activity Title', 'Duration (mins)', 'RPE Effort (1-10)', 'Feeling', 'Treadmill?', 'Notes'];
  const rows = activities.map(a => [
    a.date,
    `"${a.title.replace(/"/g, '""')}"`,
    a.durationMins,
    a.perceivedEffortRpe,
    a.feeling,
    a.isTreadmill ? 'Yes' : 'No',
    `"${(a.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', url);
  downloadAnchor.setAttribute('download', `deeps_journey_activities_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export async function deleteAllUserData(): Promise<void> {
  await db.foodLogs.clear();
  await db.activityLogs.clear();
  await db.menstrualLogs.clear();
  await db.moodLogs.clear();
  await db.hydrationLogs.clear();
  await db.sleepLogs.clear();
  await db.nonScaleWins.clear();
  await db.weightLogs.clear();
  await db.aiMessages.clear();
  await db.dailyPlans.clear();
  // Clear profile and preferences
  await db.profiles.clear();
  await db.preferences.clear();
}
