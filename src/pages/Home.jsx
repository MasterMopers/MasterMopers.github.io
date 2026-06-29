import { useState, useEffect, useRef } from 'react';
import { useContent } from '../content/ContentContext.jsx';

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <circle cx="7.5" cy="7.5" r="2.5"/>
      <line x1="7.5" y1="1" x2="7.5" y2="3"/>
      <line x1="7.5" y1="12" x2="7.5" y2="14"/>
      <line x1="1" y1="7.5" x2="3" y2="7.5"/>
      <line x1="12" y1="7.5" x2="14" y2="7.5"/>
      <line x1="3.2" y1="3.2" x2="4.6" y2="4.6"/>
      <line x1="10.4" y1="10.4" x2="11.8" y2="11.8"/>
      <line x1="11.8" y1="3.2" x2="10.4" y2="4.6"/>
      <line x1="4.6" y1="10.4" x2="3.2" y2="11.8"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 10A6 6 0 0 1 5 2a6 6 0 1 0 8 8z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}

const SOCIAL_ICONS = { linkedin: LinkedInIcon, github: GitHubIcon };

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') ?? 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  return [theme, setTheme];
}

function Modal({ entry, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const isExp = entry._type === 'experience';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <p className="modal-tag">// {isExp ? 'experience' : 'project'}</p>

        {isExp ? (
          <>
            <h2 className="modal-title">{entry.org}</h2>
            {entry.role  && <p className="modal-subtitle">{entry.role}</p>}
            {entry.dates && <p className="modal-dates">{entry.dates}</p>}
            {entry.description && <p className="modal-body">{entry.description}</p>}
            {entry.detail      && <p className="modal-body">{entry.detail}</p>}
          </>
        ) : (
          <>
            <h2 className="modal-title">{entry.title}</h2>
            {entry.affiliation && <p className="modal-subtitle">{entry.affiliation}</p>}
            {entry.description && <p className="modal-body">{entry.description}</p>}
            {entry.detail && <p className="modal-body">{entry.detail}</p>}
            {entry.links?.length > 0 && (
              <div className="modal-links">
                {entry.links.map(link => (
                  <a key={link.key} href={link.url}>{link.label ?? link.key}</a>
                ))}
              </div>
            )}
          </>
        )}

        {entry.photos?.length > 1 && (
          <div className="modal-photos">
            {entry.photos.slice(1).map((photo, i) => (
              <img key={i} src={photo.src} alt={photo.alt ?? ''} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function parseDateForSort(dateStr) {
  if (!dateStr) return 0;
  const years = dateStr.match(/\d{4}/g);
  if (!years) return 0;
  const year = Math.max(...years.map(Number));
  const lower = dateStr.toLowerCase();
  const season = lower.includes('summer') ? 3 : lower.includes('spring') ? 2 : lower.includes('fall') || lower.includes('autumn') ? 1 : 0;
  return year * 10 + season;
}

function sortByDate(arr) {
  return [...arr].sort((a, b) => parseDateForSort(b.dates) - parseDateForSort(a.dates));
}

function ExperienceEntry({ entry, tag, highlight, onClick }) {
  const photo = entry.photos?.[0];
  return (
    <li
      className={`entry-row${highlight ? ' entry-highlight' : ''}`}
      data-date={entry.dates ?? undefined}
      onClick={onClick}
    >
      {photo && (
        <div className="entry-thumb-wrap">
          <img className="entry-thumb" src={photo.src} alt={photo.alt ?? ''} />
        </div>
      )}
      <div className="entry-body">
        <div className="entry-head">
          <span className="org">{entry.org}</span>
        </div>
        {entry.role && <p className="entry-role">{entry.role}</p>}
        {entry.one_liner && <p className="desc">{entry.one_liner}</p>}
        {tag && <span className="entry-tag">{tag}</span>}
      </div>
    </li>
  );
}

const FILTERS = ['highlights', 'experiences', 'projects', 'education', 'hackathons', 'more about me'];
const BEYOND_STEM_FILTERS = new Set(['experiences', 'projects']);

export default function Home() {
  const { status, data, error } = useContent();
  const [theme, setTheme] = useTheme();
  const [revealed, setRevealed] = useState(false);
  const [filter, setFilter] = useState('highlights');
  const [beyondStem, setBeyondStem] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const revealRef = useRef(null);

  if (status === 'loading') return <div className="home"><main>Loading…</main></div>;
  if (status === 'error') {
    return (
      <div className="home">
        <main><p>Failed to load content: {error?.message}</p></main>
      </div>
    );
  }

  const { about, about_me, experience, projects, education, hackathons } = data;

  const highlights = sortByDate([
    ...(experience || []).filter(e => e.highlight).map(e => ({ ...e, _type: 'experience' })),
    ...(projects  || []).filter(p => p.highlight).map(p => ({ ...p, _type: 'project'    })),
  ]);

  function filterBeyondStem(arr) {
    return beyondStem ? arr : arr.filter(e => !e.beyond_stem);
  }

  function handleExplore() {
    setRevealed(true);
    setTimeout(() => {
      revealRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  }

  return (
    <div className="home">
      <button
        className="theme-toggle"
        onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle light/dark mode"
      >
        <span key={theme} className="toggle-icon">
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </span>
      </button>

      <main>
        <header className="line">
          <h1>{about.name}</h1>
          {about.links?.length > 0 && (
            <div className="contact-line">
              {about.links.filter(l => !SOCIAL_ICONS[l.key]).map((link, i) => (
                <span key={link.key}>
                  {i > 0 && <span className="sep">·</span>}
                  {link.url
                    ? <a href={link.url}>{link.label ?? link.url}</a>
                    : <span>{link.label}</span>
                  }
                </span>
              ))}
              <span className="social-icons">
                {about.links.filter(l => SOCIAL_ICONS[l.key]).map(link => {
                  const Icon = SOCIAL_ICONS[link.key];
                  return (
                    <a key={link.key} href={link.url} target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label={link.label}>
                      <Icon />
                    </a>
                  );
                })}
              </span>
            </div>
          )}
        </header>

        {about.bio && (
          <div className="bio-wrapper line">
            <p className="bio-text" dangerouslySetInnerHTML={{ __html: about.bio }} />
            {about.photo && (
              <div className="bio-photo-wrap">
                <img src={about.photo} alt="Felipe" />
              </div>
            )}
          </div>
        )}

        {!revealed && (
          <div className="explore-btn-wrap line">
            <button className="explore-btn" onClick={handleExplore} aria-label="Explore more">
              <span>Explore More</span>
              <span className="explore-arrow">↓</span>
            </button>
          </div>
        )}
      </main>

      {revealed && (
        <section ref={revealRef} className="explore-section">
          <div className="explore-inner">
            <div className="filter-tabs">
              {FILTERS.map(f => (
                <button
                  key={f}
                  className={`filter-btn${filter === f ? ' active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            {BEYOND_STEM_FILTERS.has(filter) && (
              <div className="beyond-stem-row">
                <label className="beyond-stem-toggle" aria-label="Show Beyond STEM entries">
                  <span className={`toggle-track${beyondStem ? ' active' : ''}`} onClick={() => setBeyondStem(s => !s)}>
                    <span className="toggle-thumb" />
                  </span>
                  <span className="beyond-stem-label">Beyond STEM</span>
                </label>
              </div>
            )}

            {filter === 'highlights' && (
              <ul className="explore-list">
                {highlights.length === 0
                  ? <li className="empty">No highlights set — add <code>highlight: true</code> to entries in content.json.</li>
                  : highlights.map((item, i) =>
                      <ExperienceEntry
                        key={i}
                        entry={item._type === 'project' ? { ...item, org: item.title, role: item.affiliation } : item}
                        tag={item._type}
                        highlight
                        onClick={() => setSelectedEntry(item)}
                      />
                    )
                }
              </ul>
            )}

            {filter === 'experiences' && (
              <ul className="explore-list timeline-list">
                {sortByDate(filterBeyondStem(experience || [])).map((entry, i) => (
                  <ExperienceEntry
                    key={i}
                    entry={entry}
                    tag={entry.beyond_stem ? 'beyond stem experience' : 'experience'}
                    onClick={() => setSelectedEntry({ ...entry, _type: 'experience' })}
                  />
                ))}
              </ul>
            )}

            {filter === 'projects' && (
              <ul className="explore-list timeline-list">
                {sortByDate(filterBeyondStem(projects || [])).map((p, i) => (
                  <ExperienceEntry
                    key={p.title + i}
                    entry={{ ...p, org: p.title, role: p.affiliation }}
                    tag={p.beyond_stem ? 'beyond stem project' : 'project'}
                    onClick={() => setSelectedEntry({ ...p, _type: 'project' })}
                  />
                ))}
              </ul>
            )}

            {filter === 'education' && (
              <ul className="explore-list timeline-list">
                {sortByDate(education || []).map((edu, i) => (
                  <ExperienceEntry
                    key={edu.school + i}
                    entry={{ ...edu, org: edu.school, role: edu.credential }}
                    tag="education"
                    onClick={() => setSelectedEntry({ ...edu, org: edu.school, role: edu.credential, _type: 'experience' })}
                  />
                ))}
              </ul>
            )}

            {filter === 'hackathons' && (
              <ul className="explore-list timeline-list">
                {sortByDate(hackathons || []).map((h, i) => (
                  <ExperienceEntry
                    key={h.name + i}
                    entry={{ ...h, org: h.name, role: h.project }}
                    tag="hackathon"
                    onClick={() => setSelectedEntry({ ...h, org: h.name, role: h.project, _type: 'experience' })}
                  />
                ))}
              </ul>
            )}

            {filter === 'more about me' && (
              <div className="about-me-block">
                <p>{about_me}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {selectedEntry && (
        <Modal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
      )}
    </div>
  );
}
