const AWS    = require('aws-sdk');
const util   = require('util');
const parser = require('ua-parser-js');

/**
 *
 * @param event
 * @return {Promise<*>}
 */
exports.index = async (event) => {
  // Log function input
  const log = require('console-log-level')({
    level : process.env.LOG_LEVEL,
  });
  log.trace(
    'Start "user-agent" aggregation service: \n',
    util.inspect(event),
  );

  try {
    if (typeof event.context.userAgent === 'undefined') {
      throw new Error('userAgent not available in event.context');
    }

    const result = parser(event.context.userAgent);
    if (result) {
      event.context.ua = result;
      log.debug('User Agent information added to event.context: \n', util.inspect(result));
    } else {
      log.debug('No UserAgent data available for the submitted userAgent.');
    }
    return event;
  } catch (err) {
    log.error(`Error processing aggregation: ${err}`);
    throw new Error(err);
  }
};
