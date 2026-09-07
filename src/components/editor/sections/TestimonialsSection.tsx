import React from 'react';

const TestimonialsSection: React.FC<{ props: Record<string, any> }> = ({ props }) => {
  const { device } = props;
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';

  const heading = props.heading ?? 'What Our Customers Say';
  const testimonials = props.testimonials || [
    { name: 'Sarah Johnson', role: 'Interior Designer', quote: 'The quality of these products is outstanding. Every piece feels like a work of art that elevates any space.', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', rating: 5 },
    { name: 'Michael Chen', role: 'Architect', quote: 'I\'ve been a loyal customer for 3 years. The attention to detail and customer service is unmatched.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', rating: 5 },
    { name: 'Emily Parker', role: 'Home Stylist', quote: 'Fast shipping, beautiful packaging, and the products always exceed expectations. Highly recommend!', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', rating: 5 },
  ];

  return (
    <section style={{ 
      width: '100%', 
      backgroundColor: 'var(--theme-background)',
      position: 'relative',
      overflow: 'hidden',
      ...props._marginStyle,
    }}>
      <div style={{
        padding: isMobile ? '40px 24px' : '80px 48px',
        maxWidth: props._layoutWidth ?? '100%',
        margin: '0 auto',
        ...props._paddingStyle,
      }}>
      <h2 style={{
        fontSize: isMobile ? '32px' : '40px',
        fontWeight: 700,
        letterSpacing: '-1px',
        color: 'var(--theme-text)',
        textAlign: 'center',
        marginBottom: '48px',
        fontFamily: 'var(--theme-font-heading), sans-serif',
      }}>
        {heading}
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${isMobile ? 1 : (isTablet ? 2 : Math.min(testimonials.length, 3))}, 1fr)`,
        gap: '32px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {testimonials.map((t: any, i: number) => (
          <div key={i} style={{
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[...Array(t.rating || 5)].map((_, j) => (
                <span key={j} style={{ color: '#facc15', fontSize: '18px' }}>★</span>
              ))}
            </div>
            <p style={{
              fontSize: '16px',
              lineHeight: 1.7,
              color: 'var(--theme-text)',
              opacity: 0.8,
              flex: 1,
              fontStyle: 'italic',
            }}>
              "{t.quote}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
              <img
                src={t.avatar}
                alt={t.name}
                style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--theme-text)' }}>{t.name}</p>
                <p style={{ fontSize: '13px', color: 'var(--theme-text)', opacity: 0.5 }}>{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
