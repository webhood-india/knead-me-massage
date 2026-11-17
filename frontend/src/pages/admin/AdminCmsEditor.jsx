import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi, getErrorMessage } from '../../api/client';
import ImageUpload from '../../components/ImageUpload';
import toast from 'react-hot-toast';

function FieldInput({ field, value, onChange }) {
  if (field.type === 'image') {
    return <ImageUpload value={value || ''} onChange={onChange} label={field.label} />;
  }
  if (field.type === 'video') {
    return (
      <div>
        <label className="text-sm text-charcoal-900/50 block mb-1">{field.label}</label>
        <input className="input" placeholder="Video URL" value={value || ''} onChange={(e) => onChange(e.target.value)} />
        <input type="file" accept="video/mp4,video/webm" onChange={async (e) => { const file=e.target.files?.[0]; if (!file) return; if (file.size>50*1024*1024) {toast.error('Video must be under 50MB');return;} const form=new FormData(); form.append('image',file); try {const r=await adminApi.post('/upload',form);onChange(r.data.url);toast.success('Video uploaded');}catch(err){toast.error(getErrorMessage(err));} }} />
      </div>
    );
  }
  if (field.type === 'textarea') {
    return (
      <div>
        <label className="text-sm text-charcoal-900/50 block mb-1">{field.label}</label>
        <textarea className="input" rows={4} value={value || ''} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  return (
    <div>
      <label className="text-sm text-charcoal-900/50 block mb-1">{field.label}</label>
      <input className="input" value={value || ''} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ObjectSection({ section, values, onChange }) {
  return (
    <div className="space-y-4">
      {section.fields.map((f) => (
        <FieldInput
          key={f.key}
          field={f}
          value={values?.[f.key]}
          onChange={(v) => onChange({ ...values, [f.key]: v })}
        />
      ))}
    </div>
  );
}

function ListSection({ section, items, onChange }) {
  const list = Array.isArray(items) ? items : [];

  const updateItem = (i, key, value) => {
    const next = [...list];
    next[i] = { ...next[i], [key]: value };
    onChange(next);
  };
  const removeItem = (i) => onChange(list.filter((_, idx) => idx !== i));
  const addItem = () => {
    const blank = Object.fromEntries(section.itemFields.map((f) => [f.key, '']));
    onChange([...list, blank]);
  };

  return (
    <div className="space-y-4">
      {list.map((item, i) => (
        <div key={i} className="border border-charcoal-900/10 rounded-xl p-4 space-y-3 relative">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-charcoal-900/40 uppercase tracking-wide">
              {section.itemLabel || 'Item'} {i + 1}
            </p>
            <button type="button" onClick={() => removeItem(i)} className="text-xs text-red-500 hover:underline">
              Remove
            </button>
          </div>
          {section.itemFields.map((f) => (
            <FieldInput key={f.key} field={f} value={item[f.key]} onChange={(v) => updateItem(i, f.key, v)} />
          ))}
        </div>
      ))}
      <button type="button" onClick={addItem} className="text-sm text-brass-600 underline">
        + Add {section.itemLabel || 'Item'}
      </button>
    </div>
  );
}

export default function AdminCmsEditor() {
  const { pageKey } = useParams();
  const [schema, setSchema] = useState(null);
  const [values, setValues] = useState(null);
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    setLoading(true);
    adminApi.get(`/cms/pages/${pageKey}`).then((res) => {
      setSchema(res.data.schema);
      setValues(res.data.content || {});
      setOriginal(res.data.content || {});
      setActiveSection(0);
    }).finally(() => setLoading(false));
  }, [pageKey]);

  const isDirty = values && original && JSON.stringify(values) !== JSON.stringify(original);

  const updateSection = (sectionKey, newSectionValue) => {
    setValues((prev) => ({ ...prev, [sectionKey]: newSectionValue }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminApi.put(`/cms/pages/${pageKey}`, { content: values });
      setOriginal(res.data.content);
      setValues(res.data.content);
      toast.success('Saved — live on the website now');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => setValues(original);

  if (loading) return <p className="text-charcoal-900/50">Loading...</p>;
  if (!schema) return <p className="text-red-600">Page not found.</p>;

  const section = schema.sections[activeSection];

  return (
    <div className="pb-24">
      <div className="flex items-center gap-2 mb-2 text-sm">
        <Link to="/admin/cms" className="text-charcoal-900/50 hover:underline">Content (CMS)</Link>
        <span className="text-charcoal-900/30">/</span>
        <span>{schema.label}</span>
      </div>
      <h1 className="text-2xl mb-6">{schema.label}</h1>

      <div className="grid md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-1">
          {schema.sections.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(i)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                i === activeSection ? 'bg-charcoal-900 text-cream' : 'text-charcoal-900/70 hover:bg-charcoal-900/5'
              }`}
            >
              {s.label}
            </button>
          ))}
        </aside>

        <div className="md:col-span-3 card p-6">
          <h2 className="text-lg mb-6">{section.label}</h2>
          {section.type === 'list' ? (
            <ListSection section={section} items={values[section.key]} onChange={(v) => updateSection(section.key, v)} />
          ) : (
            <ObjectSection section={section} values={values[section.key]} onChange={(v) => updateSection(section.key, v)} />
          )}
        </div>
      </div>

      {isDirty && (
        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t border-charcoal-900/10 px-8 py-4 flex items-center justify-between shadow-lg z-40">
          <p className="text-sm text-charcoal-900/60">You have unsaved changes.</p>
          <div className="flex gap-3">
            <button onClick={handleDiscard} className="btn-secondary !py-2 !px-4 text-sm">Discard</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary !py-2 !px-5 text-sm disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
