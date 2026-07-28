const supabase = require('./src/config/database');

async function test() {
  try {
    const tables = ['users', 'modules', 'user_modules', 'categories', 'reminders', 'notification_log'];
    for (const t of tables) {
      const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
      console.log(`  ${t}: ${error ? 'NO EXISTE - ' + error.message : count + ' rows'}`);
    }
    process.exit(0);
  } catch (e) {
    console.error('ERROR:', e.message);
    process.exit(1);
  }
}
test();
