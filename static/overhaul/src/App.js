// FOSSEE Workshop Portal - React frontend
// Uses React 18 via CDN + htm for templating (no build step needed)
(function () {
    'use strict';

    const { useState, useEffect, useMemo, useCallback, useRef } = React;
    const { createRoot } = ReactDOM;
    const html = htm.bind(React.createElement);

    // Mock data — mirrors the Django models

    const DEPARTMENT_CHOICES = [
        'Computer Science', 'Information Technology', 'Civil Engineering',
        'Electrical Engineering', 'Mechanical Engineering', 'Chemical Engineering',
        'Aerospace Engineering', 'Biosciences and BioEngineering', 'Electronics',
        'Energy Science and Engineering'
    ];

    const STATES = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
        'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
        'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttarakhand', 'Uttar Pradesh', 'West Bengal', 'Delhi'
    ];

    const WORKSHOP_TYPES = [
        { id: 1, name: 'Python 3.4.3', description: 'Introduction to Python programming. Covers basics of programming with hands-on examples, lists, tuples, dictionaries, conditionals, loops, and file handling.', duration: 1, terms: 'The coordinator agrees to arrange the lab, provide projector, and ensure at least 20 participants are present.' },
        { id: 2, name: 'Scilab', description: 'Workshop on Scilab, a free open source numerical computing software. Learn about matrix operations, plotting, and solving engineering problems.', duration: 2, terms: 'Scilab must be pre-installed on all lab machines. Coordinator must share attendance sheet after the workshop.' },
        { id: 3, name: 'Introduction to Linux', description: 'Hands-on workshop on Linux terminal usage, bash scripting, file system navigation, and system administration basics.', duration: 1, terms: 'All lab machines must have a Linux distro installed. Dual boot or VirtualBox is acceptable.' },
        { id: 4, name: 'eSim', description: 'Electronic circuit simulation using eSim – a free and open source EDA tool. Build schematics, run SPICE simulations, and analyze results.', duration: 3, terms: 'Participants should have a basic understanding of electronic circuits. eSim must be pre-installed.' },
        { id: 5, name: 'OpenFOAM', description: 'Computational fluid dynamics using OpenFOAM. Learn meshing, case setup, solver configuration, and post-processing of CFD simulations.', duration: 2, terms: 'OpenFOAM and ParaView must be pre-installed. Participants should have basic knowledge of fluid mechanics.' },
        { id: 6, name: 'DWSIM', description: 'Chemical process simulation using DWSIM. Covers flowsheeting, thermodynamic packages, and process optimization.', duration: 2, terms: 'DWSIM must be pre-installed. Participants should have understanding of basic thermodynamics.' },
        { id: 7, name: 'R', description: 'Statistical computing and graphics with R. Learn data manipulation, visualization, and statistical modelling.', duration: 1, terms: 'R and RStudio must be pre-installed on all machines.' },
        { id: 8, name: 'Spoken Tutorial', description: 'Using Spoken Tutorial for self-learning. This meta-workshop teaches educators how to use FOSSEE Spoken Tutorials effectively.', duration: 1, terms: 'Good internet connectivity required for streaming. Headphones for each participant.' },
    ];

    const MOCK_WORKSHOPS = [
        { id: 1, type: WORKSHOP_TYPES[0], coordinator: { name: 'Rahul Sharma', institute: 'NIT Warangal', email: 'rahul@nit.edu' }, instructor: { name: 'Dr. Priya Menon' }, date: '2026-05-15', status: 1 },
        { id: 2, type: WORKSHOP_TYPES[1], coordinator: { name: 'Ananya Gupta', institute: 'IIIT Hyderabad', email: 'ananya@iiith.edu' }, instructor: null, date: '2026-05-20', status: 0 },
        { id: 3, type: WORKSHOP_TYPES[2], coordinator: { name: 'Vikram Patel', institute: 'BITS Pilani', email: 'vikram@bits.edu' }, instructor: { name: 'Prof. Arun KP' }, date: '2026-04-28', status: 1 },
        { id: 4, type: WORKSHOP_TYPES[3], coordinator: { name: 'Sneha Iyer', institute: 'VIT Vellore', email: 'sneha@vit.edu' }, instructor: null, date: '2026-06-10', status: 0 },
        { id: 5, type: WORKSHOP_TYPES[0], coordinator: { name: 'Amit Das', institute: 'Jadavpur University', email: 'amit@ju.edu' }, instructor: { name: 'Dr. Priya Menon' }, date: '2026-04-10', status: 1 },
    ];

    const STATUS_MAP = { 0: 'Pending', 1: 'Accepted', 2: 'Deleted' };

    // Inline SVG icons (avoids external icon library dependency)
    const Svg = ({ children, size = 20, ...props }) =>
        html`<svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ...${props}>${children}</svg>`;

    const Icons = {
        Menu: (p) => html`<${Svg} ...${p}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/><//>`,
        X: (p) => html`<${Svg} ...${p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/><//>`,
        Search: (p) => html`<${Svg} ...${p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><//>`,
        Clock: (p) => html`<${Svg} ...${p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/><//>`,
        Users: (p) => html`<${Svg} ...${p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><//>`,
        User: (p) => html`<${Svg} ...${p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><//>`,
        Calendar: (p) => html`<${Svg} ...${p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><//>`,
        ArrowRight: (p) => html`<${Svg} ...${p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/><//>`,
        ChevronLeft: (p) => html`<${Svg} ...${p}><polyline points="15 18 9 12 15 6"/><//>`,
        ChevronDown: (p) => html`<${Svg} ...${p}><polyline points="6 9 12 15 18 9"/><//>`,
        Check: (p) => html`<${Svg} ...${p}><polyline points="20 6 9 17 4 12"/><//>`,
        LogOut: (p) => html`<${Svg} ...${p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/><//>`,
        Book: (p) => html`<${Svg} ...${p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><//>`,
        BarChart: (p) => html`<${Svg} ...${p}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/><//>`,
        Edit: (p) => html`<${Svg} ...${p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/><//>`,
        Home: (p) => html`<${Svg} ...${p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/><//>`,
        Info: (p) => html`<${Svg} ...${p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/><//>`,
        Send: (p) => html`<${Svg} ...${p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/><//>`,
    };

    // Navbar with responsive hamburger menu
    const Navbar = ({ page, setPage, user, onLogout }) => {
        const [mobileOpen, setMobileOpen] = useState(false);
        const [dropdownOpen, setDropdownOpen] = useState(false);
        const dropdownRef = useRef(null);

        // Close dropdown on outside click
        useEffect(() => {
            const handler = (e) => {
                if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                    setDropdownOpen(false);
                }
            };
            document.addEventListener('mousedown', handler);
            return () => document.removeEventListener('mousedown', handler);
        }, []);

        const navItems = user
            ? (user.position === 'instructor'
                ? [
                    { id: 'home', label: 'Home' },
                    { id: 'dashboard', label: 'Dashboard' },
                    { id: 'workshopTypes', label: 'Workshop Types' },
                    { id: 'statistics', label: 'Statistics' },
                ]
                : [
                    { id: 'home', label: 'Home' },
                    { id: 'status', label: 'My Workshops' },
                    { id: 'propose', label: 'Propose Workshop' },
                    { id: 'workshopTypes', label: 'Workshop Types' },
                ])
            : [
                { id: 'home', label: 'Home' },
                { id: 'workshopTypes', label: 'Workshop Types' },
            ];

        const handleNav = (id) => {
            setPage(id);
            setMobileOpen(false);
        };

        return html`
            <nav className="navbar" role="navigation" aria-label="Main navigation">
                <div className="navbar-inner">
                    <a className="navbar-brand" href="#" onClick=${(e) => { e.preventDefault(); setPage('home'); }}>
                        <div className="navbar-brand-icon">F</div>
                        <span>FOSSEE Workshops</span>
                    </a>

                    <!-- Desktop links -->
                    <ul className="navbar-links" role="menubar">
                        ${navItems.map(item => html`
                            <li key=${item.id} role="none">
                                <button role="menuitem" className=${`nav-link ${page === item.id ? 'active' : ''}`}
                                    onClick=${() => handleNav(item.id)}>${item.label}</button>
                            </li>
                        `)}
                    </ul>

                    <div className="navbar-auth" style=${{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ${user ? html`
                            <div className="user-menu" ref=${dropdownRef}>
                                <button className="user-menu-trigger" onClick=${() => setDropdownOpen(!dropdownOpen)}
                                    aria-expanded=${dropdownOpen} aria-haspopup="true">
                                    <div className="user-avatar-sm">${user.name.charAt(0).toUpperCase()}</div>
                                    <span>${user.name}</span>
                                    <${Icons.ChevronDown} size=${16} />
                                </button>
                                ${dropdownOpen && html`
                                    <div className="user-dropdown" role="menu">
                                        <button className="user-dropdown-item" role="menuitem"
                                            onClick=${() => { setDropdownOpen(false); setPage('profile'); }}>Profile</button>
                                        <button className="user-dropdown-item danger" role="menuitem"
                                            onClick=${() => { setDropdownOpen(false); onLogout(); }}>Logout</button>
                                    </div>
                                `}
                            </div>
                        ` : html`
                            <button className="nav-btn nav-btn-outline" onClick=${() => setPage('login')}>Sign In</button>
                            <button className="nav-btn nav-btn-primary" onClick=${() => setPage('register')}>Register</button>
                        `}
                    </div>

                    <!-- Hamburger (mobile) -->
                    <button className="hamburger" onClick=${() => setMobileOpen(true)}
                        aria-label="Open menu" aria-haspopup="true">
                        <${Icons.Menu} size=${24} />
                    </button>
                </div>
            </nav>

            <!-- Mobile drawer -->
            <div className=${`mobile-nav-overlay ${mobileOpen ? 'open' : ''}`}
                onClick=${() => setMobileOpen(false)} />
            <aside className=${`mobile-nav-drawer ${mobileOpen ? 'open' : ''}`}
                role="dialog" aria-label="Mobile navigation">
                <div className="mobile-nav-header">
                    <span style=${{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--primary-800)' }}>Menu</span>
                    <button className="mobile-nav-close" onClick=${() => setMobileOpen(false)} aria-label="Close menu">
                        <${Icons.X} size=${24} />
                    </button>
                </div>
                <ul className="mobile-nav-links" role="menu">
                    ${navItems.map(item => html`
                        <li key=${item.id} role="none">
                            <button role="menuitem" className=${`mobile-nav-link ${page === item.id ? 'active' : ''}`}
                                onClick=${() => handleNav(item.id)}>${item.label}</button>
                        </li>
                    `)}
                    <li role="none"><div className="divider" /></li>
                    ${user ? html`
                        <li role="none">
                            <button role="menuitem" className="mobile-nav-link" onClick=${() => handleNav('profile')}>
                                <${Icons.User} size=${18} /> Profile
                            </button>
                        </li>
                        <li role="none">
                            <button role="menuitem" className="mobile-nav-link" style=${{ color: 'var(--danger-500)' }}
                                onClick=${() => { setMobileOpen(false); onLogout(); }}>
                                <${Icons.LogOut} size=${18} /> Logout
                            </button>
                        </li>
                    ` : html`
                        <li role="none">
                            <button role="menuitem" className="mobile-nav-link" onClick=${() => handleNav('login')}>
                                <${Icons.User} size=${18} /> Sign In
                            </button>
                        </li>
                        <li role="none">
                            <button role="menuitem" className="mobile-nav-link" onClick=${() => handleNav('register')}>
                                <${Icons.Edit} size=${18} /> Register
                            </button>
                        </li>
                    `}
                </ul>
            </aside>
        `;
    };

    // Home page
    const HomePage = ({ setPage, user }) => html`
        <main>
            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-badge">
                        <span>🎓</span> IIT Bombay Initiative
                    </div>
                    <h1>Learn Open Source Tools Through Expert‑Led Workshops</h1>
                    <p className="hero-subtitle">
                        Book free workshops on Python, Scilab, Linux, eSim and more.
                        Conducted by FOSSEE, IIT Bombay for colleges across India.
                    </p>
                    <div className="hero-actions">
                        <button className="hero-btn hero-btn-accent" onClick=${() => setPage('workshopTypes')}>
                            Browse Workshops <${Icons.ArrowRight} size=${18} />
                        </button>
                        ${!user && html`
                            <button className="hero-btn hero-btn-outline" onClick=${() => setPage('register')}>
                                Register as Coordinator
                            </button>
                        `}
                    </div>
                </div>
            </section>

            <section className="stats-bar">
                <div className="stats-bar-inner">
                    <div className="stat-item">
                        <div className="stat-value">45,000+</div>
                        <div className="stat-label">Students Trained</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">400+</div>
                        <div className="stat-label">Partner Colleges</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">8</div>
                        <div className="stat-label">Workshop Types</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">29</div>
                        <div className="stat-label">States Covered</div>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="features-inner">
                    <h2 className="text-center">How It Works</h2>
                    <p className="text-center text-muted" style=${{ maxWidth: 540, margin: '8px auto 0' }}>
                        Three simple steps to organize a FOSSEE workshop at your college
                    </p>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon" style=${{ background: 'var(--primary-100)', color: 'var(--primary-700)' }}>📝</div>
                            <h3>1. Register</h3>
                            <p>Create a coordinator account with your college details. Verify your email to get started.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon" style=${{ background: 'var(--accent-100)', color: 'var(--accent-500)' }}>📅</div>
                            <h3>2. Propose</h3>
                            <p>Choose a workshop type, pick a date, accept the terms and submit your proposal for review.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon" style=${{ background: 'var(--success-100)', color: 'var(--success-500)' }}>🎯</div>
                            <h3>3. Conduct</h3>
                            <p>Once accepted by an instructor, coordinate the logistics and host the workshop at your college.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-section" style=${{ background: 'var(--surface-card)', borderTop: '1px solid var(--gray-200)' }}>
                <div className="features-inner text-center">
                    <h2>Popular Workshop Types</h2>
                    <p className="text-muted" style=${{ maxWidth: 480, margin: '8px auto 0' }}>
                        Browse our catalogue of free, expert-led workshops
                    </p>
                    <div className="features-grid" style=${{ marginTop: 32 }}>
                        ${WORKSHOP_TYPES.slice(0, 4).map(wt => html`
                            <div key=${wt.id} className="feature-card workshop-card" onClick=${() => setPage('workshopDetail_' + wt.id)}>
                                <h3>${wt.name}</h3>
                                <p className="workshop-card-desc">${wt.description}</p>
                                <div className="workshop-card-footer">
                                    <span className="workshop-card-meta">
                                        <${Icons.Clock} size=${14} /> ${wt.duration} day${wt.duration > 1 ? 's' : ''}
                                    </span>
                                    <span style=${{ color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        Details <${Icons.ArrowRight} size=${14} />
                                    </span>
                                </div>
                            </div>
                        `)}
                    </div>
                    <button className="btn btn-outline mt-6" onClick=${() => setPage('workshopTypes')}>View All Workshop Types</button>
                </div>
            </section>
        </main>
    `;

    // Login
    const LoginPage = ({ onLogin, setPage }) => {
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');
        const [position, setPosition] = useState('coordinator');

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!username.trim() || !password.trim()) {
                setError('Please enter both username and password.');
                return;
            }
            onLogin({ name: username, position });
        };

        return html`
            <div className="page-container" style=${{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="form-card" style=${{ width: '100%' }}>
                    <div className="card">
                        <div className="card-body" style=${{ padding: 'var(--space-8)' }}>
                            <h2 style=${{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>Welcome Back</h2>
                            <p className="text-center text-muted mb-6">Sign in to manage your workshops</p>
                            
                            ${error && html`<div className="alert alert-danger">${error}</div>`}

                            <form onSubmit=${handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="username">Username</label>
                                    <input id="username" className="form-input" type="text" placeholder="Enter your username"
                                        value=${username} onInput=${(e) => setUsername(e.target.value)} autocomplete="username" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="password">Password</label>
                                    <input id="password" className="form-input" type="password" placeholder="Enter your password"
                                        value=${password} onInput=${(e) => setPassword(e.target.value)} autocomplete="current-password" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Role (Demo)</label>
                                    <select className="form-select" value=${position} onChange=${(e) => setPosition(e.target.value)}>
                                        <option value="coordinator">Coordinator</option>
                                        <option value="instructor">Instructor</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                            </form>
                            <div className="divider" />
                            <div style=${{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <button className="link-btn" onClick=${() => setPage('register')}>New here? Create an account</button>
                                <button className="link-btn" style=${{ color: 'var(--gray-500)' }}>Forgot password?</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    // Registration form (matches Django's UserRegistrationForm + ProfileForm fields)
    const RegisterPage = ({ setPage, onLogin }) => {
        const [form, setForm] = useState({
            username: '', password: '', confirmPassword: '', email: '',
            first_name: '', last_name: '', institute: '', department: DEPARTMENT_CHOICES[0],
            phone: '', position: 'coordinator', state: 'Maharashtra', source: 'FOSSEE website',
            title: 'Mr'
        });
        const [error, setError] = useState('');

        const update = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!form.username || !form.password || !form.email || !form.first_name || !form.last_name || !form.institute || !form.phone) {
                setError('Please fill in all required fields.');
                return;
            }
            if (form.password !== form.confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
            if (form.phone.length !== 10) {
                setError('Phone number must be exactly 10 digits.');
                return;
            }
            onLogin({ name: form.first_name, position: form.position });
        };

        return html`
            <div className="page-container">
                <div className="form-card" style=${{ maxWidth: 560 }}>
                    <div className="page-header text-center">
                        <h1>Coordinator Registration</h1>
                        <p className="text-muted">Create your account to propose workshops</p>
                    </div>
                    
                    ${error && html`<div className="alert alert-danger">${error}</div>`}

                    <div className="card">
                        <div className="card-body">
                            <form onSubmit=${handleSubmit}>
                                <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                    <div className="form-group">
                                        <label className="form-label">Title *</label>
                                        <select className="form-select" value=${form.title} onChange=${update('title')}>
                                            ${['Mr', 'Mrs', 'Miss', 'Dr.', 'Prof.'].map(t => html`<option key=${t} value=${t}>${t}</option>`)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Username *</label>
                                        <input className="form-input" value=${form.username} onInput=${update('username')} placeholder="Username" required />
                                    </div>
                                </div>
                                <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                    <div className="form-group">
                                        <label className="form-label">First Name *</label>
                                        <input className="form-input" value=${form.first_name} onInput=${update('first_name')} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Last Name *</label>
                                        <input className="form-input" value=${form.last_name} onInput=${update('last_name')} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email *</label>
                                    <input className="form-input" type="email" value=${form.email} onInput=${update('email')} required />
                                </div>
                                <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                    <div className="form-group">
                                        <label className="form-label">Password *</label>
                                        <input className="form-input" type="password" value=${form.password} onInput=${update('password')} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Confirm Password *</label>
                                        <input className="form-input" type="password" value=${form.confirmPassword} onInput=${update('confirmPassword')} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Institute *</label>
                                    <input className="form-input" value=${form.institute} onInput=${update('institute')} placeholder="e.g. IIT Bombay" required />
                                </div>
                                <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                    <div className="form-group">
                                        <label className="form-label">Department *</label>
                                        <select className="form-select" value=${form.department} onChange=${update('department')}>
                                            ${DEPARTMENT_CHOICES.map(d => html`<option key=${d} value=${d}>${d}</option>`)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone (10 digits) *</label>
                                        <input className="form-input" value=${form.phone} onInput=${update('phone')} placeholder="9876543210" maxLength="10" required />
                                    </div>
                                </div>
                                <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                    <div className="form-group">
                                        <label className="form-label">State</label>
                                        <select className="form-select" value=${form.state} onChange=${update('state')}>
                                            ${STATES.map(s => html`<option key=${s} value=${s}>${s}</option>`)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Position</label>
                                        <select className="form-select" value=${form.position} onChange=${update('position')}>
                                            <option value="coordinator">Coordinator</option>
                                            <option value="instructor">Instructor</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block mt-4">Create Account</button>
                            </form>
                            <div className="divider" />
                            <p className="text-center text-sm">
                                Already have an account? <button className="link-btn" onClick=${() => setPage('login')}>Sign in</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    // Workshop types list with search
    const WorkshopTypesPage = ({ setPage }) => {
        const [search, setSearch] = useState('');

        const filtered = useMemo(() =>
            WORKSHOP_TYPES.filter(wt =>
                wt.name.toLowerCase().includes(search.toLowerCase()) ||
                wt.description.toLowerCase().includes(search.toLowerCase())
            ), [search]);

        return html`
            <div className="page-container">
                <div className="page-header">
                    <h1>Workshop Types</h1>
                    <p className="text-muted">Browse our catalogue of available workshops</p>
                </div>

                <div className="search-bar">
                    <div className="search-input-wrap">
                        <span className="search-icon"><${Icons.Search} size=${18} /></span>
                        <input className="search-input" placeholder="Search workshops..." value=${search}
                            onInput=${(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="grid-workshops">
                    ${filtered.map(wt => html`
                        <div key=${wt.id} className="card workshop-card" onClick=${() => setPage('workshopDetail_' + wt.id)}>
                            <div className="card-body">
                                <div className="workshop-card-header">
                                    <h3>${wt.name}</h3>
                                    <span className="badge badge-open">${wt.duration} day${wt.duration > 1 ? 's' : ''}</span>
                                </div>
                                <p className="workshop-card-desc">${wt.description}</p>
                                <div className="workshop-card-footer">
                                    <span className="workshop-card-meta">
                                        <${Icons.Book} size=${14} /> FOSSEE, IIT Bombay
                                    </span>
                                    <span style=${{ color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        View Details <${Icons.ArrowRight} size=${14} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    `)}
                </div>

                ${filtered.length === 0 && html`
                    <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <h3>No workshops found</h3>
                        <p>Try adjusting your search term</p>
                    </div>
                `}
            </div>
        `;
    };

    // Workshop type detail (replaces workshop_type_details.html)
    const WorkshopDetailPage = ({ workshopTypeId, setPage, user }) => {
        const wt = WORKSHOP_TYPES.find(w => w.id === workshopTypeId);
        if (!wt) return html`<div className="page-container"><p>Workshop not found.</p></div>`;

        return html`
            <div className="page-container">
                <button className="btn btn-ghost mb-4" onClick=${() => setPage('workshopTypes')} style=${{ display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
                    <${Icons.ChevronLeft} size=${18} /> Back to Workshop Types
                </button>

                <div style=${{ maxWidth: 720 }}>
                    <h1 style=${{ marginBottom: 'var(--space-2)' }}>${wt.name}</h1>
                    <div style=${{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
                        <span className="badge badge-open"><${Icons.Clock} size=${12} /> ${wt.duration} day${wt.duration > 1 ? 's' : ''}</span>
                    </div>

                    <div className="card mb-6">
                        <div className="card-body">
                            <h3 style=${{ marginBottom: 'var(--space-3)' }}>Description</h3>
                            <p style=${{ lineHeight: 1.8 }}>${wt.description}</p>
                        </div>
                    </div>

                    <div className="card mb-6">
                        <div className="card-body">
                            <h3 style=${{ marginBottom: 'var(--space-3)' }}>Terms & Conditions</h3>
                            <p style=${{ lineHeight: 1.8 }}>${wt.terms}</p>
                        </div>
                    </div>

                    ${user && user.position === 'coordinator' && html`
                        <button className="btn btn-accent btn-block" onClick=${() => setPage('propose')}>
                            <${Icons.Calendar} size=${18} /> Propose This Workshop
                        </button>
                    `}
                    ${!user && html`
                        <div className="alert alert-info">
                            <${Icons.Info} size=${18} />
                            <span>Please <button className="link-btn" onClick=${() => setPage('login')}>sign in</button> as a coordinator to propose this workshop.</span>
                        </div>
                    `}
                </div>
            </div>
        `;
    };

    // Propose workshop form (coordinator only)
    const ProposeWorkshopPage = ({ setPage }) => {
        const [workshopType, setWorkshopType] = useState('');
        const [date, setDate] = useState('');
        const [tncAccepted, setTncAccepted] = useState(false);
        const [submitted, setSubmitted] = useState(false);
        const [error, setError] = useState('');
        const [showTnc, setShowTnc] = useState(false);

        const selectedType = WORKSHOP_TYPES.find(w => w.id === Number(workshopType));
        const today = new Date();
        today.setDate(today.getDate() + 3);
        const minDate = today.toISOString().split('T')[0];

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!workshopType || !date || !tncAccepted) {
                setError('Please select a workshop type, date, and accept the terms.');
                return;
            }
            setSubmitted(true);
        };

        if (submitted) return html`
            <div className="page-container" style=${{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                    <div style=${{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>✅</div>
                    <h2>Workshop Proposed!</h2>
                    <p className="text-muted mt-4">Your proposal has been sent to all available instructors. You'll be notified once an instructor accepts.</p>
                    <button className="btn btn-primary mt-6" onClick=${() => setPage('status')}>View My Workshops</button>
                </div>
            </div>
        `;

        return html`
            <div className="page-container">
                <div className="form-card" style=${{ maxWidth: 520 }}>
                    <div className="page-header text-center">
                        <h1>Propose Workshop</h1>
                        <p className="text-muted">Submit a workshop proposal for your college</p>
                    </div>

                    <div className="alert alert-info mb-6">
                        <${Icons.Info} size=${18} />
                        <span>Before proposing, check the <button className="link-btn" onClick=${() => setPage('workshopTypes')}>Workshop Types</button> section for details.</span>
                    </div>

                    ${error && html`<div className="alert alert-danger">${error}</div>`}

                    <div className="card">
                        <div className="card-body">
                            <form onSubmit=${handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="ws-type">Workshop Type *</label>
                                    <select id="ws-type" className="form-select" value=${workshopType}
                                        onChange=${(e) => setWorkshopType(e.target.value)} required>
                                        <option value="">-- Select a workshop --</option>
                                        ${WORKSHOP_TYPES.map(wt => html`<option key=${wt.id} value=${wt.id}>${wt.name} (${wt.duration} day${wt.duration > 1 ? 's' : ''})</option>`)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="ws-date">Preferred Date *</label>
                                    <input id="ws-date" className="form-input" type="date" min=${minDate}
                                        value=${date} onChange=${(e) => setDate(e.target.value)} required />
                                </div>
                                <div className="checkbox-wrap" style=${{ marginBottom: 'var(--space-5)' }}>
                                    <input type="checkbox" id="tnc" checked=${tncAccepted}
                                        onChange=${(e) => setTncAccepted(e.target.checked)} />
                                    <label htmlFor="tnc" style=${{ fontSize: '0.875rem' }}>
                                        I accept the ${' '}
                                        <button type="button" className="link-btn" onClick=${() => setShowTnc(true)}>terms and conditions</button>
                                    </label>
                                </div>
                                <button type="submit" className="btn btn-accent btn-block">
                                    <${Icons.Send} size=${18} /> Submit Proposal
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- TnC Modal -->
                ${showTnc && html`
                    <div style=${{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:'var(--space-4)' }}
                        onClick=${() => setShowTnc(false)}>
                        <div className="card" style=${{ maxWidth:520, width:'100%', maxHeight:'80vh', overflow:'auto' }} onClick=${(e) => e.stopPropagation()}>
                            <div className="card-body">
                                <div className="flex-between mb-4">
                                    <h3>Terms and Conditions</h3>
                                    <button className="btn btn-ghost" onClick=${() => setShowTnc(false)}><${Icons.X} size=${20} /></button>
                                </div>
                                <p style=${{ lineHeight: 1.8 }}>${selectedType ? selectedType.terms : 'Please select a workshop type first.'}</p>
                            </div>
                        </div>
                    </div>
                `}
            </div>
        `;
    };

    // Coordinator's "My Workshops" status page
    const CoordinatorStatusPage = ({ user, setPage }) => {
        const myWorkshops = MOCK_WORKSHOPS;
        const accepted = myWorkshops.filter(w => w.status === 1);
        const pending = myWorkshops.filter(w => w.status === 0);

        if (myWorkshops.length === 0) return html`
            <div className="page-container">
                <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <h3>Welcome, ${user.name}!</h3>
                    <p>You haven't proposed any workshops yet. Get started by proposing one.</p>
                    <button className="btn btn-accent mt-4" onClick=${() => setPage('propose')}>Propose Workshop</button>
                </div>
            </div>
        `;

        return html`
            <div className="page-container">
                <div className="page-header">
                    <h1>My Workshops</h1>
                    <p className="text-muted">Track the status of your proposed workshops</p>
                </div>

                <div className="dashboard-stats">
                    <div className="dashboard-stat-card">
                        <div className="stat-value" style=${{ color: 'var(--primary-700)' }}>${myWorkshops.length}</div>
                        <div className="stat-label">Total</div>
                    </div>
                    <div className="dashboard-stat-card">
                        <div className="stat-value" style=${{ color: 'var(--success-500)' }}>${accepted.length}</div>
                        <div className="stat-label">Accepted</div>
                    </div>
                    <div className="dashboard-stat-card">
                        <div className="stat-value" style=${{ color: 'var(--warning-500)' }}>${pending.length}</div>
                        <div className="stat-label">Pending</div>
                    </div>
                </div>

                ${accepted.length > 0 && html`
                    <h3 className="mb-4" style=${{ color: 'var(--success-500)' }}>Accepted Workshops</h3>
                    <div className="table-container mb-6">
                        <table>
                            <thead><tr>
                                <th>Workshop</th><th>Instructor</th><th>Date</th><th>Status</th>
                            </tr></thead>
                            <tbody>
                                ${accepted.map(w => html`
                                    <tr key=${w.id}>
                                        <td><strong>${w.type.name}</strong></td>
                                        <td>${w.instructor ? w.instructor.name : '—'}</td>
                                        <td>${w.date}</td>
                                        <td><span className="badge badge-accepted">Accepted</span></td>
                                    </tr>
                                `)}
                            </tbody>
                        </table>
                    </div>
                `}

                ${pending.length > 0 && html`
                    <h3 className="mb-4" style=${{ color: 'var(--warning-500)' }}>Pending Proposals</h3>
                    <div className="table-container">
                        <table>
                            <thead><tr>
                                <th>Workshop</th><th>Date</th><th>Status</th>
                            </tr></thead>
                            <tbody>
                                ${pending.map(w => html`
                                    <tr key=${w.id}>
                                        <td><strong>${w.type.name}</strong></td>
                                        <td>${w.date}</td>
                                        <td><span className="badge badge-pending">Pending</span></td>
                                    </tr>
                                `)}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        `;
    };

    // Instructor dashboard — shows pending requests + accepted workshops
    const InstructorDashboardPage = ({ user }) => {
        const [message, setMessage] = useState('');
        const pending = MOCK_WORKSHOPS.filter(w => w.status === 0);
        const accepted = MOCK_WORKSHOPS.filter(w => w.status === 1);

        const handleAccept = (id) => {
            setMessage(`Workshop #${id} accepted! (Demo mode)`);
            setTimeout(() => setMessage(''), 3000);
        };

        return html`
            <div className="page-container">
                <div className="page-header">
                    <h1>Instructor Dashboard</h1>
                    <p className="text-muted">Manage workshop requests and accepted workshops</p>
                </div>

                ${message && html`<div className="alert alert-success"><${Icons.Check} size=${18} /> ${message}</div>`}

                <div className="dashboard-stats">
                    <div className="dashboard-stat-card">
                        <div className="stat-value" style=${{ color: 'var(--primary-700)' }}>${MOCK_WORKSHOPS.length}</div>
                        <div className="stat-label">Total</div>
                    </div>
                    <div className="dashboard-stat-card">
                        <div className="stat-value" style=${{ color: 'var(--warning-500)' }}>${pending.length}</div>
                        <div className="stat-label">Pending Requests</div>
                    </div>
                    <div className="dashboard-stat-card">
                        <div className="stat-value" style=${{ color: 'var(--success-500)' }}>${accepted.length}</div>
                        <div className="stat-label">Accepted</div>
                    </div>
                </div>

                <!-- Pending workshops to accept -->
                ${pending.length > 0 && html`
                    <h3 className="mb-4">Pending Requests</h3>
                    <div className="table-container mb-6">
                        <table>
                            <thead><tr>
                                <th>Workshop</th><th>Coordinator</th><th>Institute</th><th>Date</th><th>Action</th>
                            </tr></thead>
                            <tbody>
                                ${pending.map(w => html`
                                    <tr key=${w.id}>
                                        <td><strong>${w.type.name}</strong></td>
                                        <td>${w.coordinator.name}</td>
                                        <td>${w.coordinator.institute}</td>
                                        <td>${w.date}</td>
                                        <td><button className="btn btn-success btn-sm" onClick=${() => handleAccept(w.id)}>Accept</button></td>
                                    </tr>
                                `)}
                            </tbody>
                        </table>
                    </div>
                `}

                <!-- Accepted workshops -->
                ${accepted.length > 0 && html`
                    <h3 className="mb-4">My Accepted Workshops</h3>
                    <div className="table-container">
                        <table>
                            <thead><tr>
                                <th>Workshop</th><th>Coordinator</th><th>Date</th><th>Status</th>
                            </tr></thead>
                            <tbody>
                                ${accepted.map(w => html`
                                    <tr key=${w.id}>
                                        <td><strong>${w.type.name}</strong></td>
                                        <td>${w.coordinator.name}</td>
                                        <td>${w.date}</td>
                                        <td><span className="badge badge-accepted">Accepted</span></td>
                                    </tr>
                                `)}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        `;
    };

    // Profile page
    const ProfilePage = ({ user }) => html`
        <div className="page-container">
            <div style=${{ maxWidth: 640 }}>
                <div className="profile-header">
                    <div className="profile-avatar">${user.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <h2 style=${{ marginBottom: 2 }}>${user.name}</h2>
                        <p className="text-muted text-sm" style=${{ textTransform: 'capitalize' }}>${user.position}</p>
                    </div>
                </div>

                <div className="card mb-6">
                    <div className="card-body">
                        <h3 style=${{ marginBottom: 'var(--space-4)' }}>Personal Information</h3>
                        <div style=${{ display:'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            ${[
                                ['First Name', user.name],
                                ['Last Name', '—'],
                                ['Email', 'user@example.com'],
                                ['Phone', '9876543210'],
                                ['Institute', 'IIT Bombay'],
                                ['Department', 'Computer Science'],
                                ['Position', user.position],
                                ['State', 'Maharashtra'],
                            ].map(([label, value]) => html`
                                <div key=${label}>
                                    <div className="text-xs text-muted" style=${{ marginBottom: 2, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>${label}</div>
                                    <div style=${{ fontWeight: 500, textTransform: label === 'Position' ? 'capitalize' : 'none' }}>${value}</div>
                                </div>
                            `)}
                        </div>
                    </div>
                </div>

                <button className="btn btn-outline">
                    <${Icons.Edit} size=${16} /> Edit Profile
                </button>
            </div>
        </div>
    `;

    // Statistics page (summary view — full charts live in Django's statistics_app)
    const StatisticsPage = () => html`
        <div className="page-container">
            <div className="page-header">
                <h1>Workshop Statistics</h1>
                <p className="text-muted">Overview of workshops conducted across India</p>
            </div>
            <div className="dashboard-stats">
                <div className="dashboard-stat-card">
                    <div className="stat-value" style=${{ color: 'var(--primary-700)' }}>1,247</div>
                    <div className="stat-label">Total Workshops</div>
                </div>
                <div className="dashboard-stat-card">
                    <div className="stat-value" style=${{ color: 'var(--success-500)' }}>45,000+</div>
                    <div className="stat-label">Students Trained</div>
                </div>
                <div className="dashboard-stat-card">
                    <div className="stat-value" style=${{ color: 'var(--accent-500)' }}>400+</div>
                    <div className="stat-label">Institutions</div>
                </div>
                <div className="dashboard-stat-card">
                    <div className="stat-value" style=${{ color: 'var(--primary-700)' }}>29</div>
                    <div className="stat-label">States</div>
                </div>
            </div>
            <div className="alert alert-info mt-6">
                <${Icons.BarChart} size=${18} />
                <span>Detailed charts and state-wise breakdowns are available via the Django backend statistics endpoint.</span>
            </div>
        </div>
    `;

    // Footer
    const Footer = () => html`
        <footer className="footer">
            <p>Developed by <a href="https://fossee.in" target="_blank" rel="noopener noreferrer">FOSSEE</a> group, IIT Bombay
            </p>
        </footer>
    `;

    // App root — handles routing and auth state
    const App = () => {
        const [page, setPage] = useState('home');
        const [user, setUser] = useState(null);

        const handleLogin = (userData) => {
            setUser(userData);
            if (userData.position === 'instructor') {
                setPage('dashboard');
            } else {
                setPage('status');
            }
        };

        const handleLogout = () => {
            setUser(null);
            setPage('home');
        };

        // Scroll to top on page change
        useEffect(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, [page]);

        // Route: workshopDetail_<id>
        const workshopDetailMatch = page.match(/^workshopDetail_(\d+)$/);

        let content;
        if (workshopDetailMatch) {
            content = html`<${WorkshopDetailPage} workshopTypeId=${Number(workshopDetailMatch[1])} setPage=${setPage} user=${user} />`;
        } else {
            switch (page) {
                case 'home':
                    content = html`<${HomePage} setPage=${setPage} user=${user} />`;
                    break;
                case 'login':
                    content = html`<${LoginPage} onLogin=${handleLogin} setPage=${setPage} />`;
                    break;
                case 'register':
                    content = html`<${RegisterPage} setPage=${setPage} onLogin=${handleLogin} />`;
                    break;
                case 'workshopTypes':
                    content = html`<${WorkshopTypesPage} setPage=${setPage} />`;
                    break;
                case 'propose':
                    content = user
                        ? html`<${ProposeWorkshopPage} setPage=${setPage} />`
                        : html`<${LoginPage} onLogin=${handleLogin} setPage=${setPage} />`;
                    break;
                case 'status':
                    content = user
                        ? html`<${CoordinatorStatusPage} user=${user} setPage=${setPage} />`
                        : html`<${LoginPage} onLogin=${handleLogin} setPage=${setPage} />`;
                    break;
                case 'dashboard':
                    content = user
                        ? html`<${InstructorDashboardPage} user=${user} />`
                        : html`<${LoginPage} onLogin=${handleLogin} setPage=${setPage} />`;
                    break;
                case 'profile':
                    content = user
                        ? html`<${ProfilePage} user=${user} />`
                        : html`<${LoginPage} onLogin=${handleLogin} setPage=${setPage} />`;
                    break;
                case 'statistics':
                    content = html`<${StatisticsPage} />`;
                    break;
                default:
                    content = html`<${HomePage} setPage=${setPage} user=${user} />`;
            }
        }

        return html`
            <div style=${{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <${Navbar} page=${page} setPage=${setPage} user=${user} onLogout=${handleLogout} />
                <div style=${{ flex: 1 }}>${content}</div>
                <${Footer} />
            </div>
        `;
    };

    // Mount
    const root = document.getElementById('root');
    if (root) {
        createRoot(root).render(html`<${App} />`);
    }
})();