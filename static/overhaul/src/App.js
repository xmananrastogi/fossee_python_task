import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Calendar, 
  Users, 
  Award, 
  CircleUser, 
  LayoutDashboard, 
  PlusCircle, 
  Menu, 
  X,
  ChevronRight,
  Monitor
} from 'lucide-react';

/* --- Design Components --- */

const Navbar = ({ activePage, setPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="glass" style={{
      position: 'fixed', top: 0, width: '100%', zIndex: 1000,
      padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ 
          background: 'var(--accent-primary)', padding: '0.5rem', borderRadius: '12px',
          boxShadow: '0 0 20px var(--accent-glow)'
        }}>
          <Terminal size={24} color="#fff" />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>FOSSEE<span style={{ color: 'var(--accent-primary)' }}>.</span></span>
      </div>

      {/* Desktop Menu */}
      <div id="desktop-menu" style={{ display: 'flex', gap: '2rem' }}>
        {['Home', 'Workshops', 'Dashboard'].map(item => (
          <button 
            key={item}
            onClick={() => setPage(item.toLowerCase())}
            style={{
              background: 'none', border: 'none', color: activePage === item.toLowerCase() ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 500, cursor: 'pointer', transition: 'all 0.3s ease',
              position: 'relative'
            }}
          >
            {item}
            {activePage === item.toLowerCase() && (
              <motion.div layoutId="nav-underline" style={{
                position: 'absolute', bottom: '-4px', left: 0, right: 0, 
                height: '2px', background: 'var(--accent-primary)'
              }} />
            )}
          </button>
        ))}
      </div>

      {/* Mobile Toggle */}
      <button 
        style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
        id="mobile-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <style>{`
        @media (max-width: 768px) {
          #desktop-menu { display: none; }
          #mobile-toggle { display: block; }
        }
      `}</style>
    </nav>
  );
};

const Hero = () => (
  <section style={{ 
    padding: '12rem 2rem 6rem', maxWidth: 'var(--container-max)', margin: '0 auto',
    textAlign: 'center'
  }}>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <span style={{ 
        background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)',
        padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.875rem', fontWeight: 600,
        border: '1px solid rgba(99, 102, 241, 0.2)', marginBottom: '1.5rem', display: 'inline-block'
      }}>
        Next Generation Workshop Booking
      </span>
      <h1 className="hero-gradient-text" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
        Empowering Open Source <br /> Education at Scale.
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
        Book, manage, and scale FOSSEE workshops effortlessly. A platform built for coordinators and instructors to bridge the gap in tech education.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="glass" style={{
          padding: '1rem 2rem', borderRadius: '14px', background: 'var(--accent-primary)',
          color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'transform 0.2s'
        }}>
          Propose Workshop <ChevronRight size={18} />
        </button>
        <button className="glass" style={{
          padding: '1rem 2rem', borderRadius: '14px', color: '#fff', fontWeight: 600, 
          cursor: 'pointer', transition: 'background 0.3s'
        }}>
          Browse Catalog
        </button>
      </div>
    </motion.div>
  </section>
);

const Stats = () => {
  const data = [
    { label: 'Workshops', value: '1,200+', icon: <Calendar size={20} /> },
    { label: 'Students', value: '45,000+', icon: <Users size={20} /> },
    { label: 'Experts', value: '150+', icon: <Award size={20} /> },
    { label: 'Colleges', value: '400+', icon: <Monitor size={20} /> }
  ];

  return (
    <div style={{ 
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem', maxWidth: 'var(--container-max)', margin: '0 auto 6rem', padding: '0 2rem'
    }}>
      {data.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="glass"
          style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}
        >
          <div style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
            {stat.icon}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>{stat.value}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

/* --- Main App Container --- */

const App = () => {
  const [page, setPage] = useState('home');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Remove the initial loader
    const loader = document.getElementById('initial-loader');
    if (loader) loader.style.display = 'none';
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <Navbar activePage={page} setPage={setPage} />
      
      <AnimatePresence mode="wait">
        {page === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero />
            <Stats />
            {/* Catalog Preview */}
            <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 2rem' }}>
               <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Featured <span style={{ color: 'var(--accent-primary)' }}>Workshops</span></h2>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                      <div style={{ 
                        width: '100%', aspectRatio: '16/9', background: 'rgba(255,255,255,0.03)', 
                        borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--border-color)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                         <Monitor size={48} color="rgba(255,255,255,0.1)" />
                      </div>
                      <h3 style={{ marginBottom: '0.75rem' }}>Scilab Advanced Control Systems</h3>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                        Deep dive into control systems modeling and simulation using Scilab. Perfect for aerospace and electrical engineering students.
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', fontWeight: 600 }}>2 Days Duration</span>
                         <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            View Details <ChevronRight size={16} />
                         </button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}

        {page === 'dashboard' && (
           <motion.div 
             key="dashboard"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             style={{ paddingTop: '8rem', maxWidth: 'var(--container-max)', margin: '0 auto', padding: '8rem 2rem' }}
           >
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Your <span style={{ color: 'var(--accent-primary)' }}>Dashboard</span></h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>Track your workshop status and coordinate with instructors.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      { title: 'Python for Data Science', date: 'Oct 24, 2026', status: 'Pending Approval' },
                      { title: 'OpenFOAM Fluid Dynamics', date: 'Nov 12, 2026', status: 'Scheduled' }
                    ].map((ws, i) => (
                      <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div>
                            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{ws.title}</h4>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                               <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> {ws.date}</span>
                            </div>
                         </div>
                         <span style={{ 
                           padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600,
                           background: ws.status === 'Scheduled' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                           color: ws.status === 'Scheduled' ? '#4ade80' : '#fbbf24',
                           border: '1px solid currentColor'
                         }}>
                            {ws.status}
                         </span>
                      </div>
                    ))}
                 </div>
                 
                 <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', height: 'fit-content' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Profile Overview</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                       <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CircleUser size={28} color="var(--accent-primary)" />
                       </div>
                       <div>
                          <div style={{ fontWeight: 600 }}>Prof. Rajesh Kumar</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>IIT Bombay Coordinator</div>
                       </div>
                    </div>
                    <button style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: 'var(--border-color)', border: 'none', color: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}>
                       Edit Profile
                    </button>
                 </div>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Root Mounting
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
