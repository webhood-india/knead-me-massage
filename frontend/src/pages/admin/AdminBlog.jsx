import { useEffect, useState } from 'react';
import { adminApi, getErrorMessage } from '../../api/client';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/ImageUpload';
import Editor, { Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnStrikeThrough, BtnBulletList,
  BtnNumberedList, BtnLink, BtnClearFormatting, BtnUndo, BtnRedo, Separator } from 'react-simple-wysiwyg';

const emptyForm = { title: '', excerpt: '', content: '', coverImage: '', author: 'Knead Me Team', tags: '', status: 'draft' };

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.get('/blog').then((res) => setBlogs(res.data.blogs)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setForm(emptyForm); setEditing('new'); };
  const openEdit = (b) => {
    setForm({
      title: b.title,
      excerpt: b.excerpt || '',
      content: b.content,
      coverImage: b.coverImage || '',
      author: b.author,
      tags: (b.tags || []).join(', '),
      status: b.status,
    });
    setEditing(b._id);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) };
    try {
      if (editing === 'new') {
        await adminApi.post('/blog', payload);
        toast.success('Post created');
      } else {
        await adminApi.put(`/blog/${editing}`, payload);
        toast.success('Post updated');
      }
      setEditing(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (b) => {
    try {
      await adminApi.put(`/blog/${b._id}`, { status: b.status === 'published' ? 'draft' : 'published' });
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      await adminApi.delete(`/blog/${id}`);
      toast.success('Post deleted');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">Blog</h1>
        <button onClick={openNew} className="btn-primary !py-2 !px-5">+ New Post</button>
      </div>

      {loading && <p className="text-charcoal-900/50">Loading...</p>}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-charcoal-900/50 border-b border-charcoal-900/5">
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Updated</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((b) => (
              <tr key={b._id} className="border-b border-charcoal-900/5 last:border-0">
                <td className="px-5 py-3">{b.title}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${b.status === 'published' ? 'bg-sage-100 text-sage-600' : 'bg-charcoal-900/10 text-charcoal-900/50'}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-5 py-3">{new Date(b.updatedAt).toLocaleDateString('en-GB')}</td>
                <td className="px-5 py-3 space-x-3 text-xs">
                  <button onClick={() => openEdit(b)} className="text-brass-600 underline">Edit</button>
                  <button onClick={() => togglePublish(b)} className="text-sage-600 underline">
                    {b.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => handleDelete(b._id)} className="text-red-600 underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50" onClick={() => setEditing(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={handleSave} className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <h2 className="text-xl">{editing === 'new' ? 'New Post' : 'Edit Post'}</h2>
            <input required className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

            <ImageUpload value={form.coverImage} onChange={(url) => setForm({ ...form, coverImage: url })} label="Cover Image" />

            <input className="input" placeholder="Short excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />

            <div>
              <label className="text-sm text-charcoal-900/50 block mb-1">Content</label>
              <Editor
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                containerProps={{ style: { minHeight: '260px', borderRadius: '0.5rem', borderColor: 'rgba(23,21,18,0.15)' } }}
              >
                <Toolbar>
                  <BtnUndo /><BtnRedo /><Separator />
                  <BtnBold /><BtnItalic /><BtnUnderline /><BtnStrikeThrough /><Separator />
                  <BtnBulletList /><BtnNumberedList /><Separator />
                  <BtnLink /><BtnClearFormatting />
                </Toolbar>
              </Editor>
            </div>

            <input className="input" placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-secondary flex-1">Cancel</button>
              <button disabled={saving} className="btn-primary flex-1">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
