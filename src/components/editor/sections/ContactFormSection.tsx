import React from 'react';

const ContactFormSection: React.FC<{ props: Record<string, any> }> = ({ props }) => {
  const { device } = props;
  const isMobile = device === 'mobile';

  const heading = props.heading || 'Get in Touch';
  const description = props.description || 'Have a question or need help? Fill out the form below and our team will get back to you within 24 hours.';
  const buttonText = props.buttonText || 'Send Message';
  const bgColor = props.bgColor || 'var(--theme-background)';

  return (
    <section style={{
      width: '100%',
      backgroundColor: bgColor,
      position: 'relative',
      overflow: 'hidden',
      ...(props._marginStyle || {}),
    }}>
      <div style={{
        padding: isMobile ? '40px 24px' : '80px 48px',
        maxWidth: props._layoutWidth || '100%',
        margin: '0 auto',
        ...(props._paddingStyle || {}),
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
        }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{
            fontSize: isMobile ? '32px' : '40px',
            fontWeight: 700,
            letterSpacing: '-1px',
            color: 'var(--theme-text)',
            marginBottom: '16px',
            fontFamily: 'var(--theme-font-heading), sans-serif',
          }}>
            {heading}
          </h2>
          <p style={{
            fontSize: '17px',
            lineHeight: 1.6,
            color: 'var(--theme-text)',
            opacity: 0.7,
          }}>
            {description}
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px' }}>
            <input
              type="text"
              placeholder="First name"
              style={{
                flex: 1,
                padding: '14px 16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '15px',
                fontFamily: 'inherit',
                backgroundColor: '#f8fafc',
                outline: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Last name"
              style={{
                flex: 1,
                padding: '14px 16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '15px',
                fontFamily: 'inherit',
                backgroundColor: '#f8fafc',
                outline: 'none',
              }}
            />
          </div>
          <input
            type="email"
            placeholder="Email address"
            style={{
              padding: '14px 16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '15px',
              fontFamily: 'inherit',
              backgroundColor: '#f8fafc',
              outline: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Subject"
            style={{
              padding: '14px 16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '15px',
              fontFamily: 'inherit',
              backgroundColor: '#f8fafc',
              outline: 'none',
            }}
          />
          <textarea
            placeholder="Your message"
            rows={5}
            style={{
              padding: '14px 16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '15px',
              fontFamily: 'inherit',
              backgroundColor: '#f8fafc',
              resize: 'vertical',
              outline: 'none',
            }}
          />
          <button style={{
            padding: '16px',
            backgroundColor: 'var(--theme-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: '8px',
          }}>
            {buttonText}
          </button>
        </form>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
