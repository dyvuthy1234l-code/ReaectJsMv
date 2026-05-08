import { useApp } from '../context/AppContext';
import './Subscription.css';

const PLANS = [
  {
    id:       'basic',
    name:     'Basic',
    price:    '$4.99',
    period:   '/month',
    badge:    null,
    features: [
      '720p HD Streaming',
      '1 Screen at a time',
      'Access to all movies',
      'Mobile & Tablet',
      'Cancel anytime',
    ],
    cta: 'Get Basic',
  },
  {
    id:       'premium',
    name:     'Premium',
    price:    '$12.99',
    period:   '/month',
    badge:    '⭐ Best Value',
    features: [
      '4K Ultra HD',
      '4 Screens simultaneously',
      'Early access to new films',
      'Downloads for offline',
      'All devices supported',
      'Priority support',
    ],
    cta: 'Get Premium',
  },
];

export default function Subscription() {
  const { subscription, subscribe } = useApp();

  return (
    <div className="sub-page">
      <div className="container">

        <div className="sub-page__header">
          <h1 className="sub-page__title">Choose Your Plan</h1>
          <p className="sub-page__subtitle">Unlimited movies. Cancel anytime.</p>
        </div>

        {/* Bootstrap row for responsive card layout */}
        <div className="row justify-content-center g-4 sub-page__cards">
          {PLANS.map(plan => (
            <div key={plan.id} className="col-12 col-sm-8 col-md-5">
              <div className={`sub-card ${plan.id === 'premium' ? 'sub-card--featured' : ''} ${subscription === plan.id ? 'sub-card--active' : ''}`}>

                {plan.badge && (
                  <div className="sub-card__badge">{plan.badge}</div>
                )}

                <div className="sub-card__name">{plan.name}</div>
                <div className="sub-card__price">
                  {plan.price}<span>{plan.period}</span>
                </div>

                <ul className="sub-card__features">
                  {plan.features.map(f => (
                    <li key={f}>
                      <span className="sub-card__check">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className={`btn sub-card__cta ${plan.id === 'premium' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => subscribe(plan.id)}
                  disabled={subscription === plan.id}
                >
                  {subscription === plan.id ? '✓ Current Plan' : plan.cta}
                </button>

              </div>
            </div>
          ))}
        </div>

        <div className="sub-page__guarantee">
          <p>🔒 Secure payment · Cancel anytime · No hidden fees</p>
        </div>

      </div>
    </div>
  );
}
