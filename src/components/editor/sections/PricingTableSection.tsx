import React from 'react';
import { Check } from 'lucide-react';

const PricingTableSection: React.FC<{ props: Record<string, any> }> = ({ props }) => {
  const { device } = props;
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';

  const heading = props.heading ?? 'Simple, Transparent Pricing';
  const plans = props.plans || [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      features: ['Up to 100 products', '2 staff accounts', 'Basic analytics', 'Email support', '2% transaction fee'],
      buttonText: 'Start Free Trial',
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '$79',
      period: '/month',
      features: ['Unlimited products', '5 staff accounts', 'Advanced analytics', 'Priority support', '1% transaction fee', 'Custom domain', 'Gift cards'],
      buttonText: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: '$299',
      period: '/month',
      features: ['Unlimited everything', '15 staff accounts', 'Custom reports', 'Dedicated manager', '0.5% transaction fee', 'Custom domain', 'Advanced API access'],
      buttonText: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <section style={{ 
      width: '100%', 
      backgroundColor: 'var(--theme-background)',
      position: 'relative',
      overflow: 'hidden',
      ...(props._marginStyle || {}),
    }}>
      <div style={{
        padding: isMobile ? '40px 24px' : '80px 48px',
        maxWidth: props._layoutWidth ?? '100%',
        margin: '0 auto',
        ...(props._paddingStyle || {}),
      }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{
          fontSize: isMobile ? '32px' : '40px',
          fontWeight: 700,
          letterSpacing: '-1px',
          color: 'var(--theme-text)',
          fontFamily: 'var(--theme-font-heading), sans-serif',
        }}>
          {heading}
        </h2>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${isMobile ? 1 : (isTablet ? 2 : Math.min(plans.length, 3))}, 1fr)`,
        gap: '24px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        {plans.map((plan: any, i: number) => (
          <div key={i} style={{
            borderRadius: '20px',
            border: plan.highlighted ? '2px solid var(--theme-primary)' : '1px solid #e2e8f0',
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            backgroundColor: plan.highlighted ? 'var(--theme-primary)' : 'white',
            color: plan.highlighted ? 'white' : 'var(--theme-text)',
            position: 'relative',
            boxShadow: plan.highlighted ? '0 20px 40px -10px rgba(0,0,0,0.15)' : 'none',
            transform: plan.highlighted && !isMobile && !isTablet ? 'scale(1.05)' : 'none',
          }}>
            {plan.highlighted && (
              <span style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'var(--theme-secondary)',
                color: 'white',
                fontSize: '12px',
                fontWeight: 700,
                padding: '4px 16px',
                borderRadius: '999px',
                whiteSpace: 'nowrap',
              }}>
                Most Popular
              </span>
            )}
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{plan.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-2px' }}>{plan.price}</span>
                <span style={{ fontSize: '16px', opacity: 0.7 }}>{plan.period}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {plan.features.map((feature: string, j: number) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                  <Check size={16} style={{ flexShrink: 0, color: plan.highlighted ? 'white' : 'var(--theme-primary)' }} />
                  {feature}
                </div>
              ))}
            </div>
            <button style={{
              padding: '14px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              border: plan.highlighted ? '1px solid rgba(255,255,255,0.3)' : '1px solid var(--theme-primary)',
              backgroundColor: plan.highlighted ? 'white' : 'transparent',
              color: plan.highlighted ? 'var(--theme-primary)' : 'var(--theme-primary)',
              transition: 'all 0.2s',
            }}>
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default PricingTableSection;
