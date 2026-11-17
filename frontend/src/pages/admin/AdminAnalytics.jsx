import { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';

export default function AdminAnalytics() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    adminApi.get('/analytics-link').then((res) => setUrl(res.data.url));
  }, []);

  return (
    <div>
      <h1 className="text-2xl mb-6">Analytics</h1>
      <div className="card p-8 text-center">
        <p className="text-charcoal-900/60 mb-4">
          Site analytics are powered by Microsoft Clarity. Click below to open the dashboard.
        </p>
        {url ? (
          <a href={url} target="_blank" rel="noreferrer" className="btn-primary inline-flex">
            Open Microsoft Clarity Dashboard
          </a>
        ) : (
          <p className="text-charcoal-900/40 text-sm">Analytics link not configured yet.</p>
        )}
        <p className="text-xs text-charcoal-900/40 mt-4">
          Configured via CLARITY_DASHBOARD_URL in the backend .env — update it any time without a code change.
        </p>
      </div>
    </div>
  );
}
