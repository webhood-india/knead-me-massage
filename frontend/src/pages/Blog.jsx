import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blog').then((res) => setBlogs(res.data.blogs)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-charcoal-950 text-cream section !pb-16">
        <p className="eyebrow !text-brass-400">Journal</p>
        <h1 className="text-4xl md:text-6xl font-light mt-2">Blog</h1>
        <p className="mt-4 max-w-xl text-cream/70">Insights on massage therapy, recovery, and wellbeing.</p>
      </section>

      <section className="section">
        {loading && <p className="text-charcoal-900/50">Loading posts...</p>}
        {!loading && blogs.length === 0 && (
          <p className="text-charcoal-900/50">No blog posts published yet — check back soon.</p>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <Link key={b._id} to={`/blog/${b.slug}`} className="card p-6 hover:border-brass-500 transition block">
              {b.coverImage && <img src={b.coverImage} alt={b.title} className="rounded-xl mb-4 h-40 w-full object-cover" />}
              <p className="text-xs text-charcoal-900/40 mb-1">{new Date(b.publishedAt || b.createdAt).toLocaleDateString('en-GB')}</p>
              <h3 className="font-display text-xl mb-2">{b.title}</h3>
              <p className="text-sm text-charcoal-900/60">{b.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
