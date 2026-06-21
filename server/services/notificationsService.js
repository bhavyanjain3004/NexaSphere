import { notificationPreferencesRepository } from '../repositories/notificationPreferencesRepository.js';
import { notificationAnalyticsRepository } from '../repositories/notificationAnalyticsRepository.js';
import { pushSubscriptionsRepository } from '../repositories/pushSubscriptionsRepository.js';
import { notificationsRepository } from '../repositories/notificationsRepository.js';
import { HAS_SUPABASE, supabaseRequest } from '../storage/supabaseClient.js';
import webpush from 'web-push';
import crypto from 'crypto';

/**
 * Orchestrates notification delivery based on user preferences and behavior.
 */
class NotificationsService {
  constructor() {
    if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
      webpush.setVapidDetails(
        'mailto:admin@nexasphere.com',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );
    }
  }

  async addNotification(userId, data) {
    const { type, priority = 'normal' } = data;

    // Create the notification in the database first
    const note = await notificationsRepository.create({
      id: data.id || crypto.randomUUID(),
      userId: userId || 'global',
      type: type || 'system',
      title: data.title || 'Notification',
      message: data.message || '',
      link: data.link || null,
      isRead: !!(data.isRead ?? data.is_read ?? false),
    });

    // 1. Smart Fatigue Adjustment
    const activity = await notificationAnalyticsRepository.getUserActivityMetrics(userId);
    const pref = await notificationPreferencesRepository.get(userId, type);
    const config = pref
      ? { push: pref.push, frequency: pref.frequency }
      : {
          push: true,
          frequency:
            type === 'announcements'
              ? 'daily_digest'
              : type === 'recommendations'
                ? 'weekly_digest'
                : 'immediate',
        };

    if (!config.push) return note; // Opted out of push, database record returned

    let effectiveFrequency = config.frequency;

    // Feature: If user hasn't opened app in 5 days, increase frequency (bypass digest)
    if (activity.daysSinceLastActive >= 5 && effectiveFrequency !== 'disabled') {
      effectiveFrequency = 'immediate';
    }
    // Feature: If user opens app 10+ times per day, reduce frequency for low-priority items
    if (activity.dailyActiveCount >= 10 && type === 'recommendations') {
      effectiveFrequency = 'daily_digest';
    }

    // 2. Check DND status (critical notifications bypass DND)
    const isDND = await notificationPreferencesRepository.isDNDActive(userId, type);
    if (isDND && priority !== 'high') {
      await this.queueForLater(userId, note, 'dnd');
      return note;
    }

    if (effectiveFrequency === 'immediate') {
      // 3. Check Quiet Hours
      const inQuietHours = await notificationPreferencesRepository.isInsideQuietHours(userId, type);
      if (inQuietHours && priority !== 'high') {
        await this.queueForLater(userId, note, 'quiet_hours');
        return note;
      }
      await this.sendNow(userId, note);
      return note;
    } else if (effectiveFrequency !== 'disabled') {
      await this.addToDigest(userId, effectiveFrequency, note);
      return note;
    }

    return note;
  }

  async sendNow(userId, data) {
    const subs = await pushSubscriptionsRepository.list();
    const payload = JSON.stringify({
      notification: {
        title: data.title,
        body: data.message,
        icon: '/pwa-192x192.png',
        data: { link: data.link || '/', type: data.type, id: data.id },
        actions: data.actions || [{ action: 'dismiss', title: 'Dismiss' }],
      },
    });

    for (const sub of subs) {
      try {
        await webpush.sendNotification(sub, payload);
        await notificationAnalyticsRepository.logEvent(userId, data.id, 'delivered');
      } catch (err) {
        if (err.statusCode === 410) await pushSubscriptionsRepository.remove(sub.endpoint);
      }
    }
  }

  async addToDigest(userId, frequency, data) {
    if (!HAS_SUPABASE) return;
    await supabaseRequest('pending_digests', {
      method: 'POST',
      body: [{ user_id: userId, frequency, notification_data: data }],
    });
  }

  async queueForLater(userId, data, reason) {
    if (!HAS_SUPABASE) return;
    await supabaseRequest('queued_notifications', {
      method: 'POST',
      body: [{ user_id: userId, reason, notification_data: data }],
    });
  }

  /**
   * Smart Batching: Group multiple items into a single summary notification
   */
  async processDigests(frequency) {
    const digests = await supabaseRequest(`pending_digests?frequency=eq.${frequency}`);
    const userGroups = digests.reduce((acc, d) => {
      acc[d.user_id] = acc[d.user_id] || [];
      acc[d.user_id].push(d.notification_data);
      return acc;
    }, {});

    for (const [userId, items] of Object.entries(userGroups)) {
      const message =
        items.length === 1
          ? items[0].message
          : `You have ${items.length} new ${frequency.replace('_', ' ')} updates including: ${items[0].title}`;

      await this.sendNow(userId, {
        title: `Your ${frequency.replace('_', ' ')}`,
        message,
        type: 'digest',
      });
    }
    // Cleanup processed digests
    await supabaseRequest(`pending_digests?frequency=eq.${frequency}`, { method: 'DELETE' });
  }

  async flushQueuedNotifications() {
    // Logic to fetch notifications where Quiet Hours or DND has ended and send them
  }

  // CRUD Pass-throughs for Repository
  async getNotifications(userId, offset, limit) {
    return notificationsRepository.list({ userId, limit, offset });
  }
  async markAsRead(userId, id) {
    return notificationsRepository.markAsRead(userId, id);
  }
  async markAllAsRead(userId) {
    return notificationsRepository.markAllAsRead(userId);
  }
  async clearAll(userId) {
    return notificationsRepository.clearAll(userId);
  }
  async removeNotification(userId, id) {
    return notificationsRepository.remove(userId, id);
  }
}

const notificationsService = new NotificationsService();
export default notificationsService;

export const addNotification = notificationsService.addNotification.bind(notificationsService);
export const getNotifications = notificationsService.getNotifications.bind(notificationsService);
export const markAsRead = notificationsService.markAsRead.bind(notificationsService);
export const markAllAsRead = notificationsService.markAllAsRead.bind(notificationsService);
export const clearAll = notificationsService.clearAll.bind(notificationsService);
export const removeNotification =
  notificationsService.removeNotification.bind(notificationsService);
