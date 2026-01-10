export interface GetNewSessionResponse {
  session_id: string;
  user_id?: string;
  output_append_user?: boolean;
  version?: string;
  server_id?: string;
  permissions?: string[];
  [key: string]: unknown;
}
