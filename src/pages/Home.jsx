import { useContent } from '../content/ContentContext.jsx';
import ProjectListItem from '../components/ProjectListItem.jsx';

export default function Home() {
  const { status, data, error } = useContent();

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
      <main>
        <header className="line">
          <h1>{about.name}</h1>
          {about.identity && <p className="role">{about.identity}</p>}
        </header>

        {about.bio && (
          <p className="bio line" dangerouslySetInnerHTML={{ __html: about.bio }} />
        )}

        {about.links?.length > 0 && (
          <section className="line">
            <p className="label">// links</p>
            <ul className="links">
              {about.links.map((link) => (
                <li key={link.key}>
                  <span className="key">{link.key}</span>
                  <a href={link.url}>{link.label ?? link.url}</a>
                </li>
              ))}
            </ul>
          </section>
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
