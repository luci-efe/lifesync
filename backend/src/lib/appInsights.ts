import * as appInsights from 'applicationinsights';
import { env } from '../config/env';

export const initAppInsights = () => {
    if (env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
        appInsights.setup(env.APPLICATIONINSIGHTS_CONNECTION_STRING)
            .setAutoDependencyCorrelation(true)
            .setAutoCollectRequests(true)
            .setAutoCollectPerformance(true, true)
            .setAutoCollectExceptions(true)
            .setAutoCollectDependencies(true)
            .setAutoCollectConsole(true)
            .setUseDiskRetryCaching(true)
            .setSendLiveMetrics(true)
            .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
            .start();

        console.log('✅ Application Insights initialized');
    } else {
        console.warn('⚠️ Application Insights connection string not provided, skipping initialization');
    }
};

export const defaultClient = appInsights.defaultClient;
