'use client';

import { useEffect, useState } from 'react';

export default function AnalyticsData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h1>GA4 Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}