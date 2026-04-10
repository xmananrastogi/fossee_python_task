(function() {
    const React = window.React;
    const { useState, useEffect } = React;
    const { createRoot } = window.ReactDOM;
    const html = window.htm.bind(React.createElement);
    
    const motion = window.Motion ? window.Motion.motion : null;
    const AnimatePresence = window.Motion ? window.Motion.AnimatePresence : null;
    const technicalSpring = { type: "spring", stiffness: 450, damping: 35 };

    const Icon = ({ name, size = 16, color = 'currentColor' }) => {
        const i = {
            Layers: html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>`,
            Activity: html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
            Cpu: html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3"/><path d="M15 1v3"/><path d="M9 20v3"/><path d="M15 20v3"/><path d="M20 9h3"/><path d="M20 15h3"/><path d="M1 9h3"/><path d="M1 15h3"/></svg>`,
            Box: html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
            Terminal: html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
            Search: html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
            User: html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
            Menu: html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
            X: html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
        };
        return i[name] || html`<div style=${{width:size, height:size, border:'1px solid var(--text-low)'}} />`;
    };

    const ForgeCard = ({ children, title, subtitle, style = {}, className = '' }) => html`
        <div className=${`forge-card ${className}`} style=${{ padding: '1.5rem', ...style }}>
            ${title && html`
                <header style=${{ marginBottom: '1.25rem' }}>
                    <div className="mono" style=${{ color: 'var(--accent-cyan)', fontSize: '0.6rem', marginBottom: '4px' }}>${subtitle || 'MODULE'}</div>
                    <div className="font-display" style=${{ fontSize: '1.1rem', fontWeight: 600 }}>${title}</div>
                </header>
            `}
            ${children}
        </div>
    `;

    const Sidebar = ({ activePage, setPage, isOpen, onClose }) => html`
        <aside className=${`sidebar ${isOpen ? 'open' : ''}`} style=${{
            width: '240px', height: '100vh', position: 'fixed', left: 0, top: 0,
            background: 'var(--slate-dark)', borderRight: '1px solid var(--slate-border)',
            padding: '2rem 1.25rem', display: 'flex', flexDirection: 'column', zIndex: 100
        }}>
            <div style=${{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style=${{ width: '28px', height: '28px', background: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <${Icon} name="Box" size=${16} color="#000" />
                </div>
                <div className="mono" style=${{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-high)' }}>FORGE_V02</div>
            </div>

            <nav style=${{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div className="mono" style=${{ color: 'var(--text-low)', fontSize: '0.6rem', marginBottom: '10px', paddingLeft: '8px' }}>SYSTEM_ROOT</div>
                ${['Home', 'Workshops', 'Dashboard'].map(item => {
                    const id = item.toLowerCase();
                    const active = activePage === id;
                    return html`
                        <button key=${id} onClick=${() => { setPage(id); if (onClose) onClose(); }} className=${`forge-nav-link ${active ? 'active' : ''}`} style=${{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', border: 'none', background: 'transparent' }}>
                            <${Icon} name=${id === 'home' ? 'Layers' : id === 'dashboard' ? 'Activity' : 'Cpu'} size=${14} />
                            ${item}
                        </button>
                    `;
                })}
            </nav>

            <div style=${{ marginTop: 'auto' }}>
                <div className="forge-card" style=${{ padding: '0.75rem', background: '#080808', border: '1px solid #1a1a1a' }}>
                    <div style=${{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="status-indicator"></div>
                        <span className="mono" style=${{ color: 'var(--text-mid)', fontSize: '0.6rem' }}>ONLINE: ADMIN_01</span>
                    </div>
                </div>
            </div>
        </aside>
    `;

    const MobileToggle = ({ isOpen, onClick }) => html`
        <button className="mobile-toggle" onClick=${onClick} style=${{
            position: 'fixed', top: '1rem', left: '1rem', zIndex: 200,
            background: 'var(--slate-surface)', border: '1px solid var(--slate-border)',
            borderRadius: 'var(--radius-sharp)', padding: '0.5rem', cursor: 'pointer',
            display: 'none'
        }}>
            <${Icon} name=${isOpen ? 'X' : 'Menu'} size=${24} />
        </button>
        ${isOpen ? html`<div className="sidebar-overlay active" onClick=${onClick}></div>` : null}
    `;

    const HomePage = () => html`
        <${motion ? motion.div : 'div'} initial=${{opacity:0, y:10}} animate=${{opacity:1, y:0}} transition=${technicalSpring} className="main-content" style=${{ paddingLeft: '240px', minHeight: '100vh' }}>
            <div style=${{ maxWidth: '1000px', margin: '0 auto', padding: '6rem 3rem' }}>
                <header style=${{ marginBottom: '5rem' }}>
                    <div className="mono" style=${{ color: 'var(--text-low)', marginBottom: '0.75rem', fontSize: '0.65rem' }}>IITB_TECH // FOSSEE_PROTOCOL_042</div>
                    <h1 className="hero-title" style=${{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: 0.9, marginBottom: '2.5rem', fontWeight: 800 }}>
                        ENGINEERING <br/> <span style=${{ color: 'var(--accent-cyan)' }}>THE FUTURE.</span>
                    </h1>
                    <div className="btn-group" style=${{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-forge">BOOTSTRAP_PROPOSAL</button>
                        <button className="btn-forge-ghost">SYSTEM_DEX</button>
                    </div>
                </header>

                <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1rem' }}>
                    <${ForgeCard} title="45K+ Active Nodes" subtitle="NETWORK_DENSITY" style=${{ gridColumn: 'span 7' }}>
                        <p style=${{ color: 'var(--text-mid)', fontSize: '0.9rem' }}>Distributed research network tracking open-source adoption across 400+ technical institutions pan-India.</p>
                    </${ForgeCard}>
                    <${ForgeCard} title="Tier-1 Core" subtitle="AUTH_RANK" style=${{ gridColumn: 'span 5' }}>
                        <div className="mono" style=${{ color: 'var(--accent-cyan)', fontSize: '0.7rem' }}>VERIFIED_IIT_BOMBAY_SYSTEM</div>
                    </${ForgeCard}>
                    <${ForgeCard} title="99.8% Sync" subtitle="SYSTEM_UPTIME" style=${{ gridColumn: 'span 4' }}>
                        <${Icon} name="Activity" size=${24} color="var(--accent-cyan)" />
                    </${ForgeCard}>
                    <${ForgeCard} title="150+ Technical Modules" subtitle="RESOURCES" style=${{ gridColumn: 'span 8' }}>
                        <div style=${{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            ${['Python', 'Scilab', 'Linux', 'eSim'].map(lab => html`<div key=${lab} className="mono" style=${{ fontSize: '0.6rem', padding: '4px 8px', border: '1px solid var(--slate-border)', color: 'var(--text-low)' }}>${lab}</div>`)}
                        </div>
                    </${ForgeCard}>
                </div>
            </div>
        </${motion ? motion.div : 'div'}>
    `;

    const DashboardPage = () => html`
        <div className="main-content" style=${{ paddingLeft: '240px', padding: '6rem 3rem' }}>
            <div style=${{ maxWidth: '1000px', margin: '0 auto' }}>
                <header style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                    <div>
                        <div className="mono" style=${{ color: 'var(--accent-cyan)', fontSize: '0.7rem' }}>S_CODE: DASH_042</div>
                        <h2 style=${{ fontSize: '2.5rem', fontWeight: 700 }}>System Control</h2>
                    </div>
                    <div className="mono" style=${{ color: 'var(--text-low)', fontSize: '0.75rem' }}>U_TOKEN: V_X92_ARUN</div>
                </header>

                <div style=${{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                    <div style=${{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        ${['Linux Kernel Subsystems', 'Python Sci-Stack'].map((ws, i) => html`
                            <${ForgeCard} key=${ws} title=${ws} subtitle=${`STAGED_INIT_0${i+1}`}>
                                <div style=${{ marginTop: '2rem', height: '2px', width: '100%', background: '#1a1a1a' }}>
                                    <div style=${{ height: '100%', width: i === 0 ? '70%' : '100%', background: 'var(--accent-cyan)' }} />
                                </div>
                            </${ForgeCard}>
                        `)}
                    </div>
                    <aside style=${{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <${ForgeCard} title="Dr. Arun Varma">
                            <div className="mono" style=${{ fontSize: '0.65rem', color: 'var(--text-low)' }}>DEPT: AEROSPACE_CORP</div>
                        </${ForgeCard}>
                        <button className="btn-forge" style=${{ width: '100%', justifyContent: 'center' }}>[+] DEPLOY_TASK</button>
                    </aside>
                </div>
            </div>
        </div>
    `;

    const App = () => {
        const [page, setPage] = useState('home');
        const [sidebarOpen, setSidebarOpen] = useState(false);
        useEffect(() => {
            const l = document.getElementById('initial-loader');
            if (l) { l.style.opacity = '0'; setTimeout(() => l.style.remove(), 600); }
        }, []);
        return html`
            <div style=${{ background: 'var(--ink-black)', minHeight: '100vh' }}>
                <${MobileToggle} isOpen=${sidebarOpen} onClick=${() => setSidebarOpen(!sidebarOpen)} />
                <${Sidebar} activePage=${page} setPage=${setPage} isOpen=${sidebarOpen} onClose=${() => setSidebarOpen(false)} />
                <${AnimatePresence} mode="wait">
                    ${page === 'home' && html`<${HomePage} key="h" />`}
                    ${page === 'dashboard' && html`<${DashboardPage} key="d" />`}
                    ${page === 'workshops' && html`<div className="main-content" style=${{ paddingLeft: '240px', padding: '10rem', textAlign: 'center' }}><h1 className="mono">DB_INDEX_SYNC...</h1></div>`}
                </${AnimatePresence}>
            </div>
        `;
    };

    try {
        const m = document.getElementById('root');
        if (m) createRoot(m).render(React.createElement(App));
    } catch (e) { window.onerror('RUNTIME_ERR: ' + e.message, 'App.js', 0); }
})();
