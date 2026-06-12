export default function ProjectListItem({ project }) {
  return (
    <li className="project-item">
      <div className="meta-row">
        <p className="title">{project.title}</p>
        {project.description && <p className="desc">{project.description}</p>}
      </div>

      {project.tech?.length > 0 && (
        <ul className="tech-list">
          {project.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}

      {project.detail && <p className="detail">{project.detail}</p>}

      {project.links?.length > 0 && (
        <p className="project-links">
          {project.links.map((link, i) => (
            <span key={link.key + link.url}>
              {i > 0 && <span className="sep">·</span>}
              <a href={link.url}>{link.label ?? link.key}</a>
            </span>
          ))}
        </p>
      )}
    </li>
  );
}
