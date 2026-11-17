import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminAccount() {
  const { admin } = useAdminAuth();

  return (
    <div>
      <h1 className="text-2xl mb-6">Admin Account</h1>
      <div className="card p-6 max-w-md space-y-3">
        <p className="flex justify-between text-sm"><span className="text-charcoal-900/50">Email</span><span>{admin?.email}</span></p>
        <p className="flex justify-between text-sm"><span className="text-charcoal-900/50">Role</span><span>Administrator</span></p>
        <div className="pt-3 border-t border-charcoal-900/5 text-xs text-charcoal-900/50 space-y-2">
          <p>
            Admin credentials are currently set in the backend <code>.env</code> file (<code>ADMIN_EMAIL</code> /
            <code> ADMIN_PASSWORD</code>) for the initial launch. Let us know when you'd like this upgraded to a
            full database-backed admin account with password change support.
          </p>
          <p>
            Online appointment and gift payments are processed through SumUp Hosted Checkout. The backend verifies payment status directly with SumUp before issuing invoices or confirmations.
          </p>
        </div>
      </div>
    </div>
  );
}
