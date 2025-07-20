const cron = require('node-cron');
const Redis = require('ioredis');
const RedlockModule = require('redlock'); // import the module
const logger = require('../logger');
const monitor = require('../utils/monitor');
const { processIdentityCheck } = require('../sidecar/sidecar.service');

const redis = new Redis();

// Support both v4 and v5+ of redlock
const Redlock = RedlockModule.default || RedlockModule;

const redlock = new Redlock([redis]);

const job = cron.schedule('20* * * * *', async () => {
  const lag = monitor();
  if (lag > 200) {
    logger.warn(`Skipping cron – event loop lag detected: ${lag}ms`);
    return;
  }

  try {
    const lock = await redlock.acquire(['locks:cron-job'], 59000);
    logger.info('Cron job started');

    await processIdentityCheck();

    await lock.unlock();
    logger.info('Cron job finished');
  } catch (err) {
    if (err.name === 'LockError') {
      logger.warn('Cron job skipped – already locked');
    } else {
      logger.error(`Cron job error: ${err.message}`);
    }
  }
});

module.exports = job;
