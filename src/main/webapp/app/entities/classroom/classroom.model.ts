export interface IClassroom {
  id: number;
  number?: number | null;
  section?: string | null;
  desc?: string | null;
}

export type NewClassroom = Omit<IClassroom, 'id'> & { id: null };
