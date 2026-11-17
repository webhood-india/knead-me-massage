import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/blog/${slug}`).then((res) => setBlog(res.data.blog)).catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) return <div className="section text-center">Post not found.</div>;
  if (!blog) return <div className="section text-center text-charcoal-900/50">Loading...</div>;

  return (
    <article className="section max-w-2xl mx-auto">
      <p className="text-xs text-charcoal-900/40 mb-2">{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-GB')} · {blog.author}</p>
      <h1 className="text-4xl mb-6">{blog.title}</h1>
      {blog.coverImage && <img src={blog.coverImage} alt={blog.title} className="rounded-2xl mb-8 w-full" />}
      <div className="prose max-w-none text-charcoal-900/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: blog.content }} />
    </article>
  );
}
