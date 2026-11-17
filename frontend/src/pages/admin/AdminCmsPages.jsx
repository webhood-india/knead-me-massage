import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/client';

export default function AdminCmsPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/cms/pages').then((res) => setPages(res.data.pages)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl mb-2">Content (CMS)</h1>
      <p className="text-sm text-charcoal-900/50 mb-6">
        Edit the text, images, video, and FAQs shown on each page of the website. Changes go live
        immediately after saving.
      </p>

      {loading && <p className="text-charcoal-900/50">Loading...</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((p) => (
          <Link key={p.pageKey} to={`/admin/cms/${p.pageKey}`} className="card p-5 hover:border-brass-500 transition block">
            <h3 className="font-display text-lg mb-1">{p.label}</h3>
            {p.description && <p className="text-xs text-charcoal-900/50 mb-2">{p.description}</p>}
            <p className="text-xs text-brass-600">{p.sectionCount} section{p.sectionCount === 1 ? '' : 's'}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
