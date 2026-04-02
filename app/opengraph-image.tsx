import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'LX3 — Software Studio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #06080E 0%, #0d1117 50%, #161b22 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: 72, fontWeight: 800, color: '#f0f3f8' }}>LX3</div>
          <div style={{ fontSize: 72, fontWeight: 800, color: '#fb923c' }}>.ai</div>
        </div>
        <div style={{ fontSize: 28, color: '#8b99ae', marginTop: 24, textAlign: 'center', maxWidth: 800 }}>
          Software Studio · Aplicaciones inteligentes para empresas
        </div>
        <div style={{ fontSize: 18, color: '#5e6e82', marginTop: 16 }}>
          Santiago, Chile
        </div>
      </div>
    ),
    { ...size }
  )
}
