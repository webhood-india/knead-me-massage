import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function MyPayments() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/transactions/mine').then((res) => setTransactions(res.data.transactions)).finally(() => setLoading(false));
  }, []);

  const downloadInvoice = async (id, invoiceNumber) => {
    const res = await api.get(`/transactions/${id}/invoice`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${invoiceNumber}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div>
      <h1 className="text-2xl mb-6">My Payments</h1>
      {loading && <p className="text-charcoal-900/50">Loading...</p>}
      {!loading && transactions.length === 0 && <p className="text-charcoal-900/50">No transactions yet.</p>}

      <div className="card overflow-hidden">
        {transactions.map((t) => (
          <div key={t._id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-charcoal-900/5 last:border-0">
            <div>
              <p className="font-medium">{t.booking?.serviceName}</p>
              <p className="text-xs text-charcoal-900/50">{new Date(t.createdAt).toLocaleDateString('en-GB')} · {t.invoiceNumber}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">£{t.amount.toFixed(2)}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-sage-100 text-sage-600 capitalize">{t.status}</span>
              <button onClick={() => downloadInvoice(t._id, t.invoiceNumber)} className="text-xs text-brass-600 underline">
                Download Invoice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
