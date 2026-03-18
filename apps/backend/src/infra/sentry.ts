import * as Sentry from '@sentry/node';
import { env } from '../config/env.js';

const enabled = Boolean(env.SENTRY_DSN);

if (enabled) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.SENTRY_ENVIRONMENT ?? 'production',
    release: env.SENTRY_RELEASE,
    tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1,
  });
}

export { Sentry, enabled };
