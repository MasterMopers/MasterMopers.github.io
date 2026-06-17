export default function ProjectListItem({ project, onClick }) {
  return (
    <li className="project-item" onClick={onClick}>
      <div className="meta-row">
        <p className="title">{project.title}</p>
        {project.description && <p className="desc">{project.description}</p>}
      </div>
      {project.detail && <p className="detail">{project.detail}</p>}
      {project.links?.length > 0 && (
        <p className="project-links" onClick={e => e.stopPropagation()}>
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
