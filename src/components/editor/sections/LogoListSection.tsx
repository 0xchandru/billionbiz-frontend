import React from 'react';

const LogoListSection: React.FC<{ props: Record<string, any> }> = ({ props }) => {
  const { device } = props;
  const isMobile = device === 'mobile';

  const heading = props.heading || 'Trusted by Leading Brands';
  const logos = props.logos || [
    { name: 'Airbnb' },
    { name: 'Spotify' },
    { name: 'Stripe' },
    { name: 'Notion' },
    { name: 'Figma' },
    { name: 'Slack' },
  ];

  return (
    <section style={{
      padding: isMobile ? '40px 24px' : '60px 48px',
      backgroundColor: '#f8fafc',
      textAlign: 'center',
    }}>
      {heading && (
        <p style={{
          fontSize: '14px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: 'var(--theme-text)',
          opacity: 0.4,
          marginBottom: '32px',
        }}>
          {heading}
        </p>
      )}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: isMobile ? '24px' : '48px',
        flexWrap: 'wrap',
      }}>
        {logos.map((logo: any, i: number) => (
          <div key={i} style={{
            fontSize: '24px',
            fontWeight: 800,
            color: 'var(--theme-text)',
            opacity: 0.2,
            letterSpacing: '-0.5px',
            fontFamily: 'var(--theme-font, "Outfit"), sans-serif',
          }}>
            {logo.image ? (
              <img src={logo.image} alt={logo.name} style={{ height: '32px', objectFit: 'contain', opacity: 0.4 }} />
            ) : (
              logo.name
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default LogoListSection;
