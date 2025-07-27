import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Premium() {
  const [selectedUserType, setSelectedUserType] = useState('sanctuaries');

  const sanctuaryTiers = [
    {
      name: 'Free',
      price: '$0',
      period: '/mo',
      idealFor: 'Small sanctuaries & new partners',
      features: [
        'Ambassador profile pages (basic)',
        'Accept donations (crypto/fiat)',
        'Basic analytics dashboard',
        'Access to the community forum'
      ],
      popular: false
    },
    {
      name: 'Pro',
      price: '$??',
      period: '/mo',
      idealFor: 'Mid-sized orgs looking to grow',
      features: [
        'Customizable ambassador profiles',
        'CRM & donor analytics',
        'Campaign toolkit (goals, matching, milestones)',
        'Supporter leaderboard + badges',
        'Ability to onboard influencers/community fundraisers',
        'Priority support'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Pricing',
      idealFor: 'Large orgs or networks with special needs',
      features: [
        'Everything in Pro',
        'Multi-user admin tools',
        'Dedicated account manager',
        'API access or integrations (e.g., Salesforce, Mailchimp)',
        'Custom fundraising workshops or setup assistance'
      ],
      popular: false
    }
  ];

  const communityTiers = [
    {
      name: 'Free',
      price: '$0',
      period: '/mo',
      idealFor: 'Everyday animal lovers',
      features: [
        'Follow ambassador animals',
        'Comment on walls, earn badges',
        'Join community forum',
        'Receive update notifications from sanctuaries'
      ],
      popular: false
    },
    {
      name: 'Pro',
      price: '$5-10',
      period: '/mo',
      idealFor: 'Power users, fundraisers, creators',
      features: [
        'Run your own fundraising campaigns',
        'Stream to followers or sanctuary causes (via Zoomies campaign toolkit)',
        'Customize your supporter profile (themes, bios, badges)',
        'Early access to events or merch drops'
      ],
      popular: true
    }
  ];

  return (
    <div className="premium-page" style={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: '2rem 1rem',
      background: 'var(--background)'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontFamily: 'Calistoga, serif', 
          fontSize: '2.5rem', 
          color: 'var(--primary)', 
          marginBottom: '1rem' 
        }}>
          Choose Your Plan
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'var(--text-secondary)', 
          marginBottom: '2rem' 
        }}>
          Support animal sanctuaries and join our community with the perfect plan for you.
        </p>
        
        {/* User Type Toggle */}
        <div className="user-type-toggle" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          <button 
            style={{ 
              padding: '0.75rem 1.5rem',
              border: '2px solid var(--primary)',
              background: selectedUserType === 'sanctuaries' ? 'var(--primary)' : 'transparent',
              color: selectedUserType === 'sanctuaries' ? 'var(--white)' : 'var(--primary)',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onClick={() => setSelectedUserType('sanctuaries')}
          >
            🏠 Sanctuaries
          </button>
          <button 
            style={{ 
              padding: '0.75rem 1.5rem',
              border: '2px solid var(--primary)',
              background: selectedUserType === 'community' ? 'var(--primary)' : 'transparent',
              color: selectedUserType === 'community' ? 'var(--white)' : 'var(--primary)',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onClick={() => setSelectedUserType('community')}
          >
            👥 Community
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="pricing-cards" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {(selectedUserType === 'sanctuaries' ? sanctuaryTiers : communityTiers).map((tier, index) => (
          <div key={index} className="pricing-card" style={{
            background: 'var(--card)',
            borderRadius: '20px',
            padding: '2rem',
            border: tier.popular ? '3px solid var(--primary)' : '1px solid var(--gray)',
            position: 'relative',
            boxShadow: tier.popular ? '0 8px 32px rgba(252, 151, 202, 0.2)' : '0 4px 16px rgba(0,0,0,0.1)'
          }}>
            {tier.popular && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--primary)',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 600
              }}>
                Most Popular
              </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 600, 
                marginBottom: '0.5rem',
                color: 'var(--text)'
              }}>
                {tier.name}
              </h3>
              <div style={{ marginBottom: '0.5rem' }}>
                <span className="price" style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 700, 
                  color: 'var(--primary)' 
                }}>
                  {tier.price}
                </span>
                <span className="period" style={{ 
                  fontSize: '1rem', 
                  color: 'var(--text)', 
                  opacity: 0.7 
                }}>
                  {tier.period}
                </span>
              </div>
              <p className="ideal-for" style={{ 
                fontSize: '0.9rem', 
                color: 'var(--text)', 
                opacity: 0.8,
                fontStyle: 'italic'
              }}>
                {tier.idealFor}
              </p>
            </div>

            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0,
              marginBottom: '2rem'
            }}>
              {tier.features.map((feature, featureIndex) => (
                <li key={featureIndex} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                  fontSize: '0.95rem',
                  color: 'var(--text)'
                }}>
                  <span style={{ 
                    color: 'var(--primary)', 
                    fontSize: '1.1rem',
                    marginTop: '0.1rem'
                  }}>
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <button style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              border: 'none',
              background: tier.popular ? 'var(--primary)' : 'var(--gray)',
              color: tier.popular ? '#fff' : 'var(--text)',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              {tier.name === 'Free' ? 'Get Started' : tier.name === 'Enterprise' ? 'Contact Sales' : 'Upgrade Now'}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="faq-section" style={{ 
        background: 'var(--card)', 
        borderRadius: '20px', 
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          color: 'var(--text)'
        }}>
          Frequently Asked Questions
        </h2>
        <div className="faq-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          <div>
            <h4 style={{ 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              color: 'var(--text)'
            }}>
              Can I change my plan anytime?
            </h4>
            <p style={{ 
              fontSize: '0.9rem', 
              color: 'var(--text)', 
              opacity: 0.8 
            }}>
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          <div>
            <h4 style={{ 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              color: 'var(--text)'
            }}>
              What payment methods do you accept?
            </h4>
            <p style={{ 
              fontSize: '0.9rem', 
              color: 'var(--text)', 
              opacity: 0.8 
            }}>
              We accept all major credit cards, PayPal, and cryptocurrency payments.
            </p>
          </div>
          <div>
            <h4 style={{ 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              color: 'var(--text)'
            }}>
              Is there a free trial?
            </h4>
            <p style={{ 
              fontSize: '0.9rem', 
              color: 'var(--text)', 
              opacity: 0.8 
            }}>
              Yes! All paid plans come with a 14-day free trial. No credit card required.
            </p>
          </div>
          <div>
            <h4 style={{ 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              color: 'var(--text)'
            }}>
              How do I get support?
            </h4>
            <p style={{ 
              fontSize: '0.9rem', 
              color: 'var(--text)', 
              opacity: 0.8 
            }}>
              Free users get community support, while Pro and Enterprise users get priority support.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section" style={{ 
        textAlign: 'center', 
        background: 'var(--card)', 
        borderRadius: '20px', 
        padding: '3rem 2rem' 
      }}>
        <h2 style={{ 
          marginBottom: '1rem',
          color: 'var(--text)'
        }}>
          Ready to make a difference?
        </h2>
        <p style={{ 
          fontSize: '1.1rem', 
          marginBottom: '2rem',
          color: 'var(--text)',
          opacity: 0.8
        }}>
          Join thousands of animal lovers and sanctuaries already using Zoomies
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="button" style={{ 
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            textDecoration: 'none'
          }}>
            🏠 Back to Home
          </Link>
          <button className="button" style={{ 
            padding: '1rem 2rem',
            fontSize: '1.1rem'
          }}>
            📧 Contact Us
          </button>
        </div>
      </div>
    </div>
  );
} 