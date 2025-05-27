const eventLoopLag = require('event-loop-lag');
const lagCheck = eventLoopLag(1000);
module.exports = () => lagCheck();