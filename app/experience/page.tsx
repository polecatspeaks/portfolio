import { getResume } from '../../lib/resume';

export default async function ExperiencePage() {
  const resume = getResume();
  return (
    <main>
      <h1>Experience</h1>
      {resume.workHistory.map((job) => (
        <section key={`${job.employer}-${job.start}`}>
          <h2>{job.title} - {job.employer}</h2>
          <p>{job.start} - {job.end ?? 'Present'}</p>
          <ul>
            {job.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>
      ))}
      <h2>Education</h2>
      {resume.education.map((ed) => (
        <p key={`${ed.institution}-${ed.year}`}>{ed.program}, {ed.institution} ({ed.year})</p>
      ))}
    </main>
  );
}
