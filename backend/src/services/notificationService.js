const supabase = require('../config/database');
const cron = require('node-cron');

function startNotificationService() {
  cron.schedule('0 8 * * *', async () => {
    console.log('Running daily notification check...');
    try {
      const now = new Date().toISOString();

      const { data: reminders } = await supabase
        .from('reminders')
        .select('*, users(name, email), modules(name)')
        .eq('notification_enabled', true)
        .eq('is_completed', false)
        .lte('reminder_date', now);

      if (!reminders || reminders.length === 0) return;

      for (const reminder of reminders) {
        const { data: alreadySent } = await supabase
          .from('notification_log')
          .select('id')
          .eq('reminder_id', reminder.id)
          .gte('sent_at', new Date().toISOString().split('T')[0])
          .limit(1);

        if (!alreadySent || alreadySent.length === 0) {
          console.log(`[NOTIFICATION] To: ${reminder.users?.name} (${reminder.users?.email}) - ${reminder.title} (${reminder.modules?.name})`);

          await supabase.from('notification_log').insert({
            reminder_id: reminder.id,
            user_id: reminder.user_id,
            notification_type: 'email',
            status: 'sent',
          });
        }
      }
    } catch (error) {
      console.error('Notification service error:', error);
    }
  });

  console.log('Notification service started (daily at 8:00 AM)');
}

module.exports = { startNotificationService };
