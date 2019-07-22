import { schema } from 'normalizr';

export const projectSchema = new schema.Entity('projects');

export const projectsSchema = new schema.Array(projectSchema);

export default {
  projectSchema,
  projectsSchema,
};
