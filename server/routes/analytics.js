import { Router } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTENT_FILE = path.join(__dirname, '..', 'data', 'content.json');

const router = Router();

/**
 * Read stored content from the local JSON file.
 * Returns the default structure if the file is missing or unreadable.
 */
async function readContentSafe() {
  try {
    const raw = await fs.readFile(CONTENT_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { events: [], activityEvents: {}, coreTeam: [] };
  }
}

/**
 * GET /
 * Returns a high-level summary of events, activity events, and core team members.
 */
router.get('/', async (_req, res) => {
  try {
    const content = await readContentSafe();

    const events = content.events || [];
    const activityEvents = content.activityEvents || {};
    const coreTeam = content.coreTeam || [];

    const upcomingEvents = events.filter(e => e.status === 'upcoming');
    const completedEvents = events.filter(e => e.status === 'completed');

    const activityEventCounts = {};
    let totalActivityEvents = 0;
    for (const [key, list] of Object.entries(activityEvents)) {
      const count = Array.isArray(list) ? list.length : 0;
      activityEventCounts[key] = count;
      totalActivityEvents += count;
    }

    res.json({
      overview: {
        totalEvents: events.length,
        upcomingEvents: upcomingEvents.length,
        completedEvents: completedEvents.length,
        totalActivityEvents,
        totalCoreTeamMembers: coreTeam.length,
      },
      activityEventCounts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to generate analytics' });
  }
});

/**
 * GET /events
 * Returns detailed analytics for events including tag distribution.
 */
router.get('/events', async (_req, res) => {
  try {
    const content = await readContentSafe();
    const events = content.events || [];

    const tagFrequency = {};
    for (const event of events) {
      const tags = Array.isArray(event.tags) ? event.tags : [];
      for (const tag of tags) {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      }
    }

    const statusBreakdown = {};
    for (const event of events) {
      const status = event.status || 'unknown';
      statusBreakdown[status] = (statusBreakdown[status] || 0) + 1;
    }

    res.json({
      total: events.length,
      statusBreakdown,
      tagFrequency,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to generate event analytics' });
  }
});

export default router;
