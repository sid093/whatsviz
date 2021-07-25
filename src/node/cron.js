const CronJob = require('cron').CronJob;
const exec = require('child_process').exec;

// Daily cleanup check output folder
new CronJob(
    '* 0 0 * * *',
    () => exec('find /home/app/data/output/* -mtime +6 -type f -delete')
).start();