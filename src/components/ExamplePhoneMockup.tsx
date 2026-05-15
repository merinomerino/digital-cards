'use client'

import Image from 'next/image'

export interface ExamplePhoneMockupData {
  variant: 'tattoo' | 'vet' | 'travel'
  logo: string
  name: string
  subtitle: string
  buttons: ButtonItem[]
  services: ServiceItem[]
  schedule: string
}

interface ButtonItem {
  icon: string
  title: string
  subtitle: string
  href: string
}

interface ServiceItem {
  name: string
  price: string
}

interface Props {
  data: ExamplePhoneMockupData
}

function PhoneFrame({ children, shadowColor }: { children: React.ReactNode; shadowColor: string }) {
  return (
    <div className="flex justify-center">
      <div
        className="phone-frame"
        style={{
          width: 370,
          height: 750,
          borderRadius: 40,
          padding: 14,
          background: 'linear-gradient(180deg,#1a1a1a,#050505)',
          border: '3px solid rgba(255,255,255,.1)',
          boxShadow: `0 0 20px ${shadowColor}66, 0 0 60px ${shadowColor}33, inset 0 0 15px rgba(255,255,255,.05)`,
          overflow: 'hidden',
          transformOrigin: 'top center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 28,
            borderRadius: 20,
            background: '#0d0d0d',
            zIndex: 10,
          }}
        />
        {children}
      </div>
    </div>
  )
}

/* ─── TATTOO VARIANT ─── */
function TattooCard({ data }: { data: ExamplePhoneMockupData }) {
  const { logo, name, subtitle, buttons, services, schedule } = data

  return (
    <PhoneFrame shadowColor="#00ff88">
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 30,
          overflow: 'hidden',
          background: '#0a0a0f',
          position: 'relative',
          padding: '60px 0 0',
        }}
      >
        {/* neon glow orbs */}
        <div style={{ position: 'absolute', width: 250, height: 250, background: 'rgba(0,255,136,.12)', filter: 'blur(80px)', borderRadius: '50%', top: -60, left: -80 }} />
        <div style={{ position: 'absolute', width: 200, height: 200, background: 'rgba(0,255,136,.08)', filter: 'blur(60px)', borderRadius: '50%', bottom: 100, right: -60 }} />

        {/* diagonal slash accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '60%',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(0,255,136,.03), transparent 60%)',
            clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0% 100%)',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, padding: '0 18px' }}>
          {/* logo */}
          <div
            style={{
              width: 90,
              height: 90,
              margin: '0 auto 12px',
              borderRadius: '50%',
              border: '2px solid rgba(0,255,136,.4)',
              overflow: 'hidden',
              background: '#000',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0,255,136,.3), inset 0 0 15px rgba(0,255,136,.1)',
            }}
          >
            <Image src={logo} alt={name} fill style={{ objectFit: 'cover' }} />
          </div>

          {/* name */}
          <h2
            style={{
              fontFamily: "'Impact','Arial Black',sans-serif",
              fontSize: 40,
              letterSpacing: 4,
              textAlign: 'center',
              lineHeight: 1,
              color: '#fff',
              textTransform: 'uppercase',
              textShadow: '0 0 20px rgba(0,255,136,.4)',
            }}
          >
            {name}
          </h2>

          {/* subtitle with strike-through style */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, marginBottom: 22 }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,rgba(0,255,136,.3))' }} />
            <span style={{ color: '#00ff88', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700 }}>{subtitle}</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(0,255,136,.3),transparent)' }} />
          </div>

          {/* buttons - pill style */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {buttons.map((btn) => (
              <a
                key={btn.title}
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline transition-all"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 16px',
                  borderRadius: 50,
                  background: 'rgba(0,255,136,.06)',
                  border: '1px solid rgba(0,255,136,.15)',
                  color: 'white',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,255,136,.15)'
                  e.currentTarget.style.borderColor = 'rgba(0,255,136,.4)'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0,255,136,.06)'
                  e.currentTarget.style.borderColor = 'rgba(0,255,136,.15)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 15,
                    fontWeight: 'bold',
                    background: 'rgba(0,255,136,.15)',
                    color: '#00ff88',
                    flexShrink: 0,
                  }}
                >
                  {btn.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{btn.title}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', marginTop: 1 }}>{btn.subtitle}</div>
                </div>
              </a>
            ))}
          </div>

          {/* services - flash sheet grid */}
          <div style={{ marginTop: 20, position: 'relative' }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 3,
                color: '#00ff88',
                textTransform: 'uppercase',
                marginBottom: 10,
                textAlign: 'center',
              }}
            >
              ⚡ Flash disponible
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 6,
              }}
            >
              {services.map((svc) => (
                <div
                  key={svc.name}
                  style={{
                    padding: '10px 12px',
                    background: 'rgba(0,255,136,.04)',
                    border: '1px solid rgba(0,255,136,.1)',
                    borderRadius: 8,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{svc.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#00ff88', marginTop: 2 }}>{svc.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* schedule */}
          <div style={{ marginTop: 16, textAlign: 'center', padding: '12px 0', borderTop: '1px solid rgba(0,255,136,.1)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#00ff88', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Horario</div>
            <div
              style={{ fontSize: 10, lineHeight: 1.8, color: 'rgba(255,255,255,.6)' }}
              dangerouslySetInnerHTML={{ __html: schedule.replace(/\n/g, '<br>') }}
            />
          </div>

          <div style={{ marginTop: 10, textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,.3)', letterSpacing: 1 }}>
            ▼ Chekolettes Ink
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ─── VET VARIANT ─── */
function VetCard({ data }: { data: ExamplePhoneMockupData }) {
  const { logo, name, subtitle, buttons, services, schedule } = data

  return (
    <PhoneFrame shadowColor="#2dd4bf">
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 30,
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #0f2b2a 0%, #0a1a1a 100%)',
          position: 'relative',
          padding: '60px 18px 20px',
        }}
      >
        {/* top decorative wave */}
        <svg
          style={{ position: 'absolute', top: 50, left: 0, width: '100%', opacity: 0.08 }}
          viewBox="0 0 400 120"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C80,20 160,80 240,40 C320,0 360,60 400,30 L400,120 L0,120 Z" fill="#2dd4bf" />
        </svg>

        {/* paw decoration */}
        <div
          style={{
            position: 'absolute',
            top: 70,
            right: 30,
            fontSize: 40,
            opacity: 0.06,
            transform: 'rotate(-15deg)',
          }}
        >
          🐾
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* logo with paw frame */}
          <div
            style={{
              width: 88,
              height: 88,
              margin: '0 auto 10px',
              borderRadius: 30,
              border: '3px solid rgba(45,212,191,.3)',
              overflow: 'hidden',
              background: '#000',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(45,212,191,.2)',
              transform: 'rotate(-5deg)',
            }}
          >
            <Image src={logo} alt={name} fill style={{ objectFit: 'cover', transform: 'rotate(5deg)' }} />
          </div>

          {/* name */}
          <h2
            style={{
              fontFamily: "'Trebuchet MS','Comic Sans MS',sans-serif",
              fontSize: 34,
              letterSpacing: 0,
              textAlign: 'center',
              lineHeight: 1.1,
              color: '#fff',
              fontWeight: 800,
            }}
          >
            {name}
          </h2>
          <p
            style={{
              textAlign: 'center',
              marginTop: 2,
              color: '#2dd4bf',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {subtitle}
          </p>

          {/* friendly buttons - rounded with icons */}
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {buttons.map((btn) => (
              <a
                key={btn.title}
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline transition-all"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '13px 16px',
                  borderRadius: 20,
                  background: 'rgba(255,255,255,.04)',
                  border: '1px solid rgba(255,255,255,.06)',
                  color: 'white',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(45,212,191,.12)'
                  e.currentTarget.style.borderColor = 'rgba(45,212,191,.3)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,.04)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 17,
                    background: 'rgba(45,212,191,.15)',
                    flexShrink: 0,
                  }}
                >
                  {btn.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{btn.title}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', marginTop: 1 }}>{btn.subtitle}</div>
                </div>
              </a>
            ))}
          </div>

          {/* services - clean list with paw accent */}
          <div
            style={{
              marginTop: 20,
              background: 'rgba(45,212,191,.05)',
              borderRadius: 20,
              padding: 16,
              border: '1px solid rgba(45,212,191,.1)',
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#2dd4bf',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 12,
              }}
            >
              🐾 Servicios
            </div>
            {services.map((svc, i) => (
              <div
                key={svc.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '7px 0',
                  borderBottom: i < services.length - 1 ? '1px solid rgba(45,212,191,.08)' : 'none',
                  fontSize: 12,
                }}
              >
                <span style={{ color: 'rgba(255,255,255,.85)' }}>{svc.name}</span>
                <span style={{ color: '#2dd4bf', fontWeight: 700 }}>{svc.price}</span>
              </div>
            ))}
          </div>

          {/* schedule */}
          <div
            style={{
              marginTop: 14,
              background: 'rgba(251,146,60,.08)',
              borderRadius: 16,
              padding: 12,
              textAlign: 'center',
              border: '1px solid rgba(251,146,60,.1)',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fb923c', marginBottom: 4 }}>🕐 Horario</div>
            <div
              style={{ fontSize: 11, lineHeight: 1.7, color: 'rgba(255,255,255,.7)' }}
              dangerouslySetInnerHTML={{ __html: schedule.replace(/\n/g, '<br>') }}
            />
          </div>

          <div style={{ marginTop: 12, textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,.3)' }}>
            🐶 🐱 🐾
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ─── TRAVEL VARIANT ─── */
function TravelCard({ data }: { data: ExamplePhoneMockupData }) {
  const { logo, name, subtitle, buttons, services, schedule } = data

  return (
    <PhoneFrame shadowColor="#f59e0b">
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 30,
          overflow: 'hidden',
          background: 'linear-gradient(170deg, #0c1222 0%, #162044 40%, #0c1222 100%)',
          position: 'relative',
          padding: '60px 0 0',
        }}
      >
        {/* world map dots pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.03,
            backgroundImage: `radial-gradient(circle at 20% 30%, #f59e0b 1px, transparent 1px),
                              radial-gradient(circle at 60% 50%, #f59e0b 1px, transparent 1px),
                              radial-gradient(circle at 80% 20%, #f59e0b 1px, transparent 1px),
                              radial-gradient(circle at 30% 70%, #f59e0b 1px, transparent 1px),
                              radial-gradient(circle at 70% 80%, #f59e0b 1px, transparent 1px)`,
            backgroundSize: '80px 80px, 60px 60px, 100px 100px, 70px 70px, 90px 90px',
          }}
        />

        {/* gold line accent top */}
        <div
          style={{
            position: 'absolute',
            top: 58,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(245,158,11,.4), transparent)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, padding: '0 20px' }}>
          {/* passport-style header */}
          <div
            style={{
              background: 'rgba(245,158,11,.06)',
              border: '1px solid rgba(245,158,11,.15)',
              borderRadius: 12,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginTop: 8,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 8,
                overflow: 'hidden',
                border: '2px solid rgba(245,158,11,.3)',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <Image src={logo} alt={name} fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: 'rgba(245,158,11,.6)', letterSpacing: 2, textTransform: 'uppercase' }}>Pasaporte</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: 0, marginTop: 0 }}>{name}</div>
              <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 500 }}>{subtitle}</div>
            </div>
            <div style={{ fontSize: 24, opacity: 0.3 }}>✈️</div>
          </div>

          {/* buttons - clean travel style */}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {buttons.map((btn, i) => (
              <a
                key={btn.title}
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline transition-all"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '13px 18px',
                  borderRadius: 10,
                  background: i === 0 ? 'linear-gradient(135deg, rgba(245,158,11,.12), rgba(245,158,11,.04))' : 'rgba(255,255,255,.03)',
                  border: i === 0 ? '1px solid rgba(245,158,11,.2)' : '1px solid rgba(255,255,255,.06)',
                  color: 'white',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(245,158,11,.12)'
                  e.currentTarget.style.borderColor = 'rgba(245,158,11,.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = i === 0 ? 'linear-gradient(135deg, rgba(245,158,11,.12), rgba(245,158,11,.04))' : 'rgba(255,255,255,.03)'
                  e.currentTarget.style.borderColor = i === 0 ? 'rgba(245,158,11,.2)' : 'rgba(255,255,255,.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 18 }}>{btn.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{btn.title}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.45)', marginTop: 1 }}>{btn.subtitle}</div>
                  </div>
                </div>
                <span style={{ color: '#f59e0b', fontSize: 11, opacity: 0.6 }}>→</span>
              </a>
            ))}
          </div>

          {/* services - elegantly styled */}
          <div
            style={{
              marginTop: 20,
              borderRadius: 12,
              border: '1px solid rgba(245,158,11,.1)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: 'rgba(245,158,11,.08)',
                padding: '10px 16px',
                fontSize: 11,
                fontWeight: 700,
                color: '#f59e0b',
                letterSpacing: 2,
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              🌍 Paquetes
            </div>
            <div style={{ padding: '8px 16px' }}>
              {services.map((svc, i) => (
                <div
                  key={svc.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: i < services.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none',
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: 'rgba(255,255,255,.8)' }}>{svc.name}</span>
                  <span style={{ color: '#f59e0b', fontWeight: 600 }}>{svc.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* schedule */}
          <div
            style={{
              marginTop: 14,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,.04)',
              padding: 12,
              textAlign: 'center',
              background: 'rgba(255,255,255,.02)',
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(245,158,11,.6)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
              🕐 Horario de atención
            </div>
            <div
              style={{ fontSize: 11, lineHeight: 1.7, color: 'rgba(255,255,255,.6)' }}
              dangerouslySetInnerHTML={{ __html: schedule.replace(/\n/g, '<br>') }}
            />
          </div>

          {/* boarding pass style footer */}
          <div
            style={{
              marginTop: 16,
              borderTop: '2px dashed rgba(245,158,11,.15)',
              padding: '12px 0',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <div style={{ fontSize: 9, color: 'rgba(245,158,11,.4)', letterSpacing: 2, textTransform: 'uppercase' }}>
              ✈️ Viaja con confianza · cardlink.mx/viajes-merino
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

export default function ExamplePhoneMockup({ data }: Props) {
  switch (data.variant) {
    case 'tattoo':
      return <TattooCard data={data} />
    case 'vet':
      return <VetCard data={data} />
    case 'travel':
      return <TravelCard data={data} />
    default:
      return <TattooCard data={data} />
  }
}
