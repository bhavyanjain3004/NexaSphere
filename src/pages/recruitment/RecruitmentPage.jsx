import { useEffect, useMemo, useRef, useState } from 'react';
import { DynamicIcon, IconArrowLeft, IconArrowRight, IconBolt, IconShieldCheck, IconSpark, IconUsers } from '../../shared/Icons';
import Footer from '../../shared/Footer';
import useFormValidation from '../../hooks/useFormValidation';

/* ── Roles & Responsibilities slide-over modal ───────────────────────────── */
function RolesGuideModal({ onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  const sec = (icon, title, children) => (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontFamily: 'Orbitron,monospace', fontSize: '.75rem', letterSpacing: '.14em',
        color: 'var(--c1)', textTransform: 'uppercase', marginBottom: 12,
        display: 'flex', alignItems: 'center', gap: 8,
        borderBottom: '1px solid var(--bdr)', paddingBottom: 8,
      }}>
        <DynamicIcon name={icon} size={16} /> {title}
      </div>
      {children}
    </div>
  );

  const role = (icon, name, domain, items) => (
    <div style={{
      background: 'var(--card2)', border: '1px solid var(--bdr)', borderRadius: 'var(--r2)',
      padding: '14px 16px', marginBottom: 10, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--t1)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
        <DynamicIcon name={icon} size={16} /> {name}
      </div>
      {domain && <div style={{ fontSize: '.78rem', color: 'var(--c1)', marginBottom: 8, fontFamily: 'Space Mono,monospace' }}>Domain: {domain}</div>}
      <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 4 }}>
        {items.map((it, i) => <li key={i} style={{ fontSize: '.86rem', color: 'var(--t2)', lineHeight: 1.55 }}>{it}</li>)}
      </ul>
    </div>
  );

  return (
    <>
      
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 99998,
          background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(4px)',
        }}
      />
      
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 99999,
        width: 'min(680px, 96vw)',
        background: 'var(--bg)',
        borderLeft: '1px solid var(--bdr2)',
        boxShadow: '-8px 0 48px rgba(0,0,0,.5)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideInRight .28s cubic-bezier(.22,1,.36,1)',
      }}>
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>

        
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--bdr)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(0,212,255,.06), rgba(123,111,255,.04))',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontFamily: 'Orbitron,monospace', fontSize: '.95rem', fontWeight: 700, color: 'var(--t1)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><DynamicIcon name="Target" size={16} /> Core Team Structure & Roles</span>
            </div>
            <div style={{ fontSize: '.78rem', color: 'var(--t3)', marginTop: 4 }}>
              NexaSphere — GL Bajaj Group of Institutions · Last Updated: 25/01/2026
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'var(--card2)', border: '1px solid var(--bdr2)',
              borderRadius: 8, width: 36, height: 36, cursor: 'pointer',
              color: 'var(--t1)', fontSize: '1.1rem', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          ><DynamicIcon name="X" size={18} /></button>
        </div>

        
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', scrollbarWidth: 'thin' }}>
          <p style={{ color: 'var(--t2)', fontSize: '.88rem', lineHeight: 1.7, marginBottom: 24 }}>
            NexaSphere operates through a structured, responsibility-driven Core Team where every role has defined authority, accountability, and execution ownership.
            All roles function under NexaSphere governance and college approval where applicable.
          </p>

          {sec('Brain', '1. Technical Leadership Team', <>
            {role('Target', 'Technical Lead (Overall)', 'Cloud, AI/ML, Android, Web, Cybersecurity', [
              'Maintain overall technical quality across all NexaSphere initiatives',
              'Guide and mentor all Domain Leads',
              'Review and approve session content, workshop plans, and project roadmaps',
              'Ensure learning remains hands-on, practical, and industry-aligned',
              'Act as the final technical decision-maker',
            ])}
            {role('Globe', 'Domain Lead', 'One specific domain', [
              'Plan and conduct domain-specific sessions & workshops',
              'Lead hands-on projects and mentor members in their domain',
              'Stay updated with tools and trends',
              'Align activities with Technical Lead\'s roadmap',
            ])}
            {role('Cloud', 'Cloud Lead', 'Google Cloud, Firebase, DevOps, AWS', [
              'Conduct Cloud study jams & labs',
              'Organize certification prep sessions',
              'Manage demo environments and guide cloud-based projects',
            ])}
            {role('Brain', 'AI / ML Lead', 'AI, ML, Generative AI', [
              'Design structured AI/ML learning paths',
              'Conduct workshops with live demos',
              'Mentor AI projects and promote responsible AI practices',
            ])}
            {role('Smartphone', 'Android Lead', 'Android, Kotlin, Jetpack', [
              'Conduct Android workshops and run live coding sessions',
              'Mentor mobile app projects',
              'Support hackathons (mobile tech)',
            ])}
            {role('Code2', 'Web / Full-Stack Lead', 'Frontend, Backend, MERN', [
              'Deliver web workshops and guide full-stack learning paths',
              'Maintain GitHub repositories',
              'Provide technical support in events',
            ])}
            {role('ShieldCheck', 'Cybersecurity Lead', 'Cybersecurity, Ethical Hacking', [
              'Conduct security awareness sessions',
              'Organize CTF workshops',
              'Teach secure coding fundamentals',
            ])}
          </>)}

          {sec('Palette', '2. Product & Creative Team', <>
            {role('Palette', 'UI/UX Lead', null, [
              'Conduct design workshops',
              'Promote user-centric thinking',
              'Collaborate with tech teams',
            ])}
            {role('Puzzle', 'Product Management Lead', null, [
              'Bridge tech and user needs',
              'Guide MVP development',
              'Support hackathons with product strategy',
            ])}
            {role('Camera', 'Media & Design Lead', null, [
              'Design posters & certificates',
              'Handle photography & reels',
              'Maintain NexaSphere brand consistency',
            ])}
          </>)}

          {sec('ClipboardList', '3. Operations & Management Team', <>
            {role('Calendar', 'Event Management Lead', null, [
              'Plan and execute events end-to-end',
              'Manage timelines & logistics',
              'Coordinate across teams',
            ])}
            {role('Calendar', 'Event Management Co-Lead', null, [
              'Assist in execution and handle on-ground coordination',
              'Manage contingencies',
            ])}
            {role('Megaphone', 'Marketing & Social Media Lead', null, [
              'Promote initiatives and manage official platforms',
              'Increase reach & engagement',
            ])}
            {role('PenLine', 'Content & Documentation Lead', null, [
              'Write event reports & announcements',
              'Maintain internal documentation and collect feedback',
              'Design two certificates per event (Top 3 Performer + Participation)',
              'Provide official certificates to Core Team members for events they organised',
            ])}
            {role('Globe', 'Community & Outreach Lead', null, [
              'Manage onboarding and build partnerships',
              'Drive engagement initiatives',
              'Represent student voice',
            ])}
            {role('Users', 'Volunteers & Coordinators', null, [
              'Support event execution and handle registrations',
              'Assist participants and provide technical/logistical support',
            ])}
          </>)}
        </div>

        
        <div style={{
          padding: '14px 24px', borderTop: '1px solid var(--bdr)',
          display: 'flex', justifyContent: 'flex-end', flexShrink: 0,
          background: 'var(--card)',
        }}>
          <button type="button" onClick={onClose} className="btn btn-primary">
            Back to Application Form
          </button>
        </div>
      </div>
    </>
  );
}

const WHATSAPP_SCREENING = 'https://chat.whatsapp.com/EFbDGo6awGP2L0laESg3lq';
const WHATSAPP_COMMUNITY = 'https://chat.whatsapp.com/FhpJEaod2g419jFMfqrhGZ';
const LINKEDIN_PAGE      = 'https://www.linkedin.com/showcase/glbajaj-nexasphere/';
const RECRUITMENT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzo1g6WNiO-f8kySE4Mqbdlh3VxZx9pRGLcjt7qyzRCNB1TMK0kRwjZbDD2UsaJFQ0q/exec';

const ROLE_OPTIONS = [
  'Technical Lead',
  'Domain Lead',
  'Co-Lead',
  'Management Lead',
  'Core Team Member',
];

const INTEREST_OPTIONS = [
  'Cloud Computing',
  'Artificial Intelligence / Machine Learning',
  'Android Development',
  'Web / Full-Stack Development',
  'Cyber Security',
  'UI / UX Design',
  'Event Management',
  'Marketing & Social Media',
  'Content & Documentation',
  'Community & Outreach',
];

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const SECTION_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'Other'];
const COMMIT_OPTIONS = ['Yes', 'No', 'Maybe'];

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function Field({ label, required, hint, error, errorId, children }) {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <div style={{
          fontFamily: 'Orbitron,monospace',
          fontSize: '.72rem',
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          color: 'var(--t1)',
        }}>
          {label}{required ? <span style={{ color: 'var(--c4)', marginLeft: 6 }}>*</span> : null}
        </div>
        {hint ? <div style={{ color: 'var(--t3)', fontSize: '.82rem' }}>{hint}</div> : null}
      </div>
      {children}
      {error && (
        <div
          id={errorId}
          role="alert"
          style={{
            color: '#ef4444',
            fontSize: '.82rem',
            marginTop: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'Space Mono,monospace',
          }}
        >
          <span>⚠️</span> {error}
        </div>
      )}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text', maxLength, inputMode: inputModeProp, onPaste, ...rest }) {
  const isInvalid = rest['aria-invalid'] === 'true';
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      onPaste={onPaste}
      placeholder={placeholder}
      type={type}
      maxLength={maxLength}
      inputMode={inputModeProp || (type === 'tel' ? 'numeric' : undefined)}
      style={{
        width: '100%',
        padding: '12px 14px',
        background: 'var(--card2)',
        border: `1px solid ${isInvalid ? '#ef4444' : 'var(--bdr2)'}`,
        boxShadow: isInvalid ? '0 0 10px rgba(239, 68, 68, 0.15)' : undefined,
        borderRadius: 'var(--r2)',
        color: 'var(--t1)',
        fontFamily: 'Rajdhani,sans-serif',
        fontSize: '.98rem',
        outline: 'none',
      }}
      onFocus={e => {
        e.target.style.borderColor = isInvalid ? '#ef4444' : 'var(--c1b)';
        e.target.style.boxShadow = isInvalid ? '0 0 12px rgba(239, 68, 68, 0.3)' : 'var(--sh1)';
      }}
      onBlur={e => {
        e.target.style.borderColor = isInvalid ? '#ef4444' : 'var(--bdr2)';
        e.target.style.boxShadow = isInvalid ? '0 0 10px rgba(239, 68, 68, 0.15)' : 'none';
      }}
      {...rest}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 5, ...rest }) {
  const isInvalid = rest['aria-invalid'] === 'true';
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%',
        padding: '12px 14px',
        background: 'var(--card2)',
        border: `1px solid ${isInvalid ? '#ef4444' : 'var(--bdr2)'}`,
        boxShadow: isInvalid ? '0 0 10px rgba(239, 68, 68, 0.15)' : undefined,
        borderRadius: 'var(--r2)',
        color: 'var(--t1)',
        fontFamily: 'Rajdhani,sans-serif',
        fontSize: '.98rem',
        outline: 'none',
        resize: 'vertical',
      }}
      onFocus={e => {
        e.target.style.borderColor = isInvalid ? '#ef4444' : 'var(--c1b)';
        e.target.style.boxShadow = isInvalid ? '0 0 12px rgba(239, 68, 68, 0.3)' : 'var(--sh1)';
      }}
      onBlur={e => {
        e.target.style.borderColor = isInvalid ? '#ef4444' : 'var(--bdr2)';
        e.target.style.boxShadow = isInvalid ? '0 0 10px rgba(239, 68, 68, 0.15)' : 'none';
      }}
      {...rest}
    />
  );
}

function StyledSelect({ children, value, onChange, placeholder, ...rest }) {
  const isInvalid = rest['aria-invalid'] === 'true';
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 14px',
          background: 'var(--card2)',
          border: `1px solid ${isInvalid ? '#ef4444' : 'var(--bdr2)'}`,
          boxShadow: isInvalid ? '0 0 10px rgba(239, 68, 68, 0.15)' : undefined,
          borderRadius: 'var(--r2)',
          color: value ? 'var(--t1)' : 'var(--t3)',
          fontFamily: 'Rajdhani,sans-serif',
          fontSize: '.98rem',
          outline: 'none',
          cursor: 'pointer',
          appearance: 'none',
          WebkitAppearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23CC1111' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
          paddingRight: '36px',
        }}
        onFocus={e => {
          e.target.style.borderColor = isInvalid ? '#ef4444' : 'var(--c1b)';
          e.target.style.boxShadow = isInvalid ? '0 0 12px rgba(239, 68, 68, 0.3)' : 'var(--sh1)';
        }}
        onBlur={e => {
          e.target.style.borderColor = isInvalid ? '#ef4444' : 'var(--bdr2)';
          e.target.style.boxShadow = isInvalid ? '0 0 10px rgba(239, 68, 68, 0.15)' : 'none';
        }}
        {...rest}
      >
        {placeholder ? <option value="" disabled>{placeholder}</option> : null}
        {children}
      </select>
    </div>
  );
}

function PillRadio({ options, value, onChange, ...rest }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }} {...rest}>
      {options.map(opt => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="btn btn-outline btn-sm"
            style={{
              background: active ? 'linear-gradient(135deg,var(--c1),var(--c2))' : undefined,
              color: active ? '#fff' : undefined,
              borderColor: active ? 'transparent' : undefined,
              boxShadow: active ? '0 0 18px var(--c1g)' : undefined,
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function MultiSelectChips({ options, values, onToggle, ...rest }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }} {...rest}>
      {options.map(opt => {
        const active = values.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className="btn btn-outline btn-sm"
            style={{
              background: active ? 'rgba(0,212,255,.12)' : undefined,
              borderColor: active ? 'var(--c1)' : undefined,
              color: active ? 'var(--t1)' : undefined,
              boxShadow: active ? '0 0 14px var(--c1g)' : undefined,
              textTransform: 'none',
              letterSpacing: '.03em',
              fontSize: '.82rem',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {active ? <DynamicIcon name="CheckCircle" size={13} /> : null}{opt}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const BRANCH_OPTIONS = [
  'Computer Science Engineering (CSE)',
  'Computer Science (CS)',
  'Information Technology (IT)',
  'AI & Machine Learning (AIML)',
  'Computer Science & Design (CSD)',
  'MBA',
  'Other',
];

export default function RecruitmentPage({ onBack }) {
  const [step, setStep] = useState(0); 
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [err, setErr] = useState('');
  const [showRoles, setShowRoles] = useState(false); 
  const topRef = useRef(null);

  
  useEffect(() => {
    try {
      const submitted = JSON.parse(localStorage.getItem('ns_submitted_emails') || '[]');
      if (submitted.length > 0) setAlreadySubmitted(true);
    } catch { /* ignore */ }
  }, []);

  const {
    values: form,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues,
    setErrors,
  } = useFormValidation(
    {
      fullName: '',
      collegeEmail: '',
      whatsapp: '',
      year: '',
      branch: '',
      branchOther: '',
      section: '',
      sectionOther: '',
      role: '',
      interests: [],
      skills: '',
      comms: '',
      campusExp: '',
      campusExpDetails: '',
      links: '',
      commitHours: '',
      attendCampus: '',
      assessmentOk: '',
      whyJoin: '',
      anythingElse: '',
      declarations: {
        truth: false,
        time: false,
        participate: false,
        disagree: false,
      },
    },
    {
      fullName: { required: true, requiredMessage: 'Full name is required' },
      collegeEmail: {
        required: true,
        requiredMessage: 'College email is required',
        email: true,
        emailMessage: 'Please enter a valid email address',
        custom: (val) => {
          if (val && !val.endsWith('@glbajajgroup.org')) {
            return 'Please use your official GL Bajaj email (@glbajajgroup.org)';
          }
        }
      },
      whatsapp: {
        required: true,
        requiredMessage: 'WhatsApp number is required',
        phone: true,
        phoneMessage: 'WhatsApp number must be exactly 10 digits'
      },
      year: { required: true, requiredMessage: 'Year of study is required' },
      branch: { required: true, requiredMessage: 'Branch/Department is required' },
      branchOther: {
        custom: (val, values) => {
          if (values.branch === 'Other' && !String(val || '').trim()) {
            return 'Branch specification is required';
          }
        }
      },
      section: { required: true, requiredMessage: 'Section is required' },
      sectionOther: {
        custom: (val, values) => {
          if (values.section === 'Other' && !String(val || '').trim()) {
            return 'Section specification is required';
          }
        }
      },
      role: { required: true, requiredMessage: 'Role selection is required' },
      interests: {
        custom: (val) => {
          if (!val || val.length === 0) {
            return 'Please select at least one area of interest';
          }
        }
      },
      skills: { required: true, requiredMessage: 'Skills description is required' },
      comms: { required: true, requiredMessage: 'Communication details are required' },
      campusExp: { required: true, requiredMessage: 'Campus experience selection is required' },
      links: {
        custom: (val) => {
          if (val && !/^https:\/\/github\.com\/[a-zA-Z0-9][a-zA-Z0-9\-]{0,37}\/?$/.test(val)) {
            return 'Please enter a valid GitHub profile URL (e.g. https://github.com/YourUsername)';
          }
        }
      },
      commitHours: { required: true, requiredMessage: 'Please confirm weekly commitment availability' },
      attendCampus: { required: true, requiredMessage: 'Please confirm campus attendance availability' },
      assessmentOk: { required: true, requiredMessage: 'Please confirm agreement to trials/assessments' },
      whyJoin: { required: true, requiredMessage: 'Please explain why you want to join the Core Team' },
      declarations: {
        custom: (val) => {
          const d = val || {};
          if (d.disagree) {
            return 'You must agree to the declarations to apply';
          }
          if (!d.truth || !d.time || !d.participate) {
            return 'Please confirm all three declaration checkboxes to submit';
          }
        }
      }
    }
  );

  const stepFields = {
    1: ['fullName', 'collegeEmail', 'whatsapp', 'year', 'branch', 'branchOther', 'section', 'sectionOther'],
    2: ['role', 'interests'],
    3: ['skills', 'comms', 'campusExp', 'links'],
    4: ['commitHours', 'attendCampus', 'assessmentOk'],
    5: ['whyJoin'],
    6: ['declarations']
  };

  const steps = useMemo(() => ([
    {
      title: 'About NexaSphere',
      subtitle: 'NexaSphere Core Team Recruitment — 2026',
      icon: <IconBolt style={{ width: 18, height: 18 }} />,
      requiredKeys: [],
      render: () => (
        <div style={{ display: 'grid', gap: 18 }}>
          
          <div style={{
            background: 'rgba(255,180,0,.08)',
            border: '1px solid rgba(255,180,0,.32)',
            borderRadius: 'var(--r3)',
            padding: '14px 18px',
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <span style={{ display: 'flex', color: '#ffb400', flexShrink: 0 }}><DynamicIcon name="AlertTriangle" size={22} /></span>
            <div style={{ lineHeight: 1.75 }}>
              <div style={{
                fontFamily: 'Orbitron,monospace', fontSize: '.75rem',
                letterSpacing: '.1em', color: 'var(--t1)', marginBottom: 6, textTransform: 'uppercase',
              }}>
                Important — Read Before Proceeding
              </div>
              <div style={{ fontSize: '.9rem', color: 'var(--t2)' }}>
                This application form can be filled <b style={{ color: 'var(--t1)' }}>only once</b> per device.
                Please <b style={{ color: 'var(--t1)' }}>read every question carefully</b> and{' '}
                <b style={{ color: 'var(--t1)' }}>verify all your details</b> before submitting.
                Once submitted, you will not be able to edit your response.
              </div>
            </div>
          </div>

          <p style={{ color: 'var(--t2)' }}>
            We are building the Core Team for <span className="grad-text" style={{ fontWeight: 700 }}>NexaSphere</span> — the central tech community
            that brings together GDG On Campus activities, cloud programs, workshops, hackathons, and multi-domain learning on campus.
          </p>
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--bdr)',
            borderRadius: 'var(--r3)',
            padding: 18,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div className="corner-tl"/><div className="corner-br"/>
            <div style={{
              fontFamily: 'Space Mono,monospace',
              fontSize: '.65rem',
              color: 'var(--t3)',
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}>Important notes</div>
            <ul style={{ paddingLeft: 18, display: 'grid', gap: 8, color: 'var(--t2)' }}>
              <li>By filling this form, you are committing <b>4–6 hours/week</b> to NexaSphere activities.</li>
              <li>Attendance support will be provided for lectures missed due to officially approved events.</li>
              <li>Short test / trial activities may be conducted to evaluate credibility, consistency, and teamwork.</li>
              <li>Only serious, responsible, and committed students should apply.</li>
            </ul>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
          }}>
            <div className="activity-card" style={{ cursor: 'default' }}>
              <div className="card-accent-line"/>
              <div className="activity-icon" style={{ display: 'flex', justifyContent: 'center' }}>
                <IconBolt style={{ width: 34, height: 34 }} />
              </div>
              <div className="activity-title">Weekly Commitment</div>
              <div className="activity-desc">4–6 hours, consistent.</div>
            </div>
            <div className="activity-card" style={{ cursor: 'default' }}>
              <div className="card-accent-line"/>
              <div className="activity-icon" style={{ display: 'flex', justifyContent: 'center' }}>
                <IconUsers style={{ width: 34, height: 34 }} />
              </div>
              <div className="activity-title">Team First</div>
              <div className="activity-desc">Collaboration and reliability.</div>
            </div>
            <div className="activity-card" style={{ cursor: 'default' }}>
              <div className="card-accent-line"/>
              <div className="activity-icon" style={{ display: 'flex', justifyContent: 'center' }}>
                <IconShieldCheck style={{ width: 34, height: 34 }} />
              </div>
              <div className="activity-title">Trial Rounds</div>
              <div className="activity-desc">Short assessments may happen.</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Personal Information',
      subtitle: 'Please fill in your basic details accurately.',
      icon: <IconUsers style={{ width: 18, height: 18 }} />,
      render: () => (
        <div style={{ display: 'grid', gap: 18 }}>
          <Field
            label="Full Name"
            required
            error={touched.fullName && errors.fullName}
            errorId="error-fullName"
          >
            <Input
              id="input-fullName"
              value={form.fullName}
              onChange={v => handleChange('fullName', v.replace(/[^a-zA-Z\s.\-']/g, ''))}
              onBlur={() => handleBlur('fullName')}
              placeholder="Your full name"
              maxLength={60}
              aria-invalid={touched.fullName && errors.fullName ? "true" : "false"}
              aria-describedby={touched.fullName && errors.fullName ? "error-fullName" : undefined}
            />
          </Field>
          <Field
            label="College Email ID"
            required
            hint="Must end with @glbajajgroup.org"
            error={touched.collegeEmail && errors.collegeEmail}
            errorId="error-collegeEmail"
          >
            <Input
              id="input-collegeEmail"
              value={form.collegeEmail}
              onChange={v => handleChange('collegeEmail', v.trim().toLowerCase())}
              onBlur={() => handleBlur('collegeEmail')}
              placeholder="name@glbajajgroup.org"
              type="email"
              maxLength={80}
              aria-invalid={touched.collegeEmail && errors.collegeEmail ? "true" : "false"}
              aria-describedby={touched.collegeEmail && errors.collegeEmail ? "error-collegeEmail" : undefined}
            />
          </Field>
          <Field
            label="WhatsApp Number"
            required
            error={touched.whatsapp && errors.whatsapp}
            errorId="error-whatsapp"
          >
            <Input
              id="input-whatsapp"
              value={form.whatsapp}
              onChange={v => handleChange('whatsapp', String(v || '').replace(/[^\d]/g, '').slice(0, 10))}
              onBlur={() => handleBlur('whatsapp')}
              onPaste={e => {
                e.preventDefault();
                const pasted = e.clipboardData.getData('text').replace(/[^\d]/g, '').slice(0, 10);
                handleChange('whatsapp', pasted);
              }}
              placeholder="10-digit mobile number"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              aria-invalid={touched.whatsapp && errors.whatsapp ? "true" : "false"}
              aria-describedby={touched.whatsapp && errors.whatsapp ? "error-whatsapp" : undefined}
            />
          </Field>
          <Field
            label="Year of Study"
            required
            error={touched.year && errors.year}
            errorId="error-year"
          >
            <PillRadio
              id="input-year"
              options={YEAR_OPTIONS}
              value={form.year}
              onChange={v => handleChange('year', v)}
              aria-invalid={touched.year && errors.year ? "true" : "false"}
              aria-describedby={touched.year && errors.year ? "error-year" : undefined}
            />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
            <Field
              label="Branch / Department"
              required
              error={(touched.branch && errors.branch) || (touched.branchOther && errors.branchOther)}
              errorId="error-branch"
            >
              <div style={{ display: 'grid', gap: 8 }}>
                <StyledSelect
                  id="input-branch"
                  value={form.branch}
                  onChange={v => handleChange('branch', v)}
                  onBlur={() => handleBlur('branch')}
                  placeholder="Select your department"
                  aria-invalid={touched.branch && errors.branch ? "true" : "false"}
                  aria-describedby={touched.branch && errors.branch ? "error-branch" : undefined}
                >
                  {BRANCH_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                </StyledSelect>
                {form.branch === 'Other' && (
                  <Input
                    id="input-branchOther"
                    value={form.branchOther}
                    onChange={v => handleChange('branchOther', v.replace(/[^a-zA-Z0-9\s\/\-&().]/g, ''))}
                    onBlur={() => handleBlur('branchOther')}
                    placeholder="Please specify your department"
                    maxLength={60}
                    aria-invalid={touched.branchOther && errors.branchOther ? "true" : "false"}
                    aria-describedby={touched.branchOther && errors.branchOther ? "error-branch" : undefined}
                  />
                )}
              </div>
            </Field>
            <Field
              label="Section"
              required
              hint="Academic Section (A/B/C/...)"
              error={(touched.section && errors.section) || (touched.sectionOther && errors.sectionOther)}
              errorId="error-section"
            >
              <div style={{ display: 'grid', gap: 8 }}>
                <StyledSelect
                  id="input-section"
                  value={form.section}
                  onChange={v => handleChange('section', v)}
                  onBlur={() => handleBlur('section')}
                  placeholder="Select section"
                  aria-invalid={touched.section && errors.section ? "true" : "false"}
                  aria-describedby={touched.section && errors.section ? "error-section" : undefined}
                >
                  {SECTION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </StyledSelect>
                {form.section === 'Other' && (
                  <Input
                    id="input-sectionOther"
                    value={form.sectionOther}
                    onChange={v => handleChange('sectionOther', v.toUpperCase())}
                    onBlur={() => handleBlur('sectionOther')}
                    placeholder="Type your section (e.g. J)"
                    maxLength={10}
                    aria-invalid={touched.sectionOther && errors.sectionOther ? "true" : "false"}
                    aria-describedby={touched.sectionOther && errors.sectionOther ? "error-section" : undefined}
                  />
                )}
              </div>
            </Field>
          </div>
        </div>
      ),
    },
    {
      title: 'Role & Domain Preference',
      subtitle: 'Select the role you wish to apply for and your areas of interest.',
      icon: <IconArrowRight style={{ width: 18, height: 18 }} />,
      render: () => (
        <div style={{ display: 'grid', gap: 18 }}>
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--bdr)',
            borderRadius: 'var(--r3)',
            padding: 16,
            position: 'relative',
          }}>
            <div className="corner-tl"/><div className="corner-br"/>
            <div style={{ color: 'var(--t2)', fontSize: '.92rem', lineHeight: 1.7 }}>
              Before selecting a role, please review the full roles & responsibilities guide.
              <div style={{ marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowRoles(true)}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <DynamicIcon name="Search" size={14} /> View Roles & Responsibilities
                </button>
              </div>
            </div>
          </div>

          <Field
            label="Which role do you wish to apply for?"
            required
            error={touched.role && errors.role}
            errorId="error-role"
          >
            <PillRadio
              id="input-role"
              options={ROLE_OPTIONS}
              value={form.role}
              onChange={v => handleChange('role', v)}
              aria-invalid={touched.role && errors.role ? "true" : "false"}
              aria-describedby={touched.role && errors.role ? "error-role" : undefined}
            />
          </Field>

          <Field
            label="Areas of Interest"
            required
            hint="Select one or more."
            error={touched.interests && errors.interests}
            errorId="error-interests"
          >
            <MultiSelectChips
              id="input-interests"
              options={INTEREST_OPTIONS}
              values={form.interests}
              onToggle={(opt) => {
                const next = form.interests.includes(opt)
                  ? form.interests.filter(x => x !== opt)
                  : [...form.interests, opt];
                handleChange('interests', next);
              }}
              aria-invalid={touched.interests && errors.interests ? "true" : "false"}
              aria-describedby={touched.interests && errors.interests ? "error-interests" : undefined}
            />
          </Field>
        </div>
      ),
    },
    {
      title: 'Skills & Experience',
      subtitle: 'Share your technical background, communication skills, and prior experience.',
      icon: <IconBolt style={{ width: 18, height: 18 }} />,
      render: () => (
        <div style={{ display: 'grid', gap: 18 }}>
          <Field
            label="Programming language(s) / tools you know + level"
            required
            hint="Beginner / Intermediate / Advanced"
            error={touched.skills && errors.skills}
            errorId="error-skills"
          >
            <TextArea
              id="input-skills"
              value={form.skills}
              onChange={v => handleChange('skills', v)}
              onBlur={() => handleBlur('skills')}
              placeholder={'Example:\nPython – Intermediate\nJava – Beginner\nHTML – Advanced\nKotlin – Beginner'}
              rows={6}
              aria-invalid={touched.skills && errors.skills ? "true" : "false"}
              aria-describedby={touched.skills && errors.skills ? "error-skills" : undefined}
            />
          </Field>

          <Field
            label="Communication language(s) + fluency"
            required
            hint="English / Hindi / Both"
            error={touched.comms && errors.comms}
            errorId="error-comms"
          >
            <TextArea
              id="input-comms"
              value={form.comms}
              onChange={v => handleChange('comms', v)}
              onBlur={() => handleBlur('comms')}
              placeholder={'Example:\nEnglish – Basic\nHindi – Fluent\nBoth – Moderate'}
              rows={4}
              aria-invalid={touched.comms && errors.comms ? "true" : "false"}
              aria-describedby={touched.comms && errors.comms ? "error-comms" : undefined}
            />
          </Field>

          <Field
            label="Have you participated in any community, club, or event before? (On Campus)"
            required
            error={touched.campusExp && errors.campusExp}
            errorId="error-campusExp"
          >
            <PillRadio
              id="input-campusExp"
              options={['Yes', 'No']}
              value={form.campusExp}
              onChange={v => handleChange('campusExp', v)}
              aria-invalid={touched.campusExp && errors.campusExp ? "true" : "false"}
              aria-describedby={touched.campusExp && errors.campusExp ? "error-campusExp" : undefined}
            />
          </Field>

          {form.campusExp === 'Yes' ? (
            <Field
              label="If yes, mention the community / role"
              error={touched.campusExpDetails && errors.campusExpDetails}
              errorId="error-campusExpDetails"
            >
              <Input
                id="input-campusExpDetails"
                value={form.campusExpDetails}
                onChange={v => handleChange('campusExpDetails', v)}
                onBlur={() => handleBlur('campusExpDetails')}
                placeholder="e.g. Leo Club – Event Coordinator"
                maxLength={100}
                aria-invalid={touched.campusExpDetails && errors.campusExpDetails ? "true" : "false"}
                aria-describedby={touched.campusExpDetails && errors.campusExpDetails ? "error-campusExpDetails" : undefined}
              />
            </Field>
          ) : null}

          <Field
            label="GitHub Profile URL"
            hint="Optional"
            error={touched.links && errors.links}
            errorId="error-links"
          >
            <Input
              id="input-links"
              value={form.links}
              onChange={v => handleChange('links', v.replace(/\s/g, ''))}
              onBlur={() => handleBlur('links')}
              placeholder="https://github.com/YourUsername"
              type="url"
              inputMode="url"
              maxLength={120}
              aria-invalid={touched.links && errors.links ? "true" : "false"}
              aria-describedby={touched.links && errors.links ? "error-links" : undefined}
            />
            <div style={{ color: 'var(--t3)', fontSize: '.8rem', marginTop: 4 }}>
              Format: <span style={{ fontFamily: 'Space Mono,monospace', color: 'var(--c1)' }}>https://github.com/YourUsername</span>
            </div>
          </Field>
        </div>
      ),
    },
    {
      title: 'Commitment & Availability',
      subtitle: 'Confirm your availability and willingness to commit to NexaSphere responsibilities.',
      icon: <IconBolt style={{ width: 18, height: 18 }} />,
      render: () => (
        <div style={{ display: 'grid', gap: 18 }}>
          <Field
            label="Are you willing to commit 4–6 hours per week consistently?"
            required
            error={touched.commitHours && errors.commitHours}
            errorId="error-commitHours"
          >
            <PillRadio
              id="input-commitHours"
              options={COMMIT_OPTIONS}
              value={form.commitHours}
              onChange={v => handleChange('commitHours', v)}
              aria-invalid={touched.commitHours && errors.commitHours ? "true" : "false"}
              aria-describedby={touched.commitHours && errors.commitHours ? "error-commitHours" : undefined}
            />
          </Field>
          <Field
            label="Are you comfortable attending meetings, events, and sessions on campus?"
            required
            error={touched.attendCampus && errors.attendCampus}
            errorId="error-attendCampus"
          >
            <PillRadio
              id="input-attendCampus"
              options={COMMIT_OPTIONS}
              value={form.attendCampus}
              onChange={v => handleChange('attendCampus', v)}
              aria-invalid={touched.attendCampus && errors.attendCampus ? "true" : "false"}
              aria-describedby={touched.attendCampus && errors.attendCampus ? "error-attendCampus" : undefined}
            />
          </Field>
          <Field
            label="Do you understand that short assessment may be conducted?"
            required
            error={touched.assessmentOk && errors.assessmentOk}
            errorId="error-assessmentOk"
          >
            <PillRadio
              id="input-assessmentOk"
              options={COMMIT_OPTIONS}
              value={form.assessmentOk}
              onChange={v => handleChange('assessmentOk', v)}
              aria-invalid={touched.assessmentOk && errors.assessmentOk ? "true" : "false"}
              aria-describedby={touched.assessmentOk && errors.assessmentOk ? "error-assessmentOk" : undefined}
            />
          </Field>
        </div>
      ),
    },
    {
      title: 'Motivation & Statement',
      subtitle: 'Tell us why you want to join and what you bring to the team.',
      icon: <IconSpark style={{ width: 18, height: 18 }} />,
      render: () => (
        <div style={{ display: 'grid', gap: 18 }}>
          <Field
            label="Why do you want to be part of NexaSphere Core Team?"
            required
            error={touched.whyJoin && errors.whyJoin}
            errorId="error-whyJoin"
          >
            <TextArea
              id="input-whyJoin"
              value={form.whyJoin}
              onChange={v => handleChange('whyJoin', v)}
              onBlur={() => handleBlur('whyJoin')}
              placeholder="Share your motivation, what you'll bring, and what you want to learn."
              rows={6}
              aria-invalid={touched.whyJoin && errors.whyJoin ? "true" : "false"}
              aria-describedby={touched.whyJoin && errors.whyJoin ? "error-whyJoin" : undefined}
            />
          </Field>
          <Field label="Anything else you want us to know?">
            <TextArea
              id="input-anythingElse"
              value={form.anythingElse}
              onChange={v => handleChange('anythingElse', v)}
              placeholder="Optional"
              rows={4}
            />
          </Field>
        </div>
      ),
    },
    {
      title: 'Declaration & Consent',
      subtitle: 'Please read and confirm the following declarations before submitting.',
      icon: <IconShieldCheck style={{ width: 18, height: 18 }} />,
      render: () => (
        <div style={{ display: 'grid', gap: 18 }}>
          <Field
            label="Declaration"
            required
            error={touched.declarations && errors.declarations}
            errorId="error-declarations"
          >
            <div style={{ display: 'grid', gap: 10 }}>
              {[
                { k: 'truth', label: 'I confirm that all details provided are true.' },
                { k: 'time', label: 'I understand the time commitment (4–6 hours/week).' },
                { k: 'participate', label: 'I agree to participate in test sessions and team activities.' },
                { k: 'disagree', label: 'I do not agree to the above declaration.' },
              ].map(opt => {
                const active = !!form.declarations?.[opt.k];
                const isDisagree = opt.k === 'disagree';
                return (
                  <button
                    key={opt.k}
                    id={`input-declaration-${opt.k}`}
                    type="button"
                    onClick={() => {
                      const next = { ...(form.declarations || {}) };
                      const nextVal = !next[opt.k];
                      let nextDeclarations;
                      if (isDisagree && nextVal) {
                        nextDeclarations = { truth: false, time: false, participate: false, disagree: true };
                      } else {
                        if (!isDisagree && nextVal) {
                          next.disagree = false;
                        }
                        next[opt.k] = nextVal;
                        nextDeclarations = {
                          truth: !!next.truth,
                          time: !!next.time,
                          participate: !!next.participate,
                          disagree: !!next.disagree
                        };
                      }
                      handleChange('declarations', nextDeclarations);
                    }}
                    style={{
                      textAlign: 'left',
                      background: active ? 'rgba(0,212,255,.10)' : 'var(--card)',
                      border: `1px solid ${active ? 'var(--c1b)' : 'var(--bdr)'}`,
                      color: 'var(--t1)',
                      borderRadius: 'var(--r2)',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      transition: 'transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .25s ease',
                      boxShadow: active ? '0 0 16px var(--c1g)' : 'none',
                    }}
                    className="shimmer"
                    aria-invalid={touched.declarations && errors.declarations ? "true" : "false"}
                    aria-describedby={touched.declarations && errors.declarations ? "error-declarations" : undefined}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: 5,
                        border: `2px solid ${active ? 'var(--c1)' : 'var(--bdr2)'}`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: active ? 'var(--c1)' : 'transparent',
                        fontSize: '.8rem',
                      }}>
                        <DynamicIcon name="CheckCircle" size={12} />
                      </span>
                      <span style={{ fontSize: '.98rem', fontWeight: 600 }}>{opt.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Field>
        </div>
      ),
    },
  ]), [form, touched, errors]);

  const progress = useMemo(() => (step / (steps.length - 1)), [step, steps.length]);

  const current = steps[step];

  const missingRequired = useMemo(() => {
    const missing = [];
    const fields = stepFields[step] || [];
    for (const f of fields) {
      const v = form[f];
      if (f === 'declarations') {
        const d = v || {};
        if (!d.truth || !d.time || !d.participate || d.disagree) missing.push(f);
      } else if (f === 'interests') {
        if (!v || v.length === 0) missing.push(f);
      } else if (f === 'branchOther') {
        if (form.branch === 'Other' && !String(v || '').trim()) missing.push(f);
      } else if (f === 'sectionOther') {
        if (form.section === 'Other' && !String(v || '').trim()) missing.push(f);
      } else if (f === 'collegeEmail') {
        const email = String(v || '').trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !email.endsWith('@glbajajgroup.org')) {
          missing.push(f);
        }
      } else if (f === 'whatsapp') {
        const phone = String(v || '').trim();
        if (!phone || !/^\d{10}$/.test(phone)) missing.push(f);
      } else if (f === 'links') {
        const url = String(v || '').trim();
        if (url && !/^https:\/\/github\.com\/[a-zA-Z0-9][a-zA-Z0-9\-]{0,37}\/?$/.test(url)) {
          missing.push(f);
        }
      } else {
        if (!String(v || '').trim()) missing.push(f);
      }
    }
    return missing;
  }, [form, step]);

  const canNext = missingRequired.length === 0;

  function scrollTop() {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function submit() {
    setErr('');
    setBusy(true);
    try {
      const payload = {
        ...form,
        
        branch: form.branch === 'Other' ? (form.branchOther || 'Other') : form.branch,
        section: form.section === 'Other' ? (form.sectionOther || 'Other') : form.section,
        interests: Array.isArray(form.interests) ? form.interests.join(', ') : '',
        declarationAccepted: !!form.declarations?.truth && !!form.declarations?.time && !!form.declarations?.participate && !form.declarations?.disagree,
        declarationSelected: Object.entries(form.declarations || {}).filter(([,v])=>!!v).map(([k])=>k).join(', '),
        submittedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };

      
      const emailKey = String(form.collegeEmail || '').trim().toLowerCase();
      try {
        const existing = JSON.parse(localStorage.getItem('ns_submitted_emails') || '[]');
        if (existing.includes(emailKey)) {
          setErr('This email address has already been used to submit an application. Each applicant may submit only once.');
          setBusy(false);
          return;
        }
      } catch { /* ignore */ }

      const res = await fetch(RECRUITMENT_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || (data && data.ok === false)) {
        throw new Error(data?.error || 'Submission failed');
      }
      try {
        const existing = JSON.parse(localStorage.getItem('ns_submitted_emails') || '[]');
        existing.push(emailKey);
        localStorage.setItem('ns_submitted_emails', JSON.stringify(existing));
      } catch { /* ignore */ }
      setDone(true);
      scrollTop();
    } catch (e) {
      setErr(e?.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('fired'); obs.unobserve(e.target); }
      });
    }, { threshold: .1, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('#pg-apply .pop-flip, #pg-apply .pop-in, #pg-apply .pop-word, #pg-apply .pop-scale')
      .forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [step]);

  return (
    <div id="pg-apply" ref={topRef}>
      {showRoles && <RolesGuideModal onClose={() => setShowRoles(false)} />}
      <style>{`
        .apply-hero {
          text-align:center;
          padding: 64px 24px 46px;
          position: relative;
        }
        .apply-hero-bg {
          position:absolute; inset:0; pointer-events:none;
          background:
            radial-gradient(ellipse 60% 55% at 50% 0%, rgba(0,212,255,.10) 0%, transparent 62%),
            radial-gradient(ellipse 40% 40% at 20% 85%, rgba(123,111,255,.06) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 80% 70%, rgba(189,92,255,.05) 0%, transparent 55%);
        }
        [data-theme="light"] .apply-hero-bg {
          background:
            radial-gradient(ellipse 60% 55% at 50% 0%, rgba(194,119,10,.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 20% 85%, rgba(109,40,217,.04) 0%, transparent 55%);
        }
        .apply-divider {
          width:100%; height:1px;
          background: linear-gradient(90deg, transparent, var(--c1) 18%, var(--c2) 50%, var(--c3) 82%, transparent);
          opacity:.18; margin: 0 auto;
        }
        .apply-shell {
          max-width: 980px;
          margin: 0 auto;
          background: var(--card);
          border: 1px solid var(--bdr);
          border-radius: var(--r4);
          overflow: hidden;
          position: relative;
          box-shadow: var(--shcard);
        }
        [data-theme="light"] .apply-shell {
          background: #fff;
          border-color: rgba(28,25,23,.1);
          box-shadow: 0 8px 44px rgba(0,0,0,.10);
        }
        .apply-topbar {
          padding: 18px 18px 14px;
          border-bottom: 1px solid var(--bdr);
          background: linear-gradient(180deg, rgba(0,212,255,.03), transparent);
        }
        [data-theme="light"] .apply-topbar { background: linear-gradient(180deg, rgba(194,119,10,.03), transparent); }
        .apply-progress {
          height: 8px;
          background: rgba(255,255,255,.04);
          border: 1px solid var(--bdr);
          border-radius: 999px;
          overflow: hidden;
        }
        [data-theme="light"] .apply-progress { background: rgba(28,25,23,.04); }
        .apply-progress > div {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, var(--c1), var(--c2), var(--c3));
          box-shadow: 0 0 18px var(--c1g);
          transition: width .35s cubic-bezier(.22,1,.36,1);
        }
        .apply-body { padding: 22px 18px 18px; }
        @media (min-width: 720px) {
          .apply-body { padding: 26px 26px 22px; }
          .apply-topbar { padding: 18px 26px 14px; }
        }
      `}</style>

      <div className="apply-hero">
        <div className="apply-hero-bg"/>
        {onBack ? (
          <button
            onClick={onBack}
            className="btn btn-outline btn-sm"
            style={{ position: 'absolute', top: 24, left: 24 }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <IconArrowLeft style={{ width: 14, height: 14 }} /> Back
            </span>
          </button>
        ) : null}
        <div className="pop-in" style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, var(--c1), var(--c2))',
          borderRadius: 999,
          padding: '7px 22px',
          fontFamily: 'Orbitron,monospace',
          fontSize: '.85rem',
          fontWeight: 700,
          letterSpacing: '.1em',
          color: '#fff',
          textTransform: 'uppercase',
          boxShadow: '0 0 24px var(--c1g)',
          marginBottom: 16,
        }}>Core Team Recruitment</div>
        <h1 className="section-title pop-word" style={{ marginBottom: 14 }}>
          NexaSphere Application Form
        </h1>
        <p className="pop-in" style={{
          color: 'var(--t2)',
          fontSize: 'clamp(.9rem,2vw,1.08rem)',
          maxWidth: 720,
          margin: '0 auto',
          lineHeight: 1.75,
          animationDelay: '.12s',
        }}>
          A 7-step application process. Complete all sections carefully — shortlisted candidates will be contacted for the next steps.
        </p>
        <div className="apply-divider" style={{ marginTop: 34, maxWidth: 780 }}/>
      </div>

      <div className="container" style={{ paddingBottom: 86 }}>
        <div className="apply-shell pop-scale">
          <div className="corner-tl"/><div className="corner-br"/>

          <div className="apply-topbar">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 14,
              flexWrap: 'wrap',
              marginBottom: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: 'linear-gradient(135deg,var(--c1a),var(--c2a))',
                  border: '1px solid var(--bdr2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(0,212,255,.08)',
                  fontSize: '1.25rem',
                }}>
                  {done ? <IconShieldCheck style={{ width: 18, height: 18 }} /> : current.icon}
                </div>
                <div>
                  <div style={{
                    fontFamily: 'Orbitron,monospace',
                    fontSize: '.9rem',
                    letterSpacing: '.08em',
                    color: 'var(--t1)',
                    display: 'flex',
                    gap: 10,
                    alignItems: 'baseline',
                    flexWrap: 'wrap',
                  }}>
                    <span>{done ? 'Submission Complete' : current.title}</span>
                    {!done ? (
                      <span style={{
                        fontFamily: 'Space Mono,monospace',
                        fontSize: '.62rem',
                        letterSpacing: '.18em',
                        color: 'var(--t3)',
                      }}>
                        STEP {step + 1}/{steps.length}
                      </span>
                    ) : null}
                  </div>
                  <div style={{ color: 'var(--t2)', fontSize: '.9rem' }}>
                    {done ? 'Thank you for applying to NexaSphere — GL Bajaj Group of Institutions' : current.subtitle}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gap: 4,
                justifyItems: 'end',
              }}>
                <div style={{
                  fontFamily: 'Space Mono,monospace',
                  fontSize: '.62rem',
                  letterSpacing: '.14em',
                  color: 'var(--t3)',
                  textTransform: 'uppercase',
                }}>
                  {done ? 'Application Submitted' : `Step ${step + 1} of ${steps.length}`}
                </div>
                {!done && form.role && (
                  <div style={{
                    fontFamily: 'Rajdhani,sans-serif',
                    fontSize: '.82rem',
                    color: 'var(--c1)',
                    fontWeight: 600,
                  }}>
                    Applying for: {form.role}
                  </div>
                )}
              </div>
            </div>

            <div className="apply-progress">
              <div style={{ width: `${Math.round(progress * 100)}%` }}/>
            </div>
          </div>

          <div className="apply-body">
            {alreadySubmitted && !done ? (
              <div style={{
                background: 'rgba(255,45,120,.08)',
                border: '1px solid rgba(255,45,120,.22)',
                borderRadius: 'var(--r3)',
                padding: '20px 22px',
                textAlign: 'center',
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', color: '#ff2d78', marginBottom: 10 }}><DynamicIcon name="AlertTriangle" size={22} /></div>
                <div style={{ color: 'var(--t1)', fontWeight: 700, fontSize: '1rem', marginBottom: 12 }}>Application Already Submitted</div>
                <div style={{ color: 'var(--t2)', fontSize: '.88rem', lineHeight: 1.65, marginBottom: 24 }}>
                  An application form has already been submitted from this device.<br/>
                  If you need to update your application, please contact us at{' '}
                  <a href="mailto:nexasphere@glbajajgroup.org" style={{ color: 'var(--c1)', fontWeight: 600 }}>
                    nexasphere@glbajajgroup.org
                  </a>
                </div>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <a
                    href={WHATSAPP_SCREENING}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                    style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      Core Team Screening <IconArrowRight />
                    </span>
                  </a>
                  <a
                    href={LINKEDIN_PAGE || 'https://www.linkedin.com/showcase/glbajaj-nexasphere/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}
                  >
                    NexaSphere LinkedIn
                  </a>
                </div>
              </div>
            ) : done ? (
              <div style={{ display: 'grid', gap: 18 }}>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(0,212,255,.08), rgba(123,111,255,.06))',
                  border: '1px solid var(--bdr2)',
                  borderRadius: 'var(--r3)',
                  padding: 22,
                  position: 'relative',
                  overflow: 'hidden',
                  textAlign: 'center',
                }}>
                  <div className="corner-tl"/><div className="corner-br"/>
                  <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--c1)', marginBottom: 12 }}><DynamicIcon name="CheckCircle" size={32} /></div>
                  <div style={{ fontFamily: 'Orbitron,monospace', fontSize: '1rem', color: 'var(--t1)', fontWeight: 700, marginBottom: 12 }}>
                    Application Submitted Successfully
                  </div>
                  <p style={{ color: 'var(--t2)', lineHeight: 1.8, maxWidth: 520, margin: '0 auto' }}>
                    Thank you for applying to the NexaSphere Core Team - GL Bajaj Group of Institutions.
                    <br/><br/>
                    Your application has been recorded. Shortlisted candidates will be contacted regarding the next steps, which may include a short assessment or trial session.
                    <br/><br/>
                    <b style={{ color: 'var(--t1)' }}>Stay consistent. Stay curious. Keep building.</b>
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <a className="btn btn-whatsapp" href={WHATSAPP_SCREENING} target="_blank" rel="noopener noreferrer">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      Core Team Screening Room <IconArrowRight />
                    </span>
                  </a>
                  <a className="btn btn-join" href={WHATSAPP_COMMUNITY} target="_blank" rel="noopener noreferrer">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      Join NexaSphere Community <IconArrowRight />
                    </span>
                  </a>
                </div>
              </div>
            ) : (
              <>
                {current.render()}

                {err ? (
                  <div style={{
                    marginTop: 18,
                    background: 'rgba(255,45,120,.10)',
                    border: '1px solid rgba(255,45,120,.22)',
                    color: 'var(--t1)',
                    borderRadius: 'var(--r2)',
                    padding: '12px 14px',
                    fontWeight: 600,
                  }}>
                    {err}
                  </div>
                ) : null}

                <div style={{
                  marginTop: 22,
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 10,
                  flexWrap: 'wrap',
                }}>
                  <button
                    className="btn btn-outline"
                    type="button"
                    onClick={() => {
                      setErr('');
                      if (step === 0) {
                        
                        if (onBack) onBack();
                      } else {
                        setStep(s => clamp(s - 1, 0, steps.length - 1));
                        scrollTop();
                      }
                    }}
                    disabled={busy}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <IconArrowLeft /> Back
                    </span>
                  </button>

                  {step < steps.length - 1 ? (
                    <button
                      className="btn btn-primary btn-ripple"
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        const fields = stepFields[step] || [];
                        const ok = validateForm(fields);
                        if (!ok) {
                          setErr('Please complete the required fields (*) correctly to proceed.');
                          
                          const errorsList = (stepFields[step] || []).filter(f => {
                            if (f === 'branchOther') return form.branch === 'Other';
                            if (f === 'sectionOther') return form.section === 'Other';
                            return true;
                          });
                          
                          for (const f of errorsList) {
                            if (f === 'declarations') continue;
                            const el = document.getElementById(`input-${f}`);
                            if (el) {
                              el.focus();
                              break;
                            }
                          }
                          return;
                        }
                        setErr('');
                        setStep(s => clamp(s + 1, 0, steps.length - 1));
                        scrollTop();
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        Continue <IconArrowRight />
                      </span>
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-ripple"
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        const fields = stepFields[step] || [];
                        const ok = validateForm(fields);
                        if (!ok) {
                          if (form.declarations?.disagree) {
                            setErr('You must agree to the declarations to apply. Disagreeing prevents application submission.');
                          } else {
                            setErr('Please complete the required fields (*) to submit.');
                          }
                          
                          for (const f of fields) {
                            if (f === 'declarations') {
                              const el = document.getElementById('input-declaration-truth');
                              if (el) {
                                el.focus();
                                break;
                              }
                            } else {
                              const el = document.getElementById(`input-${f}`);
                              if (el) {
                                el.focus();
                                break;
                              }
                            }
                          }
                          return;
                        }
                        submit();
                      }}
                    >
                      {busy ? 'Submitting...' : 'Submit Application'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="pop-in" style={{
          marginTop: 18,
          textAlign: 'center',
          color: 'var(--t3)',
          fontFamily: 'Space Mono,monospace',
          fontSize: '.62rem',
          letterSpacing: '.18em',
          textTransform: 'uppercase',
          opacity: .9,
        }}>
          Powered by NexaSphere
        </div>
      </div>

      <Footer />
    </div>
  );
}


