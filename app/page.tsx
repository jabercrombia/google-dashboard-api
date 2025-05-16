import { Suspense } from 'react';
import AnalyticsData from './components/analyticsdata';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading analytics...</div>}>
      <AnalyticsData />
    </Suspense>
  );
}
