import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt =
  'React Native CI/CD Workflow Builder — generate GitHub Actions workflows in minutes';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0f172a',
          padding: '60px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            display: 'flex',
            width: '80px',
            height: '4px',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            marginBottom: '40px',
          }}
        />

        {/* Badge row */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          {['Open Source', 'Free', 'No Sign-up'].map(label => (
            <div
              key={label}
              style={{
                display: 'flex',
                padding: '6px 16px',
                borderRadius: '9999px',
                border: '1px solid #334155',
                color: '#94a3b8',
                fontSize: '14px',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Main heading */}
        <div
          style={{
            display: 'flex',
            fontSize: '56px',
            fontWeight: 'bold',
            lineHeight: 1.15,
            color: '#f1f5f9',
            maxWidth: '800px',
            marginBottom: '24px',
          }}
        >
          React Native CI/CD Workflow Builder
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: '22px',
            color: '#94a3b8',
            maxWidth: '700px',
            lineHeight: 1.5,
            marginBottom: '48px',
          }}
        >
          Generate production-ready GitHub Actions and Bitrise workflows for
          your React Native or Expo app — in minutes, not hours.
        </div>

        {/* Bottom row: platform tags */}
        <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
          {[
            { label: 'GitHub Actions', color: '#6366f1' },
            { label: 'Bitrise', color: '#8b5cf6' },
            { label: 'React Native', color: '#06b6d4' },
            { label: 'Expo', color: '#10b981' },
          ].map(({ label, color }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                padding: '8px 18px',
                borderRadius: '8px',
                backgroundColor: '#1e293b',
                color,
                fontSize: '15px',
                fontWeight: '600',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Domain watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            right: '72px',
            color: '#475569',
            fontSize: '16px',
          }}
        >
          mobilecibuilder.com
        </div>
      </div>
    ),
    size
  );
}
