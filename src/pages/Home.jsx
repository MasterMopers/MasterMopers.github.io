import { useState, useEffect, useRef } from 'react';
import { useContent } from '../content/ContentContext.jsx';
import ProjectListItem from '../components/ProjectListItem.jsx';

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
            {entry.description && <p className="modal-subtitle">{entry.description}</p>}
            {entry.tech?.length > 0 && (
              <ul className="modal-tech">
                {entry.tech.map(t => <li key={t}>{t}</li>)}
              </ul>
            )}
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

        {entry.photos?.length > 0 && (
          <div className="modal-photos">
            {entry.photos.map((photo, i) => (
              <img key={i} src={photo.src} alt={photo.alt ?? ''} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExperienceEntry({ entry, onClick }) {
  return (
    <li onClick={onClick}>
      <div className="entry-head">
        <span className="org">{entry.org}</span>
        {entry.dates && <span className="dates">{entry.dates}</span>}
      </div>
      {entry.role && <p className="entry-role">{entry.role}</p>}
      {entry.description && <p className="desc">{entry.description}</p>}
    </li>
  );
}

export default function Home() {
  const { status, data, error } = useContent();
  const [theme, setTheme] = useTheme();
  const [revealed, setRevealed] = useState(false);
  const [filter, setFilter] = useState('highlights');
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

  const { about, experience, projects } = data;

  const highlights = [
    ...(experience || []).filter(e => e.highlight).map(e => ({ ...e, _type: 'experience' })),
    ...(projects  || []).filter(p => p.highlight).map(p => ({ ...p, _type: 'project'    })),
  ];

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
            <p className="contact-line">
              {about.links.map((link, i) => (
                <span key={link.key}>
                  {i > 0 && <span className="sep">·</span>}
                  {link.url
                    ? <a href={link.url}>{link.label ?? link.url}</a>
                    : <span>{link.label}</span>
                  }
                </span>
              ))}
            </p>
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
              {['highlights', 'experiences', 'projects'].map(f => (
                <button
                  key={f}
                  className={`filter-btn${filter === f ? ' active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            {filter === 'highlights' && (
              <ul className="explore-list">
                {highlights.length === 0
                  ? <li className="empty">No highlights set — add <code>highlight: true</code> to entries in content.json.</li>
                  : highlights.map((item, i) =>
                      item._type === 'experience'
                        ? <ExperienceEntry key={i} entry={item} onClick={() => setSelectedEntry(item)} />
                        : <ProjectListItem key={i} project={item} onClick={() => setSelectedEntry(item)} />
                    )
                }
              </ul>
            )}

            {filter === 'experiences' && (
              <ul className="explore-list">
                {(experience || []).map((entry, i) => (
                  <ExperienceEntry
                    key={i}
                    entry={entry}
                    onClick={() => setSelectedEntry({ ...entry, _type: 'experience' })}
                  />
                ))}
              </ul>
            )}

            {filter === 'projects' && (
              <ul className="explore-list">
                {(projects || []).map((p, i) => (
                  <ProjectListItem
                    key={p.title + i}
                    project={p}
                    onClick={() => setSelectedEntry({ ...p, _type: 'project' })}
                  />
                ))}
              </ul>
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
