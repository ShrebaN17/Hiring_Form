import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ──────────────────────────────────────────
// 1. CONFIG & SETUP
// ──────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail-safe client creation
const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

// ──────────────────────────────────────────
// 2. DATA CONSTANTS
// ──────────────────────────────────────────
const ROLES = [
  { id: "ai-ml", label: "AI / ML Developer", icon: "◐", desc: "Build the brains" },
  { id: "dev", label: "Frontend / Backend Dev", icon: "◈", desc: "Build the product" },
  { id: "tester", label: "Product Tester", icon: "◎", desc: "Break things (on purpose)" },
];

const YEAR_OPTIONS = ["In School", "1st Year", "2nd Year", "3rd Year", "4th Year", "Graduated"];
const COUNTRY_CODES = ["+91", "+1", "+44", "+61", "+81", "+49", "+33", "+86"];

// TEAM DATA - Now with 'img' field
// Put your images in the 'public' folder and reference them here (e.g. "/ceo.jpg")
const TEAM_MEMBERS = [
  { 
    name: "Priyangshu Dey", 
    role: "Co-Founder / CEO", 
    bio: "Focused on building reliable, trust-first products that solve real operational problems. Leads product direction, vision, and long-term strategy, with hands-on involvement in shaping how users experience the platform from first interaction to deployment.", 
    img: "public/team/Priyangshu.jpg" // <--- REPLACE THIS WITH YOUR IMAGE PATH
  },
  { 
    name: "Arman Das", 
    role: "Co-Founder / CTO", 
    bio: "Leads the technical architecture and infrastructure behind the product. Responsible for building scalable, secure, and dependable systems, with a strong focus on deployment reliability, system integrity, and long-term technical sustainability.", 
    img: "public/team/Arman.jpg" // Leave empty to show initials
  },
  { 
    name: "Shreyas Bhanja", 
    role: "Co-Founder / COO", 
    bio: "Oversees execution, operations, and business systems. Focused on turning product ideas into repeatable processes, ensuring smooth collaboration across teams, and building the operational foundation needed to scale responsibly and sustainably.", 
    img: "public/team/Shreyas.jpg" // Leave empty to show initials
  },
  { 
    name: "Hardik Chaturvedi", 
    role: "AI/Ml Developer", 
    bio: "Responsible for building and maintaining the AI systems that drive core product functionality. Works closely with engineering and product teams to ensure AI outputs are reliable, controllable, and aligned with real user needs in production environments.", 
    img: "public/team/" // Leave empty to show initials
  },
  { 
    name: "Arkajyoti Roy", 
    role: "Frontend Developer", 
    bio: "Responsible for crafting intuitive, clean, and functional user interfaces. Focused on translating complex systems into simple, usable experiences that feel calm, reliable, and easy to navigate for non-technical users.", 
    img: "public/team/" // Leave empty to show initials
  },
  { 
    name: "Awani Rashmi", 
    role: "Frontend Developer", 
    bio: "Responsible for crafting intuitive, clean, and functional user interfaces. Focused on translating complex systems into simple, usable experiences that feel calm, reliable, and easy to navigate for non-technical users.", 
    img: "public/team/" // Leave empty to show initials
  },
  { 
    name: "Ghanan Dhamija", 
    role: "Product Designer", 
    bio: "Works on visual identity, layout systems, and design consistency across the platform. Ensures the product communicates clarity, trust, and professionalism through thoughtful design choices.", 
    img: "public/team/" // Leave empty to show initials
  },
  { 
    name: "Srinjoy Debnath", 
    role: "Product Designer", 
    bio: "Works on visual identity, layout systems, and design consistency across the platform. Ensures the product communicates clarity, trust, and professionalism through thoughtful design choices.", 
    img: "public/team/" // Leave empty to show initials
  },
  { 
    name: "Om Suryawanshi", 
    role: "Advisor - System & Security", 
    bio: "Provides strategic guidance on system design, security, and long-term technical resilience. Supports the team in building secure and dependable infrastructure as the product matures.", 
    img: "public/team/" // Leave empty to show initials
  },
];

const ROLE_QUESTIONS = {
  "ai-ml": [
    { id: "ml_experience", label: "What's your experience level with ML / AI?", type: "select", options: ["Just getting started", "Worked on a few projects", "Built & deployed models", "Research-level experience"] },
    { id: "ml_stack", label: "Which tools / frameworks have you used?", type: "multi", options: ["Python", "TensorFlow", "PyTorch", "Hugging Face", "LangChain", "OpenAI API", "scikit-learn", "Other"] },
    { id: "ml_project", label: "Briefly describe an AI/ML project you've worked on.", type: "textarea", placeholder: "e.g. I built a RAG chatbot using LangChain..." },
  ],
  dev: [
    { id: "dev_stack", label: "What is your primary tech stack?", type: "multi", options: ["React / Next.js", "Vue / Nuxt", "Node.js / Express", "Python / Django", "Supabase / Firebase", "PostgreSQL / SQL", "Tailwind CSS", "TypeScript"] },
    { id: "dev_github", label: "Share your GitHub or Portfolio link.", type: "textarea", placeholder: "e.g. github.com/johnthomas" },
    { id: "dev_challenge", label: "What is the hardest bug you fixed or feature you built?", type: "textarea", placeholder: "e.g. I optimized a slow API query by indexing..." },
  ],
  tester: [
    { id: "test_type", label: "What kind of testing do you enjoy most?", type: "select", options: ["UI / UX (Design flaws)", "Functional (Logic bugs)", "Performance (Speed / Load)", "Security (Vulnerabilities)", "I just like breaking things"] },
    { id: "test_devices", label: "What devices can you test on? (Pick all that apply)", type: "multi", options: ["Windows Laptop/PC", "MacBook / Mac", "iPhone (iOS)", "Android Phone", "iPad / Tablet"] },
    { id: "test_bug", label: "Describe a critical bug you found in an app you use.", type: "textarea", placeholder: "e.g. I found that clicking 'Back' twice on Instagram crashed the app..." },
  ],
};

const COMMON_QUESTIONS = [
  { id: "why_interested", label: "Why does this product interest you?", type: "textarea", placeholder: "e.g. I love AI tools and want to help..." },
  { id: "availability", label: "How much time can you commit (per week)?", type: "select", options: ["1–2 hours", "3–5 hours", "5–10 hours", "10+ hours"] },
  { id: "hear_about", label: "How did you hear about us?", type: "select", options: ["Friend / Word of mouth", "Social media", "Campus notice", "Email", "Other"] },
  { id: "extra", label: "Anything else? (optional)", type: "textarea", placeholder: "e.g. I also do graphic design...", optional: true },
];

// ──────────────────────────────────────────
// 3. SHARED COMPONENTS
// ──────────────────────────────────────────
const inputStyle = (hasError) => ({
  width: "100%",
  boxSizing: "border-box",
  background: "var(--input-bg)",
  border: hasError ? "1px solid #ff5a3c" : "1px solid var(--border)",
  borderRadius: 10,
  padding: "14px 16px",
  color: "var(--text)",
  fontSize: 14,
  fontFamily: "'Inter', sans-serif",
  outline: "none",
  transition: "border 0.2s, background 0.2s",
  appearance: "none",
});

function Label({ children, optional }) {
  return (
    <label style={{ display: "block", fontSize: 12, color: "var(--text-sub)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8, textAlign: "left" }}>
      {children}{" "}
      {optional && <span style={{ color: "var(--text-muted)", textTransform: "none", letterSpacing: 0, fontSize: 11 }}>(optional)</span>}
    </label>
  );
}

function ErrorMsg({ msg }) {
  return msg ? <p style={{ color: "#ff5a3c", fontSize: 11, marginTop: 6, marginBottom: 0, textAlign: "left" }}>{msg}</p> : null;
}

function SelectField({ value, onChange, options, hasError }) {
  return (
    <div style={{ position: "relative" }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle(hasError), cursor: "pointer", paddingRight: 40 }}>
        <option value="" disabled style={{ color: "var(--text-muted)" }}>Choose an option</option>
        {options.map((o) => (<option key={o} value={o} style={{ background: "var(--bg)", color: "var(--text)" }}>{o}</option>))}
      </select>
      <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none", fontSize: 12 }}>▼</span>
    </div>
  );
}

function MultiSelect({ value, onChange, options }) {
  const toggle = (o) => onChange(value.includes(o) ? value.filter((v) => v !== o) : [...value, o]);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((o) => {
        const sel = value.includes(o);
        return (
          <button key={o} onClick={() => toggle(o)} style={{
              background: sel ? "rgba(255,90,60,0.15)" : "var(--input-bg)",
              border: sel ? "1px solid rgba(255,90,60,0.5)" : "1px solid var(--border)",
              borderRadius: 20, padding: "8px 16px",
              color: sel ? "#ff5a3c" : "var(--text-sub)",
              fontWeight: sel ? 600 : 400,
              fontSize: 13, fontFamily: "'Inter', sans-serif", cursor: "pointer", transition: "all 0.2s ease",
            }}>
            {sel && <span style={{ marginRight: 6 }}>✓</span>}
            {o}
          </button>
        );
      })}
    </div>
  );
}

function TextareaField({ value, onChange, placeholder, hasError }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={4} style={{ ...inputStyle(hasError), resize: "vertical", lineHeight: 1.6, minHeight: 100 }} />;
}

function QuestionBlock({ q, value, onChange, error }) {
  return (
    <div style={{ marginBottom: 24, textAlign: "left" }}>
      <Label optional={q.optional}>{q.label}</Label>
      {q.type === "select" && <SelectField value={value || ""} onChange={onChange} options={q.options} hasError={!!error} />}
      {q.type === "multi" && <MultiSelect value={value || []} onChange={onChange} options={q.options} />}
      {q.type === "textarea" && <TextareaField value={value || ""} onChange={onChange} placeholder={q.placeholder} hasError={!!error} />}
      <ErrorMsg msg={error} />
    </div>
  );
}

function CursorBlob() {
  const blobRef = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (blobRef.current) {
        blobRef.current.style.left = e.clientX + "px";
        blobRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div ref={blobRef} style={{ position: "fixed", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,90,60,0.15) 0%, transparent 70%)", pointerEvents: "none", transform: "translate(-50%,-50%)", zIndex: 0, filter: "blur(20px)", transition: "opacity 0.5s" }} />;
}

const InstagramIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>);
const LinkedinIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>);
const TwitterIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>);
const MenuIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>);
const CloseIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const SunIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>);
const MoonIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>);

// ──────────────────────────────────────────
// 4. ADMIN PANEL (FIXED)
// ──────────────────────────────────────────
function AdminPanel() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  
  // Login State
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");

  useEffect(() => {
    if (!supabase) { 
      setLoading(false); 
      return; 
    }
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchApplicants();
      } else {
        setLoading(false);
      }
    });
  }, []);

  const fetchApplicants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error("Error fetching data:", error);
    setApplicants(data || []);
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!supabase) return alert("Supabase keys are missing in .env!");
    
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({ 
      email: authEmail, 
      password: authPass 
    });
    
    if (error) { 
      alert(error.message); 
      setLoading(false); 
    } else { 
      window.location.reload(); 
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setApplicants([]);
  };

  if (!supabase) return <div style={{padding: 50, textAlign:'center'}}>⚠️ Critical Error: Missing Supabase Keys. Check .env file.</div>;

  if (!session) {
    return (
      <div className="page-content-wrapper">
        <div className="glass-box" style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <h2 className="section-title">Admin Access</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <input 
              className="login-input" 
              type="email" 
              placeholder="Admin Email" 
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              required 
              style={inputStyle(false)} 
            />
            <input 
              className="login-input" 
              type="password" 
              placeholder="Password" 
              value={authPass}
              onChange={(e) => setAuthPass(e.target.value)}
              required 
              style={inputStyle(false)} 
            />
            <button type="submit" className="primary-btn" disabled={loading} style={{ justifyContent: 'center' }}>
              {loading ? "Authenticating..." : "Login →"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content-wrapper" style={{ justifyContent: 'flex-start', paddingTop: 120 }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
          <h2 className="hero-title" style={{ fontSize: 32, margin: 0 }}>Dashboard</h2>
          <button onClick={handleLogout} className="text-btn">Logout</button>
        </div>

        {loading ? <p style={{textAlign: 'center', opacity: 0.5}}>Loading data...</p> : (
          <div style={{ display: 'grid', gap: 15, gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
            {applicants.length === 0 && <p style={{opacity:0.5}}>No applications yet.</p>}
            {applicants.map(app => (
              <div key={app.id} className="glass-box" style={{ marginTop: 0, padding: 24, cursor: 'pointer', display: 'flex', flexDirection: 'column' }} onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <div>
                    <strong style={{ fontSize: 18, display: 'block' }}>{app.name}</strong>
                    <span style={{ fontSize: 12, color: '#ff5a3c', textTransform: 'uppercase', letterSpacing: 1 }}>{app.role}</span>
                  </div>
                  <span style={{ fontSize: 12, opacity: 0.4 }}>{new Date(app.created_at).toLocaleDateString()}</span>
                </div>
                
                <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>{app.email}</div>

                {expandedId === app.id && (
                  <div style={{ marginTop: 15, paddingTop: 15, borderTop: '1px solid var(--border)', fontSize: 14, lineHeight: 1.6, animation: 'fadeIn 0.3s ease' }}>
                    <p><strong>Phone:</strong> {app.phone}</p>
                    <p><strong>College:</strong> {app.college} ({app.year})</p>
                    <div style={{ marginTop: 15 }}>
                      <strong style={{ display:'block', marginBottom: 5, fontSize: 12, opacity: 0.5, textTransform: 'uppercase' }}>Role Specifics</strong>
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8, fontSize: 13 }}>
                        {app.role_answers && Object.entries(app.role_answers).map(([k, v]) => (
                          <div key={k} style={{ marginBottom: 6 }}>
                            <span style={{ opacity: 0.6 }}>{k}:</span> <br/>{Array.isArray(v) ? v.join(", ") : v}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 15 }}>
                      <strong style={{ display:'block', marginBottom: 5, fontSize: 12, opacity: 0.5, textTransform: 'uppercase' }}>Common</strong>
                      {app.common_answers && Object.entries(app.common_answers).map(([k, v]) => (
                          <div key={k} style={{ marginBottom: 6 }}>
                            <span style={{ opacity: 0.6 }}>{k}:</span> <br/>{v}
                          </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// 5. MAIN SITE COMPONENTS
// ──────────────────────────────────────────
function FixedHeader({ onNavigate, theme, toggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleNav = (p) => { onNavigate(p); setIsMenuOpen(false); };

  return (
    <div className="fixed-header">
      <div className="header-content">
        <div className="logo-text" onClick={() => handleNav("landing")}>AAKAAR.io</div>
        <div className="header-nav">
          <button className="header-link" onClick={() => handleNav("landing")}>Home</button>
          <button className="header-link" onClick={() => handleNav("about")}>About Us</button>
          <button className="header-link" onClick={() => handleNav("team")}>Our Team</button>
          <button className="header-link" onClick={() => handleNav("who")}>Who is this for?</button>
        </div>
        <div className="header-right">
          <div className="social-links desktop-only">
            <a href="https://www.instagram.com/aakaar.io/" className="social-icon"><InstagramIcon /></a>
            <a href="https://www.linkedin.com/company/aakaario/" className="social-icon"><LinkedinIcon /></a>
            <a href="https://x.com/aakaario" className="social-icon"><TwitterIcon /></a>
          </div>
          {/* THEME TOGGLE BUTTON - Now triggers Rick Roll */}
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <CloseIcon /> : <MenuIcon />}</button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="mobile-dropdown">
          <button className="mobile-link" onClick={() => handleNav("landing")}>Home</button>
          <button className="mobile-link" onClick={() => handleNav("about")}>About Us</button>
          <button className="mobile-link" onClick={() => handleNav("team")}>Our Team</button>
          <button className="mobile-link" onClick={() => handleNav("who")}>Who is this for?</button>
        </div>
      )}
    </div>
  );
}

function Newsletter({ compact }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => { setStatus("success"); setEmail(""); }, 1500);
  };
  return (
    <div style={{ textAlign: "center" }}>
      {!compact && <h3 className="section-title" style={{ fontSize: 20, marginBottom: 10 }}>Stay in the loop</h3>}
      <p style={{ color: "var(--text-sub)", fontSize: 14, marginBottom: 20 }}>{compact ? "Get updates on product progress." : "Get the latest updates on Aakaar.io's development."}</p>
      {status === "success" ? <div style={{ color: "#ff5a3c", fontWeight: 600, padding: 10 }}>Thanks for signing up!</div> : (
        <form onSubmit={handleSubscribe} style={{ display: "flex", gap: 10, maxWidth: 400, margin: "0 auto" }}>
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ ...inputStyle(false), flex: 1 }} required />
          <button type="submit" className="primary-btn" disabled={status === "loading"} style={{ padding: "14px 24px" }}>{status === "loading" ? "..." : "Subscribe"}</button>
        </form>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content-wrapper">
        <div className="footer-col">
          <div className="logo-text" style={{ color: "#ff5a3c", marginBottom: 20, fontSize: 24 }}>AAKAAR.io</div>
          <div className="contact-item"><span style={{ color: "var(--text-muted)", fontSize: 12 }}>Email</span><div style={{ marginTop: 4 }}>support@aakario.com</div></div>
          <div className="contact-item"><span style={{ color: "var(--text-muted)", fontSize: 12 }}>Phone</span><div style={{ marginTop: 4 }}>+91 8280669173</div></div>
          <div style={{ marginTop: 30, display: 'flex', gap: 15 }}>
             <a href="#" style={{ color: 'var(--text-sub)', fontSize: 13 }}>Privacy Policy</a>
             <a href="#" style={{ color: 'var(--text-sub)', fontSize: 13 }}>Terms of Service</a>
          </div>
        </div>
        <div className="footer-col map-col">
          <div className="map-frame">
            <iframe src="https://maps.google.com/maps?q=Kings%20Palace%202%2C%20Prasanti%20Vihar%20Rd%2C%20Bhubaneswar&t=&z=15&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-muted)", textAlign: "right" }}>KIIT University, Patia, Bhubaneswar, Odisha 751024</div>
        </div>
      </div>
      <div className="footer-copyright">© {new Date().getFullYear()} Aakaar.io. All rights reserved.</div>
    </footer>
  );
}

function About() {
  return (
    <div className="page-content-wrapper">
      <div className="content-box fade-in" style={{ textAlign: "left", maxWidth: 640 }}>
        <h1 className="hero-title">About Us</h1>
        <p className="hero-desc">Building the future of web development.</p>
        <div className="glass-box">
           <h3 className="section-title">What We Do</h3>
           <p style={{ color: "var(--text-sub)", lineHeight: 1.7, marginBottom: 40 }}>BuildAI is an AI-powered platform designed to democratize software creation. We are building tools that allow anyone—regardless of their technical background—to generate, deploy, and scale web applications using natural language. We believe that the barrier to entry for building great products should be imagination, not syntax.</p>
           <h3 className="section-title">Our Vision</h3>
           <p style={{ color: "var(--text-sub)", lineHeight: 1.7 }}>We envision a world where software development is accessible to everyone.</p>
        </div>
      </div>
    </div>
  );
}

function WhoIsThisFor() {
  return (
    <div className="page-content-wrapper">
      <div className="content-box fade-in" style={{ textAlign: "left", maxWidth: 640 }}>
        <h1 className="hero-title">Who is this for?</h1>
        <p className="hero-desc">For visionaries who refuse to let technical barriers stand in the way.</p>
        <div className="glass-box" style={{ display: "flex", flexDirection: "column", gap: 40 }}>
           <div><h3 className="section-title">The Non-Technical Founder</h3><p style={{ color: "var(--text-sub)", lineHeight: 1.7 }}>You have a groundbreaking idea but lack coding skills.</p></div>
           <div><h3 className="section-title">The Rapid Prototyper</h3><p style={{ color: "var(--text-sub)", lineHeight: 1.7 }}>Validate ideas fast. Skip boilerplate.</p></div>
           <div><h3 className="section-title">Small Business Owners</h3><p style={{ color: "var(--text-sub)", lineHeight: 1.7 }}>Professional web presence without the agency cost.</p></div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// TEAM PAGE (Updated for Image Support)
// ──────────────────────────────────────────
function Team() {
  return (
    <div className="page-content-wrapper">
      <div className="content-box fade-in" style={{ maxWidth: 1200, width: '100%' }}>
        <h1 className="hero-title" style={{ textAlign: "center" }}>Our Team</h1>
        <p className="hero-desc" style={{ textAlign: "center", marginBottom: 40 }}>The minds behind Aakaar.io.</p>
        
        {/* CSS Grid for 3x3 Layout - Fixes the squeezing issue */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px',
          justifyContent: 'center'
        }}>
           {TEAM_MEMBERS.map((m, i) => (
             <div key={i} className="role-card" style={{ textAlign: "center", padding: "40px 20px" }}>
               
               {/* IMAGE LOGIC: If img exists, show it. If not, show Initials. */}
               {m.img ? (
                 <img 
                   src={m.img} 
                   alt={m.name} 
                   style={{ 
                     width: 100, 
                     height: 100, 
                     borderRadius: "50%", 
                     margin: "0 auto 24px", 
                     objectFit: "cover", 
                     border: "1px solid rgba(255,90,60,0.2)",
                     display: "block"
                   }} 
                 />
               ) : (
                 <div style={{ width: 100, height: 100, background: "rgba(255,90,60,0.1)", borderRadius: "50%", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#ff5a3c", border: "1px solid rgba(255,90,60,0.2)" }}>
                   {m.name.charAt(0)}
                 </div>
               )}

               <h3 style={{ fontSize: 20, marginBottom: 8, color: "var(--text)" }}>{m.name}</h3>
               <div style={{ fontSize: 13, color: "#ff5a3c", textTransform: "uppercase", marginBottom: 16, letterSpacing: 1, fontWeight: 600 }}>{m.role}</div>
               <p style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.6 }}>{m.bio}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function Landing({ onStart }) {
  const [vis, setVis] = useState([]);
  useEffect(() => { [0, 1, 2, 3, 4, 5].forEach((i) => setTimeout(() => setVis((p) => [...p, i]), 100 + i * 170)); }, []);
  const rv = (i) => ({ opacity: vis.includes(i) ? 1 : 0, transform: vis.includes(i) ? "translateY(0)" : "translateY(28px)", transition: "all 0.7s cubic-bezier(.22,1,.36,1)" });

  return (
    <div className="page-content-wrapper">
      <div className="content-box landing-box">
        <div style={{ ...rv(0), marginBottom: 32 }}><span className="badge">● Early Access — We're hiring</span></div>
        <h1 style={rv(1)} className="hero-title">Help us build<br /><span className="highlight">the future</span><br />of the web.</h1>
        <p style={rv(2)} className="hero-desc">We're an early-stage team building an AI product that lets anyone generate and launch websites — no code required.</p>
        <div style={{ ...rv(3) }} className="role-grid">
          {ROLES.map((r) => (
            <div key={r.id} className="role-card">
              <div className="role-head">{r.icon} {r.label}</div>
              <div className="role-desc">{r.desc}</div>
            </div>
          ))}
        </div>

        <div style={rv(4)}>
          <button onClick={onStart} className="primary-btn">
            Apply now <span style={{ fontSize: 18 }}>→</span>
          </button>
          <p className="micro-text">Takes ~5 minutes · No résumés</p>
        </div>

        {/* NEWSLETTER (Landing Page Version) - INCREASED GAP */}
        <div style={{ ...rv(5), marginTop: 60, paddingTop: 40, paddingBottom: 80, borderTop: "1px solid var(--border)" }}>
          <Newsletter />
        </div>

      </div>
    </div>
  );
}

function FormPage({ onBack }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [basics, setBasics] = useState({ name: "", year: "", college: "", phone: "", email: "", countryCode: "+91", honeypot: "" });
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleAnswers, setRoleAnswers] = useState({});
  const [commonAnswers, setCommonAnswers] = useState({});
  const startTime = useRef(Date.now());
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("aakaar_submitted")) { setHasSubmitted(true); setStep(4); }
  }, []);

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!basics.name.trim()) e.name = "Required";
      if (!basics.year) e.year = "Required";
      if (!basics.college.trim()) e.college = "Required";
      if (!basics.phone.trim() || basics.phone.length < 10) e.phone = "Invalid phone";
      if (!basics.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basics.email)) e.email = "Invalid email";
    }
    if (step === 1 && !selectedRole) e.role = "Required";
    if (step === 2) { ROLE_QUESTIONS[selectedRole].forEach(q => { if (q.type !== "textarea" && !roleAnswers[q.id]) e[q.id] = "Required"; if (q.type === "textarea" && !roleAnswers[q.id]?.trim()) e[q.id] = "Required"; }); }
    if (step === 3) { COMMON_QUESTIONS.forEach(q => { if (!q.optional && !commonAnswers[q.id]) e[q.id] = "Required"; }); }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => s + 1); };
  const back = () => { setErrors({}); setStep((s) => s - 1); };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (basics.honeypot || (Date.now() - startTime.current < 5000)) { alert("Submission rejected."); return; }
    
    if (!supabase) return alert("Database not connected.");

    setIsSubmitting(true);
    const { error } = await supabase.from('applications').insert([{
      name: basics.name, email: basics.email, phone: `${basics.countryCode} ${basics.phone}`,
      college: basics.college, year: basics.year, role: selectedRole, role_answers: roleAnswers, common_answers: commonAnswers
    }]);
    setIsSubmitting(false);
    if (error) { error.code === '23505' ? alert("Already applied.") : alert("Error submitting."); }
    else { localStorage.setItem("aakaar_submitted", "true"); setHasSubmitted(true); setStep(4); }
  };

  if (hasSubmitted && step !== 4) return (
    <div className="page-content-wrapper"><div className="content-box form-box" style={{ textAlign: 'center' }}>
      <div className="success-badge">✓</div><h2 className="section-title">Already Applied!</h2>
      <button onClick={onBack} className="text-btn">← Back Home</button>
    </div></div>
  );

  return (
    <div className="page-content-wrapper">
      <div className="content-box form-box">
        {step < 4 && <div className="progress-section"><div className="progress-track-slim"><div className="progress-fill-slim" style={{ width: `${(step/4)*100}%` }} /></div><div className="step-count-slim">Step {step+1} of 4</div></div>}
        <div className="form-content-pad">
          {step === 0 && <div className="fade-in">
            <h2 className="section-title">About you</h2>
            <input type="text" style={{display:'none'}} value={basics.honeypot} onChange={e=>setBasics({...basics, honeypot:e.target.value})} />
            
            {/* Added Placeholders back */}
            <div className="field-group"><Label>Name</Label><input type="text" value={basics.name} placeholder="e.g. John Thomas" onChange={e=>setBasics({...basics, name:e.target.value})} style={inputStyle(!!errors.name)} /><ErrorMsg msg={errors.name}/></div>
            <div className="field-group"><Label>Year</Label><SelectField value={basics.year} onChange={v=>setBasics({...basics, year:v})} options={YEAR_OPTIONS} hasError={!!errors.year} /><ErrorMsg msg={errors.year}/></div>
            <div className="field-group"><Label>School / College / Company</Label><input type="text" value={basics.college} placeholder="e.g. Stanford or Google" onChange={e=>setBasics({...basics, college:e.target.value})} style={inputStyle(!!errors.college)} /><ErrorMsg msg={errors.college}/></div>
            
            <div className="field-group"><Label>Phone</Label><div style={{display:'flex', gap:10}}><div style={{width:90}}><SelectField value={basics.countryCode} onChange={v=>setBasics({...basics, countryCode:v})} options={COUNTRY_CODES}/></div><input type="tel" value={basics.phone} placeholder="98765 43210" onChange={e=>{const v=e.target.value.replace(/\D/g,""); if(v.length<=10)setBasics({...basics, phone:v})}} style={{...inputStyle(!!errors.phone), flex:1}} /></div><ErrorMsg msg={errors.phone}/></div>
            
            <div className="field-group"><Label>Email</Label><input type="email" value={basics.email} placeholder="e.g. john@example.com" onChange={e=>setBasics({...basics, email:e.target.value})} style={inputStyle(!!errors.email)} /><ErrorMsg msg={errors.email}/></div>
          </div>}
          
          {step === 1 && <div className="fade-in">
            <h2 className="section-title">Pick a role</h2>
            <div className="role-list">
              {ROLES.map(r=>(
                <button key={r.id} onClick={()=>{setSelectedRole(r.id);setRoleAnswers({})}} className={`role-btn ${selectedRole===r.id?"active":""}`}>
                  <span className="role-icon">{selectedRole===r.id?"✓":r.icon}</span>
                  <div style={{ textAlign: "left" }}>
                    <div className="role-name">{r.label}</div>
                    <div className="role-sub">{r.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <ErrorMsg msg={errors.role}/>
          </div>}
          
          {step === 2 && <div className="fade-in"><h2 className="section-title">Questions</h2>{(ROLE_QUESTIONS[selectedRole]||[]).map(q=><QuestionBlock key={q.id} q={q} value={roleAnswers[q.id]} onChange={v=>setRoleAnswers({...roleAnswers, [q.id]:v})} error={errors[q.id]}/>)}</div>}
          {step === 3 && <div className="fade-in"><h2 className="section-title">Final details</h2>{COMMON_QUESTIONS.map(q=><QuestionBlock key={q.id} q={q} value={commonAnswers[q.id]} onChange={v=>setCommonAnswers({...commonAnswers, [q.id]:v})} error={errors[q.id]}/>)}</div>}
          {step === 4 && <div className="fade-in" style={{textAlign:'center'}}><div className="success-badge">✓</div><h2 className="section-title">You're in!</h2><p className="hero-desc">We'll email <strong>{basics.email}</strong> soon.</p><div style={{marginTop:40}}><Newsletter compact={true}/></div></div>}
          
          {/* NAVIGATION BUTTONS */}
          {step < 4 && <div className="nav-row"><button onClick={()=>step===0?onBack():back()} className="text-btn">← Back</button><button onClick={()=>step===3?handleSubmit():next()} className="primary-btn" disabled={isSubmitting}>{isSubmitting?"Sending...":step===3?"Submit":"Continue"}</button></div>}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// 6. MAIN APP COMPONENT
// ──────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [theme, setTheme] = useState("dark");
  const [showRickRoll, setShowRickRoll] = useState(false); // Rick Roll State
  const urlPath = window.location.pathname;

  useEffect(() => { document.body.className = theme; }, [theme]);

  // Route: Admin
  if (urlPath === '/admin') {
    return (
      <>
        <GlobalStyles theme={theme} />
        <CursorBlob />
        <AdminPanel />
      </>
    );
  }

  // Route: Main Site
  return (
    <>
      <GlobalStyles theme={theme} />
      
      {/* Rick Roll Overlay */}
      {showRickRoll && (
        <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: "black", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h1 style={{ color: "#ff5a3c", fontSize: "40px", marginBottom: "30px", fontFamily: "'Playfair Display', serif", textAlign: 'center', padding: '0 20px' }}>Light mode is for pussies XD</h1>
          <iframe 
            width="800" height="450" 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
            title="Rick Roll" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            style={{ maxWidth: '100vw', maxHeight: '50vh' }}
          ></iframe>
          <button onClick={() => setShowRickRoll(false)} style={{ marginTop: "30px", padding: "10px 20px", background: "#333", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>I understand, take me back :')</button>
        </div>
      )}

      <div style={{ position: "fixed", top: "-100px", right: "-100px", width: "400px", height: "400px", background: "rgba(255,90,60,0.1)", filter: "blur(100px)", borderRadius: "50%", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-100px", left: "-100px", width: "300px", height: "300px", background: "rgba(60,60,200,0.1)", filter: "blur(100px)", borderRadius: "50%", zIndex: 0 }} />
      
      <CursorBlob />
      
      {/* Pass setShowRickRoll to toggleTheme prop */}
      <FixedHeader 
        onNavigate={setPage} 
        theme={theme} 
        toggleTheme={() => setShowRickRoll(true)} 
      />

      {page === "landing" ? <Landing onStart={() => setPage("form")} /> : 
       page === "form" ? <FormPage onBack={() => setPage("landing")} /> :
       page === "about" ? <About /> :
       page === "team" ? <Team /> :
       <WhoIsThisFor />}
       
      <Footer />
    </>
  );
}

function GlobalStyles({ theme }) {
  return (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;800&display=swap');
        :root {
          --bg: #0c0c0e; --text: #ffffff; --text-sub: rgba(255,255,255,0.5); --text-muted: rgba(255,255,255,0.3);
          --border: rgba(255,255,255,0.1); --glass-bg: rgba(255,255,255,0.03); --glass-border: rgba(255,255,255,0.08);
          --input-bg: rgba(255,255,255,0.06); --accent: #ff5a3c; --nav-text: rgba(255,255,255,0.6); --nav-hover: #ffffff;
          --header-bg: rgba(12, 12, 14, 0.85); --grid-color: rgba(255, 255, 255, 0.03);
        }
        body.light {
          --bg: #f2f2f7; --text: #1a1a1e; --text-sub: rgba(26, 26, 30, 0.6); --text-muted: rgba(26, 26, 30, 0.4);
          --border: rgba(26, 26, 30, 0.1); --glass-bg: rgba(255, 255, 255, 0.7); --glass-border: rgba(26, 26, 30, 0.06);
          --input-bg: #ffffff; --accent: #ff5a3c; --nav-text: rgba(26, 26, 30, 0.6); --nav-hover: #1a1a1e;
          --header-bg: rgba(242, 242, 247, 0.85); --grid-color: rgba(0, 0, 0, 0.05);
        }
        html, body, #root { 
          width: 100%; min-height: 100vh; margin: 0; padding: 0; 
          background: var(--bg); color: var(--text); overflow-x: hidden;
          font-family: 'Inter', sans-serif; transition: background 0.3s, color 0.3s;
          background-image: linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
          background-size: 30px 30px; background-position: center top; background-attachment: fixed;
        }
        #root { display: flex; flex-direction: column; }
        .fixed-header { position: fixed; top: 0; left: 0; width: 100%; height: 80px; display: flex; justify-content: center; align-items: center; padding: 0 40px; z-index: 100; background: var(--header-bg); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); box-sizing: border-box; }
        .header-content { width: 100%; display: flex; justify-content: space-between; align-items: center; }
        .logo-text { font-weight: 800; font-size: 20px; letter-spacing: 1px; color: var(--text); cursor: pointer; }
        .header-nav { display: flex; gap: 30px; position: absolute; left: 50%; transform: translateX(-50%); }
        .header-link { background: none; border: none; color: var(--nav-text); font-size: 14px; font-weight: 500; cursor: pointer; transition: color 0.2s; font-family: 'Inter', sans-serif; }
        .header-link:hover { color: var(--nav-hover); }
        .header-right { display: flex; align-items: center; gap: 24px; }
        .social-links { display: flex; align-items: center; gap: 16px; }
        .social-icon, .icon-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; padding: 0; background: none; border: none; color: var(--nav-text); cursor: pointer; transition: color 0.2s; }
        .social-icon:hover, .icon-btn:hover { color: var(--nav-hover); }
        .mobile-menu-btn { display: none; background: none; border: none; color: var(--text); cursor: pointer; padding: 8px; }
        .mobile-dropdown { position: absolute; top: 80px; left: 0; width: 100%; background: var(--bg); border-bottom: 1px solid var(--border); padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; gap: 16px; animation: slideDown 0.2s ease-out; }
        .mobile-link { background: none; border: none; color: var(--text-sub); font-size: 16px; font-weight: 500; text-align: left; padding: 10px; cursor: pointer; border-radius: 8px; font-family: 'Inter', sans-serif; }
        .mobile-link:hover { background: var(--input-bg); color: var(--text); }
        .mobile-socials { display: flex; gap: 24px; padding: 10px; margin-top: 10px; border-top: 1px solid var(--border); padding-top: 20px; }
        .page-content-wrapper { padding-top: 100px; padding-bottom: 40px; padding-left: 20px; padding-right: 20px; display: flex; justify-content: center; flex: 1; width: 100%; box-sizing: border-box; flex-direction: column; align-items: center; }
        .content-box { width: 100%; max-width: 600px; position: relative; }
        .landing-box { text-align: center; }
        .form-box { text-align: left; padding-bottom: 40px; }
        .glass-box { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; padding: 32px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); margin-top: 48px; }
        .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(36px, 6vw, 64px); line-height: 1.1; margin: 0 0 24px; color: var(--text); }
        .highlight { color: var(--accent); font-style: italic; }
        .hero-desc { font-size: 16px; color: var(--text-sub); line-height: 1.6; margin-bottom: 32px; }
        .section-title { font-family: 'Playfair Display', serif; font-size: 28px; margin-top: 0; margin-bottom: 24px; color: var(--text); }
        .badge { display: inline-block; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); border: 1px solid rgba(255,90,60,0.4); padding: 5px 12px; border-radius: 20px; background: rgba(255,90,60,0.05); }
        .micro-text { font-size: 12px; color: var(--text-muted); margin-top: 16px; }
        .role-grid { display: flex; flex-wrap: nowrap; justify-content: center; gap: 12px; margin-bottom: 40px; width: 100%; }
        .role-card { flex: 1; min-width: 0; background: var(--glass-bg); border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; text-align: left; }
        .role-head { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-sub); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .role-desc { font-size: 12px; color: var(--text); opacity: 0.9; line-height: 1.3; }
        .field-group { margin-bottom: 20px; }
        input, select, textarea { display: block; }
        .primary-btn { background: var(--accent); color: white; border: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: transform 0.1s; font-family: 'Inter', sans-serif; }
        .primary-btn:hover { transform: scale(1.02); }
        .text-btn { background: none; border: none; color: var(--text-sub); cursor: pointer; font-size: 14px; padding: 10px 20px; font-family: 'Inter', sans-serif; }
        .text-btn:hover { color: var(--text); }
        .nav-row { display: flex; justify-content: space-between; align-items: center; margin-top: 40px; margin-bottom: 10px; }
        .role-list { display: flex; flex-direction: column; gap: 10px; }
        .role-btn { background: var(--input-bg); border: 1px solid var(--border); padding: 16px; border-radius: 10px; display: flex; align-items: center; gap: 15px; cursor: pointer; color: var(--text); transition: all 0.2s; }
        .role-btn.active { border-color: var(--accent); background: rgba(255,90,60,0.1); }
        .role-icon { width: 32px; height: 32px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--text); }
        .active .role-icon { background: var(--accent); color: white; }
        .role-name { font-weight: 600; font-size: 15px; }
        .role-sub { font-size: 13px; color: var(--text-sub); }
        .progress-section { margin-top: 40px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 8px; }
        .progress-track-slim { width: 100%; height: 2px; background: var(--border); border-radius: 2px; overflow: hidden; }
        .progress-fill-slim { height: 100%; background: var(--accent); transition: width 0.3s; }
        .step-count-slim { font-size: 10px; color: var(--text-muted); font-family: monospace; text-align: right; letter-spacing: 1px; }
        .success-badge { width: 60px; height: 60px; border-radius: 50%; border: 2px solid var(--accent); color: var(--accent); font-size: 24px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .site-footer { border-top: 1px solid var(--border); background: var(--header-bg); padding: 60px 40px; margin-top: auto; }
        .footer-content-wrapper { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 40px; }
        .footer-col { flex: 1; min-width: 250px; }
        .contact-item { margin-bottom: 16px; }
        .map-frame { width: 100%; height: 200px; border-radius: 12px; overflow: hidden; background: var(--input-bg); border: 1px solid var(--border); }
        .map-frame iframe { transition: all 0.5s ease; filter: grayscale(100%) invert(92%) contrast(0.83); }
        .map-frame:hover iframe { filter: none; }
        body.light .map-frame iframe { filter: grayscale(100%) opacity(0.8); }
        body.light .map-frame:hover iframe { filter: none; }
        .footer-copyright { max-width: 1200px; margin: 40px auto 0; padding-top: 20px; border-top: 1px solid var(--border); text-align: center; color: var(--text-muted); font-size: 13px; }
        @media (max-width: 600px) {
           .hero-title { font-size: 40px; }
           .fixed-header { height: 70px; padding: 0 20px; }
           .header-content { padding: 0; }
           .header-nav { display: none; }
           .desktop-only { display: none; }
           .mobile-menu-btn { display: block; }
           .page-content-wrapper { padding-top: 90px; }
           .role-grid { gap: 8px; }
           .role-card { padding: 10px 8px; }
           .site-footer { padding: 40px 20px; }
           .footer-content-wrapper { flex-direction: column; }
        }
    `}</style>
  );
}