import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Premium() {
  const [selectedUserType, setSelectedUserType] = useState('sanctuaries');
  const [tipsEnabled, setTipsEnabled] = useState(true);

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
      {/* Donation Fees Section */}
      <div className="donation-fees-section" style={{ 
        padding: '2.5rem',
        marginBottom: '3rem',
        position: 'relative'
      }}>
        {/* Decorative elements */}

        
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '1.5rem',
          fontFamily: 'Calistoga, serif', 
          fontSize: '2rem', 
          color: 'var(--primary)',
          position: 'relative',
          zIndex: 1
        }}>
          Understanding Donation Fees
        </h2>
        <p style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          color: 'var(--text)',
          opacity: 0.8,
          fontSize: '1rem',
          position: 'relative',
          zIndex: 1
        }}>
          Zoomies offers free fundraising tools thanks to optional tips from donors. 
          If you prefer to disable tips, a small platform fee applies instead.
        </p>

        {/* Toggle Section */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '1.5rem',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'rgba(252, 151, 202, 0.1)',
            borderRadius: '25px',
            border: '1px solid rgba(252, 151, 202, 0.2)'
          }}>
            <span style={{ 
              color: 'var(--text)', 
              fontWeight: 600,
              fontSize: '1rem'
            }}>
              Optional Tips
            </span>
            <div style={{
              position: 'relative',
              width: 60,
              height: 30,
              background: tipsEnabled ? 'var(--primary)' : 'var(--gray)',
              borderRadius: 15,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: tipsEnabled ? '0 4px 12px rgba(252, 151, 202, 0.4)' : '0 2px 4px rgba(0,0,0,0.1)'
            }} onClick={() => setTipsEnabled(!tipsEnabled)}>
              <div style={{
                position: 'absolute',
                top: 3,
                left: tipsEnabled ? 33 : 3,
                width: 24,
                height: 24,
                background: '#fff',
                borderRadius: '50%',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} />
            </div>
            <span style={{ 
              color: tipsEnabled ? 'var(--primary)' : 'var(--text)', 
              fontWeight: 600,
              fontSize: '1rem'
            }}>
              {tipsEnabled ? 'On' : 'Off'}
            </span>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div style={{
          background: 'linear-gradient(145deg, var(--background) 0%, rgba(252, 151, 202, 0.03) 100%)',
          borderRadius: '20px',
          padding: '1.5rem 2.5rem 2.5rem 2.5rem',
          border: '2px solid rgba(252, 151, 202, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>

          

          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            gap: '2rem'
          }}>
            {/* Platform Fees */}
            <div style={{
              flex: 1,
              textAlign: 'center',
              padding: '1.5rem',
              background: 'rgba(252, 151, 202, 0.05)',
              borderRadius: '16px',
              border: '1px solid rgba(252, 151, 202, 0.1)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h4 style={{ 
                  fontWeight: 600, 
                  marginBottom: '0.5rem',
                  color: 'var(--text)',
                  fontSize: '1.1rem'
                }}>
                  Platform Fees
                </h4>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: 'var(--text)', 
                  opacity: 0.7,
                  marginBottom: '1rem',
                  lineHeight: '1.4'
                }}>
                  {tipsEnabled 
                    ? 'When tips are on, platform fees are zero.'
                    : 'When tips are off, platform fees help cover the cost of everything Zoomies provides.'
                  }
                </p>
              </div>
              <div style={{
                fontSize: '1.8rem',
                fontWeight: 700,
                color: tipsEnabled ? '#22c55e' : 'var(--primary)',
                padding: '0.8rem 1.5rem',
                background: tipsEnabled ? 'rgba(34, 197, 94, 0.1)' : 'rgba(252, 151, 202, 0.1)',
                borderRadius: '12px',
                border: `2px solid ${tipsEnabled ? 'rgba(34, 197, 94, 0.2)' : 'rgba(252, 151, 202, 0.2)'}`,
                display: 'inline-block',
                minWidth: '100px'
              }}>
                {tipsEnabled ? 'FREE' : '3%'}
              </div>
            </div>

            {/* Divider */}
            <div style={{
              width: '2px',
              background: 'linear-gradient(to bottom, transparent, rgba(252, 151, 202, 0.3), transparent)',
              alignSelf: 'stretch'
            }}></div>

            {/* Processing Fees */}
            <div style={{
              flex: 1,
              textAlign: 'center',
              padding: '1.5rem',
              background: 'rgba(252, 151, 202, 0.05)',
              borderRadius: '16px',
              border: '1px solid rgba(252, 151, 202, 0.1)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h4 style={{ 
                  fontWeight: 600, 
                  marginBottom: '0.5rem',
                  color: 'var(--text)',
                  fontSize: '1.1rem'
                }}>
                  Processing Fees
                </h4>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: 'var(--text)', 
                  opacity: 0.7,
                  marginBottom: '1rem',
                  lineHeight: '1.4'
                }}>
                  Processing fees are charged by our secure payment processors and apply to all transactions.
                </p>
              </div>
              <div style={{
                fontSize: '1.8rem',
                fontWeight: 700,
                color: 'var(--primary)',
                padding: '0.8rem 1.5rem',
                background: 'rgba(252, 151, 202, 0.1)',
                borderRadius: '12px',
                border: '2px solid rgba(252, 151, 202, 0.2)',
                display: 'inline-block',
                minWidth: '140px'
              }}>
                2.9% + 30¢
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(252, 151, 202, 0.08) 0%, rgba(252, 151, 202, 0.03) 100%)',
          borderRadius: '16px',
          padding: '2rem',
          border: '2px solid rgba(252, 151, 202, 0.2)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--primary)',
            color: '#fff',
            padding: '0.5rem 1.5rem',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(252, 151, 202, 0.3)'
          }}>
            ⭐ Pro Tip
          </div>
          <div style={{ marginTop: '1rem' }}>
            <p style={{ 
              fontSize: '1rem', 
              color: 'var(--text)', 
              opacity: 0.9,
              marginBottom: '1rem',
              lineHeight: '1.6'
            }}>
              Donors can opt to cover all fees during the donation process. 
              {tipsEnabled 
                ? ' With tips enabled, 95% of donors choose to contribute, keeping your platform fees at zero!'
                : ' This helps ensure more of your donation goes directly to the animals.'
              }
            </p>
            <div style={{
              background: 'rgba(252, 151, 202, 0.1)',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid rgba(252, 151, 202, 0.2)',
              marginTop: '1rem'
            }}>
              <p style={{ 
                fontSize: '0.95rem', 
                color: 'var(--text)', 
                opacity: 0.8,
                fontStyle: 'italic',
                margin: 0,
                fontWeight: 500
              }}>
                <strong></strong> The average Zoomies campaign keeps 99.5% of all funds raised since most donors cover fees!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '4rem' }}>
        <h1 style={{ 
          fontFamily: 'Calistoga, serif', 
          fontSize: '2rem', 
          color: 'var(--primary)', 
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          Choose Your Plan
        </h1>
        <p style={{ 
          fontSize: '1rem', 
          color: 'var(--text)', 
          marginBottom: '2rem',
          textAlign: 'center',
          opacity: 0.8
        }}>
          Support animal sanctuaries and join our community with the perfect plan for you.
        </p>
        
        {/* User Type Toggle */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '1.5rem',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.75rem 1.5rem',
            background: 'rgba(252, 151, 202, 0.1)',
            borderRadius: '25px',
            border: '1px solid rgba(252, 151, 202, 0.2)'
          }}>
            <span style={{ 
              color: selectedUserType === 'sanctuaries' ? 'var(--primary)' : 'var(--text)', 
              fontWeight: 600,
              fontSize: '1rem',
              opacity: selectedUserType === 'sanctuaries' ? 1 : 0.6,
              transition: 'all 0.3s ease'
            }}>
              Sanctuaries
            </span>
            <div style={{
              position: 'relative',
              width: 60,
              height: 30,
              background: selectedUserType === 'sanctuaries' ? 'var(--primary)' : 'var(--gray)',
              borderRadius: 15,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selectedUserType === 'sanctuaries' ? '0 4px 12px rgba(252, 151, 202, 0.4)' : '0 2px 4px rgba(0,0,0,0.1)'
            }} onClick={() => setSelectedUserType(selectedUserType === 'sanctuaries' ? 'community' : 'sanctuaries')}>
              <div style={{
                position: 'absolute',
                top: 3,
                left: selectedUserType === 'sanctuaries' ? 3 : 33,
                width: 24,
                height: 24,
                background: '#fff',
                borderRadius: '50%',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} />
            </div>
            <span style={{ 
              color: selectedUserType === 'community' ? 'var(--primary)' : 'var(--text)', 
              fontWeight: 600,
              fontSize: '1rem',
              opacity: selectedUserType === 'community' ? 1 : 0.6,
              transition: 'all 0.3s ease'
            }}>
              Community
            </span>
          </div>
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
            background: 'rgba(252, 151, 202, 0.05)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: tier.popular ? '2px solid var(--primary)' : '1px solid rgba(252, 151, 202, 0.1)',
            position: 'relative'
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