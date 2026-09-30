'use client'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body style={{ margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', background: '#16091a', color: '#fcfafc' }}>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
          <section style={{ width: 'min(100%, 560px)', border: '1px solid rgba(236,216,242,.15)', borderRadius: 28, background: 'rgba(54,27,61,.78)', padding: 32, textAlign: 'center' }}>
            <div style={{ color: '#d1b5d1', fontSize: 12, letterSpacing: '.18em', fontWeight: 700 }}>NEXT STUDIO</div>
            <h1 style={{ margin: '18px 0 0', fontSize: 28 }}>The studio shell encountered a fatal error.</h1>
            <p style={{ margin: '12px auto 0', maxWidth: 440, color: '#d4c4d5', lineHeight: 1.7 }}>Retry the application. If the issue persists, inspect the build output for the failing repository read.</p>
            <button onClick={reset} style={{ marginTop: 24, height: 42, border: 0, borderRadius: 12, background: '#d1b5d1', color: '#280a30', padding: '0 18px', fontWeight: 700 }}>Retry</button>
          </section>
        </main>
      </body>
    </html>
  )
}
