export interface EventDrop {
  id: number;
  name: string;
  link: string | null;
  type: string | null;
}

export type EventDropsResult<T> =
  | ({ success: true } & T)
  | { success: false; message: string };
