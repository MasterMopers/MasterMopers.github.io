import { useState, useEffect } from 'react';
import { useContent } from '../content/ContentContext.jsx';
import ProjectListItem from '../components/ProjectListItem.jsx';

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') ?? 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, setTheme];
}

export default function Home() {
  const { status, data, error } = useContent();
  const [theme, setTheme] = useTheme();

  if (status === 'loading') return <div className="home"><main>Loading…</main></div>;
  if (status === 'error') {
    return (
      <div className="home">
        <main>
          <p>Failed to load content: {error?.message}</p>
        </main>
      </div>
    );
  }

  const { about, experience, projects } = data;

  return (
    <div className="home">
      <button
        className="theme-toggle"
        onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle light/dark mode"
      >
        <span className="toggle-track">
          <span className="toggle-thumb" />
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
                  {link.url ? (
                    <a href={link.url}>{link.label ?? link.url}</a>
                  ) : (
                    <span>{link.label}</span>
                  )}
                </span>
              ))}
            </p>
          )}
        </header>

        {about.bio && (
          <p className="bio line" dangerouslySetInnerHTML={{ __html: about.bio }} />
        )}

        {experience?.length > 0 && (
          <section className="line">
            <p className="label">// experience</p>
            <ul className="experience">
              {experience.map((entry, i) => (
                <li key={i}>
                  <div className="entry-head">
                    <span className="org">{entry.org}</span>
                    {entry.dates && <span className="dates">{entry.dates}</span>}
                  </div>
                  {entry.role && <p className="entry-role">{entry.role}</p>}
                  {entry.description && <p className="desc">{entry.description}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {projects?.length > 0 && (
          <section className="line">
            <p className="label">// projects</p>
            <ul className="work">
              {projects.map((p, i) => (
                <ProjectListItem key={p.title + i} project={p} />
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
