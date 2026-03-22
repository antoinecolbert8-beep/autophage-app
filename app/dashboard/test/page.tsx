"use client";

export default function DashboardTestPage() {
    return (
        <div style={{ padding: '2rem', background: '#050508', color: '#0066FF', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '900' }}>SOVEREIGN TEST MODE</h1>
            <p>If you see this, the routing is stable. The main dashboard is crashing due to component complexity.</p>
            <div style={{ marginTop: '2rem', border: '1px solid #0066FF', padding: '1rem' }}>
                <pre>Status: SYSTEM_SYNC_ACTIVE</pre>
            </div>
            <button onClick={() => window.location.href = '/login'} style={{ marginTop: '1rem', background: '#0066FF', color: 'white', border: 'none', padding: '1rem 2rem', cursor: 'pointer' }}>
                RETURN TO LOGIN
            </button>
        </div>
    );
}
