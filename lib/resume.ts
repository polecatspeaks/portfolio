import { validateResume, type ResumeSchema } from './resume.schema';
import raw from '../data/resume.json';

export function getResume(): ResumeSchema {
  return validateResume(raw);
}
