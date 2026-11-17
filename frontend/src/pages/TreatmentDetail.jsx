import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';

export default function TreatmentDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get(`/services/${slug}`)
      .then((res) => setService(res.data.service))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) return <div className="section text-center">Treatment not found.</div>;
  if (!service) return <div className="section text-center text-charcoal-900/50">Loading...</div>;

  return (
    <div>
      <section className="bg-charcoal-950 text-cream section !pb-16">
        <p className="eyebrow !text-brass-400">{service.category}</p>
        <h1 className="text-4xl md:text-6xl font-light mt-2 max-w-2xl">{service.name}</h1>
        <p className="mt-4 max-w-xl text-cream/70">{service.shortDescription}</p>
      </section>

      <section className="section grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          {service.image && <img src={service.image} alt={service.name} className="w-full h-64 object-cover rounded-2xl mb-8" />}
          <h2 className="text-2xl mb-4">About this treatment</h2>
          <p className="text-charcoal-900/70 leading-relaxed">{service.description}</p>

          {service.benefits?.length > 0 && (
            <>
              <h3 className="text-xl mt-8 mb-3">Benefits</h3>
              <ul className="space-y-2">
                {service.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-charcoal-900/70">
                    <span className="text-sage-500 mt-1">✓</span> {b}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <aside className="card p-6 h-fit sticky top-24">
          <h3 className="font-display text-xl mb-4">Pricing</h3>
          <ul className="space-y-2 mb-6">
            {service.durationOptions.map((d) => (
              <li key={d.duration} className="flex justify-between border-b border-charcoal-900/5 py-2 text-sm">
                <span className="text-charcoal-900/60">{d.duration} minutes</span>
                <span className="font-medium">£{d.price}</span>
              </li>
            ))}
          </ul>
          <Link to={`/book-appointment?service=${service.slug}`} className="btn-primary w-full">
            Book This Treatment
          </Link>
        </aside>
      </section>
    </div>
  );
}
