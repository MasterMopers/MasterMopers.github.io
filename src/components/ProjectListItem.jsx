export default function ProjectListItem({ project, onClick }) {
  return (
    <li className="project-item" onClick={onClick}>
      <div className="meta-row">
        <p className="title">{project.title}</p>
        {project.description && <p className="desc">{project.description}</p>}
      </div>
      {project.detail && <p className="detail">{project.detail}</p>}
    </li>
  );
}
