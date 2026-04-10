(function() {
    const React = window.React;
    const { useState, useEffect, useMemo } = React;
    const { createRoot } = window.ReactDOM;
    const html = window.htm.bind(React.createElement);
    
    const motion = window.Motion ? window.Motion.motion : null;
    const AnimatePresence = window.Motion ? window.Motion.AnimatePresence : null;
    const technicalSpring = { type: "spring", stiffness: 450, damping: 35 };

    const MOCK_WORKSHOPS = [
        { id: 1, name: 'Python Basics', duration: 3, content: 'Introduction to Python programming for beginners', status: 'Open', participants: 45, max_participants: 50, organized_by: 'IIT Bombay', department: 'Computer Science' },
        { id: 2, name: 'Linux Fundamentals', duration: 2, content: 'Linux operating system hands-on workshop', status: 'Open', participants: 30, max_participants: 40, organized_by: 'FOSSEE', department: 'IT' },
        { id: 3, name: 'Scilab Programming', duration: 3, content: 'Numerical computing with Scilab', status: 'Open', participants: 25, max_participants: 30, organized_by: 'IIT Bombay', department: 'Mathematics' },
        { id: 4, name: 'eSim Circuit Design', duration: 5, content: 'Electronic circuit simulation using eSim', status: 'Open', participants: 20, max_participants: 25, organized_by: 'FOSSEE', department: 'Electronics' },
        { id: 5, name: 'Advanced Python', duration: 5, content: 'Advanced Python programming and data analysis', status: 'Pending', participants: 0, max_participants: 35, organized_by: 'IIT Bombay', department: 'Computer Science' },
        { id: 6, name: 'Arduino Workshop', duration: 2, content: 'IoT basics with Arduino', status: 'Open', participants: 35, max_participants: 40, organized_by: 'FOSSEE', department: 'Electronics' },
    ];

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
            X: html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
            Clock: html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
            Users: html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
            Calendar: html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
            ArrowRight: html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
            Check: html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
            ChevronLeft: html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`,
            LogOut: html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
        };
        return i[name] || html`<div style=${{width:size, height:size, border:'1px solid var(--text-low)'}} />`;
    };

    const ForgeCard = ({ children, title, subtitle, style = {}, className = '', onClick }) => html`
        <div className=${`forge-card ${className}`} style=${{ padding: '1.5rem', ...style }} onClick=${onClick}>
            ${title && html`
                <header style=${{ marginBottom: '1.25rem' }}>
                    <div className="mono" style=${{ color: 'var(--accent-cyan)', fontSize: '0.6rem', marginBottom: '4px' }}>${subtitle || 'MODULE'}</div>
                    <div className="font-display" style=${{ fontSize: '1.1rem', fontWeight: 600 }}>${title}</div>
                </header>
            `}
            ${children}
        </div>
    `;

    const Sidebar = ({ activePage, setPage, isOpen, onClose, isLoggedIn, onLogout }) => html`
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
                    const needsLogin = id === 'dashboard';
                    const disabled = needsLogin && !isLoggedIn;
                    return html`
                        <button key=${id} onClick=${() => { 
                            if (disabled) {
                                alert('Please login to access Dashboard');
                                return;
                            }
                            setPage(id); 
                            if (onClose) onClose(); 
                        }} 
                        className=${`forge-nav-link ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`} 
                        style=${{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', border: 'none', background: 'transparent', opacity: disabled ? 0.5 : 1 }}>
                            <${Icon} name=${id === 'home' ? 'Layers' : id === 'dashboard' ? 'Activity' : 'Cpu'} size=${14} />
                            ${item}
                        </button>
                    `;
                })}
            </nav>

            <div style=${{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                ${isLoggedIn ? html`
                    <div className="forge-card" style=${{ padding: '0.75rem', background: '#080808', border: '1px solid #1a1a1a' }}>
                        <div style=${{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <${Icon} name="User" size=${14} color="var(--accent-cyan)" />
                            <span className="mono" style=${{ color: 'var(--text-mid)', fontSize: '0.6rem' }}>admin_user</span>
                        </div>
                    </div>
                    <button className="forge-nav-link" onClick=${onLogout} style=${{ justifyContent: 'center' }}>
                        <${Icon} name="LogOut" size=${14} />
                        Logout
                    </button>
                ` : html`
                    <button className="btn-forge" style=${{ width: '100%', justifyContent: 'center' }} onClick=${() => setPage('login')}>
                        <${Icon} name="User" size=${14} />
                        Login
                    </button>
                `}
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

    const HomePage = ({ onExplore }) => html`
        <${motion ? motion.div : 'div'} initial=${{opacity:0, y:10}} animate=${{opacity:1, y:0}} transition=${technicalSpring} className="main-content" style=${{ paddingLeft: '240px', minHeight: '100vh' }}>
            <div style=${{ maxWidth: '1000px', margin: '0 auto', padding: '6rem 3rem' }}>
                <header style=${{ marginBottom: '5rem' }}>
                    <div className="mono" style=${{ color: 'var(--text-low)', marginBottom: '0.75rem', fontSize: '0.65rem' }}>IITB_TECH // FOSSEE_PROTOCOL_042</div>
                    <h1 className="hero-title" style=${{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: 0.9, marginBottom: '2.5rem', fontWeight: 800 }}>
                        ENGINEERING <br/> <span style=${{ color: 'var(--accent-cyan)' }}>THE FUTURE.</span>
                    </h1>
                    <div className="btn-group" style=${{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-forge" onClick=${onExplore}>EXPLORE_WORKSHOPS</button>
                        <button className="btn-forge-ghost">LEARN_MORE</button>
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

    const WorkshopsPage = ({ workshops, onSelectWorkshop }) => {
        const [searchTerm, setSearchTerm] = useState('');
        const [filter, setFilter] = useState('all');
        
        const filteredWorkshops = useMemo(() => {
            return workshops.filter(ws => {
                const matchesSearch = ws.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  ws.content.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesFilter = filter === 'all' || 
                                  (filter === 'open' && ws.status === 'Open') ||
                                  (filter === 'pending' && ws.status === 'Pending');
                return matchesSearch && matchesFilter;
            });
        }, [workshops, searchTerm, filter]);

        return html`
            <div className="main-content" style=${{ paddingLeft: '240px', padding: '6rem 3rem' }}>
                <div style=${{ maxWidth: '1200px', margin: '0 auto' }}>
                    <header style=${{ marginBottom: '3rem' }}>
                        <div className="mono" style=${{ color: 'var(--accent-cyan)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>S_CODE: WORKSHOP_CATALOG</div>
                        <h2 style=${{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Workshop Catalog</h2>
                        
                        <div style=${{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style=${{ position: 'relative', flex: '1', minWidth: '250px' }}>
                                <${Icon} name="Search" size=${18} style=${{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-low)' }} />
                                <input 
                                    type="text" 
                                    placeholder="Search workshops..." 
                                    value=${searchTerm}
                                    onInput=${(e) => setSearchTerm(e.target.value)}
                                    style=${{ 
                                        width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem',
                                        background: 'var(--slate-surface)', border: '1px solid var(--slate-border)',
                                        borderRadius: 'var(--radius-sharp)', color: 'var(--text-high)',
                                        fontSize: '0.9rem', outline: 'none'
                                    }}
                                />
                            </div>
                            <select 
                                value=${filter}
                                onChange=${(e) => setFilter(e.target.value)}
                                style=${{ 
                                    padding: '0.75rem 1.5rem',
                                    background: 'var(--slate-surface)', border: '1px solid var(--slate-border)',
                                    borderRadius: 'var(--radius-sharp)', color: 'var(--text-high)',
                                    fontSize: '0.9rem', outline: 'none', cursor: 'pointer'
                                }}>
                                <option value="all">All Workshops</option>
                                <option value="open">Open</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </header>

                    <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        ${filteredWorkshops.map(ws => html`
                            <${ForgeCard} key=${ws.id} title=${ws.name} subtitle=${ws.status === 'Open' ? 'OPEN_FOR_REGISTRATION' : 'PENDING_APPROVAL'} 
                                className=${ws.status === 'Open' ? '' : 'pending'}
                                onClick=${() => onSelectWorkshop(ws)}
                                style=${{ cursor: 'pointer' }}>
                                <div style=${{ marginTop: '1rem' }}>
                                    <div style=${{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                        <${Icon} name="Clock" size=${14} color="var(--text-mid)" />
                                        <span className="mono" style=${{ color: 'var(--text-mid)', fontSize: '0.7rem' }}>${ws.duration} Days</span>
                                    </div>
                                    <p style=${{ color: 'var(--text-mid)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>${ws.content}</p>
                                    <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style=${{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <${Icon} name="Users" size=${14} color="var(--text-low)" />
                                            <span className="mono" style=${{ color: 'var(--text-low)', fontSize: '0.65rem' }}>${ws.participants}/${ws.max_participants}</span>
                                        </div>
                                        <div style=${{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)' }}>
                                            <span style=${{ fontSize: '0.8rem' }}>View Details</span>
                                            <${Icon} name="ArrowRight" size=${16} color="var(--accent-cyan)" />
                                        </div>
                                    </div>
                                </div>
                            </${ForgeCard}>
                        `)}
                    </div>

                    ${filteredWorkshops.length === 0 ? html`
                        <div style=${{ textAlign: 'center', padding: '4rem', color: 'var(--text-low)' }}>
                            <${Icon} name="Search" size=${48} color="var(--text-low)" />
                            <p style=${{ marginTop: '1rem' }}>No workshops found matching your criteria.</p>
                        </div>
                    ` : null}
                </div>
            </div>
        `;
    };

    const WorkshopDetailPage = ({ workshop, onBack, onBook }) => {
        if (!workshop) return html`<div></div>`;
        
        return html`
            <div className="main-content" style=${{ paddingLeft: '240px', padding: '6rem 3rem' }}>
                <div style=${{ maxWidth: '800px', margin: '0 auto' }}>
                    <button onClick=${onBack} style=${{ 
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'none', border: 'none', color: 'var(--text-mid)',
                        cursor: 'pointer', marginBottom: '1.5rem', padding: 0
                    }}>
                        <${Icon} name="ChevronLeft" size=${20} />
                        <span>Back to Workshops</span>
                    </button>

                    <div style=${{ marginBottom: '2rem' }}>
                        <div className="mono" style=${{ color: workshop.status === 'Open' ? 'var(--accent-cyan)' : 'var(--text-low)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>
                            ${workshop.status === 'Open' ? 'OPEN_FOR_REGISTRATION' : 'PENDING_APPROVAL'}
                        </div>
                        <h1 style=${{ fontSize: '2.5rem', fontWeight: 700 }}>${workshop.name}</h1>
                    </div>

                    <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                        <${ForgeCard} title="Duration" subtitle="WORKSHOP_LENGTH">
                            <div style=${{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
                                <${Icon} name="Clock" size=${24} color="var(--accent-cyan)" />
                                <span style=${{ fontSize: '1.5rem', fontWeight: 600 }}>${workshop.duration} Days</span>
                            </div>
                        </${ForgeCard}>
                        <${ForgeCard} title="Participants" subtitle="ENROLLMENT">
                            <div style=${{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
                                <${Icon} name="Users" size=${24} color="var(--accent-cyan)" />
                                <span style=${{ fontSize: '1.5rem', fontWeight: 600 }}>${workshop.participants}/${workshop.max_participants}</span>
                            </div>
                        </${ForgeCard}>
                    </div>

                    <${ForgeCard} title="About this Workshop" subtitle="DESCRIPTION" style=${{ marginBottom: '2rem' }}>
                        <p style=${{ color: 'var(--text-mid)', fontSize: '0.95rem', lineHeight: 1.7 }}>${workshop.content}</p>
                    </${ForgeCard}>

                    <${ForgeCard} title="Organization" subtitle="HOST_DETAILS" style=${{ marginBottom: '2rem' }}>
                        <div style=${{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                            <div>
                                <div className="mono" style=${{ color: 'var(--text-low)', fontSize: '0.65rem', marginBottom: '0.25rem' }}>ORGANIZED_BY</div>
                                <div style=${{ fontSize: '1rem', fontWeight: 500 }}>${workshop.organized_by}</div>
                            </div>
                            <div>
                                <div className="mono" style=${{ color: 'var(--text-low)', fontSize: '0.65rem', marginBottom: '0.25rem' }}>DEPARTMENT</div>
                                <div style=${{ fontSize: '1rem', fontWeight: 500 }}>${workshop.department}</div>
                            </div>
                        </div>
                    </${ForgeCard}>

                    ${workshop.status === 'Open' ? html`
                        <button className="btn-forge" style=${{ width: '100%', padding: '1rem', fontSize: '1rem' }} onClick=${onBook}>
                            <${Icon} name="Calendar" size=${20} />
                            PROPOSE THIS WORKSHOP
                        </button>
                    ` : html`
                        <div className="forge-card" style=${{ padding: '1.5rem', textAlign: 'center', opacity: 0.6 }}>
                            <div className="mono" style=${{ color: 'var(--text-low)' }}>This workshop is not yet open for proposals.</div>
                        </div>
                    `}
                </div>
            </div>
        `;
    };

    const DashboardPage = ({ workshops }) => html`
        <div className="main-content" style=${{ paddingLeft: '240px', padding: '6rem 3rem' }}>
            <div style=${{ maxWidth: '1000px', margin: '0 auto' }}>
                <header style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                    <div>
                        <div className="mono" style=${{ color: 'var(--accent-cyan)', fontSize: '0.7rem' }}>S_CODE: DASH_042</div>
                        <h2 style=${{ fontSize: '2.5rem', fontWeight: 700 }}>Dashboard</h2>
                    </div>
                    <div className="mono" style=${{ color: 'var(--text-low)', fontSize: '0.75rem' }}>U_TOKEN: ADMIN_USER</div>
                </header>

                <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
                    <${ForgeCard} title="Total Workshops" subtitle="ALL_TIME">
                        <div style=${{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--accent-cyan)' }}>${workshops.length}</div>
                    </${ForgeCard}>
                    <${ForgeCard} title="Open" subtitle="AVAILABLE">
                        <div style=${{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem', color: '#22c55e' }}>${workshops.filter(w => w.status === 'Open').length}</div>
                    </${ForgeCard}>
                    <${ForgeCard} title="Pending" subtitle="AWAITING">
                        <div style=${{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem', color: '#eab308' }}>${workshops.filter(w => w.status === 'Pending').length}</div>
                    </${ForgeCard}>
                    <${ForgeCard} title="Total Participants" subtitle="ENROLLED">
                        <div style=${{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--accent-cyan)' }}>
                            ${workshops.reduce((sum, w) => sum + w.participants, 0)}
                        </div>
                    </${ForgeCard}>
                </div>

                <div style=${{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                    <div style=${{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        ${workshops.slice(0, 4).map((ws, i) => html`
                            <${ForgeCard} key=${ws.id} title=${ws.name} subtitle=${`STAGED_INIT_0${i+1}`}>
                                <div style=${{ marginTop: '1.5rem' }}>
                                    <div style=${{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span className="mono" style=${{ color: 'var(--text-low)', fontSize: '0.65rem' }}>ENROLLMENT</span>
                                        <span className="mono" style=${{ color: 'var(--accent-cyan)', fontSize: '0.65rem' }}>${Math.round(ws.participants/ws.max_participants*100)}%</span>
                                    </div>
                                    <div style=${{ height: '4px', width: '100%', background: '#1a1a1a', borderRadius: '2px' }}>
                                        <div style=${{ height: '100%', width: `${Math.round(ws.participants/ws.max_participants*100)}%`, background: 'var(--accent-cyan)', borderRadius: '2px' }} />
                                    </div>
                                </div>
                            </${ForgeCard}>
                        `)}
                    </div>
                    <aside style=${{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <${ForgeCard} title="Quick Actions" subtitle="ADMIN_TOOLS">
                            <button className="btn-forge" style=${{ width: '100%', marginBottom: '0.75rem', justifyContent: 'center' }}><${Icon} name="Calendar" size=${14} /> CREATE WORKSHOP</button>
                            <button className="btn-forge-ghost" style=${{ width: '100%', justifyContent: 'center' }}><${Icon} name="Users" size=${14} /> VIEW REQUESTS</button>
                        </${ForgeCard}>
                    </aside>
                </div>
            </div>
        </div>
    `;

    const LoginPage = ({ onLogin, onBack }) => html`
        <div className="main-content" style=${{ paddingLeft: '240px', padding: '6rem 3rem' }}>
            <div style=${{ maxWidth: '400px', margin: '0 auto', paddingTop: '3rem' }}>
                <button onClick=${onBack} style=${{ 
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'none', border: 'none', color: 'var(--text-mid)',
                    cursor: 'pointer', marginBottom: '2rem', padding: 0
                }}>
                    <${Icon} name="ChevronLeft" size=${20} />
                    <span>Back to Home</span>
                </button>

                <${ForgeCard} title="Authentication" subtitle="LOGIN_REQUIRED" style=${{ marginBottom: '1.5rem' }}>
                    <form onSubmit=${(e) => { e.preventDefault(); onLogin(); }}>
                        <div style=${{ marginBottom: '1rem' }}>
                            <label className="mono" style=${{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-mid)', fontSize: '0.7rem' }}>USERNAME</label>
                            <input type="text" style=${{ 
                                width: '100%', padding: '0.75rem 1rem',
                                background: 'var(--ink-black)', border: '1px solid var(--slate-border)',
                                borderRadius: 'var(--radius-sharp)', color: 'var(--text-high)',
                                fontSize: '0.9rem', outline: 'none'
                            }} />
                        </div>
                        <div style=${{ marginBottom: '1.5rem' }}>
                            <label className="mono" style=${{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-mid)', fontSize: '0.7rem' }}>PASSWORD</label>
                            <input type="password" style=${{ 
                                width: '100%', padding: '0.75rem 1rem',
                                background: 'var(--ink-black)', border: '1px solid var(--slate-border)',
                                borderRadius: 'var(--radius-sharp)', color: 'var(--text-high)',
                                fontSize: '0.9rem', outline: 'none'
                            }} />
                        </div>
                        <button type="submit" className="btn-forge" style=${{ width: '100%', padding: '1rem' }}>
                            AUTHENTICATE
                        </button>
                    </form>
                </${ForgeCard}>

                <div style=${{ textAlign: 'center' }}>
                    <a href="#" style=${{ color: 'var(--text-mid)', fontSize: '0.85rem', textDecoration: 'none' }}>Forgot password?</a>
                </div>
            </div>
        </div>
    `;

    const App = () => {
        const [page, setPage] = useState('home');
        const [sidebarOpen, setSidebarOpen] = useState(false);
        const [isLoggedIn, setIsLoggedIn] = useState(false);
        const [selectedWorkshop, setSelectedWorkshop] = useState(null);
        
        useEffect(() => {
            const l = document.getElementById('initial-loader');
            if (l) { l.style.opacity = '0'; setTimeout(() => l.style.remove(), 600); }
        }, []);

        const handleSelectWorkshop = (ws) => setSelectedWorkshop(ws);
        const handleBack = () => setSelectedWorkshop(null);
        const handleBook = () => alert('Workshop proposal submitted! (Demo mode)');
        const handleLogin = () => { setIsLoggedIn(true); setPage('dashboard'); };

        const pages = {
            home: html`<${HomePage} key="home" onExplore=${() => setPage('workshops')} />`,
            workshops: html`<${WorkshopsPage} key="workshops" workshops=${MOCK_WORKSHOPS} onSelectWorkshop=${handleSelectWorkshop} />`,
            dashboard: html`<${DashboardPage} key="dashboard" workshops=${MOCK_WORKSHOPS} />`,
            login: html`<${LoginPage} key="login" onLogin=${handleLogin} onBack=${() => setPage('home')} />`,
            workshopDetail: html`<${WorkshopDetailPage} key="detail" workshop=${selectedWorkshop} onBack=${handleBack} onBook=${handleBook} />`
        };

        return html`
            <div style=${{ background: 'var(--ink-black)', minHeight: '100vh' }}>
                <${MobileToggle} isOpen=${sidebarOpen} onClick=${() => setSidebarOpen(!sidebarOpen)} />
                <${Sidebar} 
                    activePage=${page === 'workshopDetail' ? 'workshops' : page} 
                    setPage=${setPage} 
                    isOpen=${sidebarOpen} 
                    onClose=${() => setSidebarOpen(false)} 
                    isLoggedIn=${isLoggedIn}
                    onLogout=${() => setIsLoggedIn(false)}
                />
                <${AnimatePresence} mode="wait">
                    ${selectedWorkshop ? pages.workshopDetail : pages[page]}
                </${AnimatePresence}>
            </div>
        `;
    };

    try {
        const m = document.getElementById('root');
        if (m) createRoot(m).render(React.createElement(App));
    } catch (e) { 
        const err = document.getElementById('error-display');
        const txt = document.getElementById('error-text');
        if (err && txt) {
            err.style.display = 'block';
            txt.innerText = 'RUNTIME_ERR: ' + e.message + '\nApp.js may not be loading correctly.';
        }
    }
})();