import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="section text-center">
      <h1 className="text-5xl mb-4">404</h1>
      <p className="text-charcoal-900/60 mb-6">Sorry, we couldn't find that page.</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}
