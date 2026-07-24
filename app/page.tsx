import { getResume } from '../lib/resume';

export default async function HomePage() {
  const resume = getResume();
  return (
    <main>
      <h1>{resume.contact.email}</h1>
      <p>{resume.summary}</p>
      <ul>
        {resume.contact.links.map((link) => (
          <li key={link}>
            <a href={link}>{link}</a>
          </li>
        ))}
      </ul>
      <ul>
        {resume.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </main>
  );
}
