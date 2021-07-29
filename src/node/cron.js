const CronJob = require('cron').CronJob;
const exec = require('child_process').exec;

// Daily cleanup check output folder for files older than one day
new CronJob(
    '* 0 0 * * *',
    () => {
        exec('find /home/app/data/output/* -mtime +1 -type f -delete')
        exec('find /home/app/data/input/* -mtime +1 -type f -delete')
    }
).start();