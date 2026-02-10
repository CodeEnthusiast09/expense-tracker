export interface ClerkError {
  errors?: {
    message: string;
    longMessage?: string;
    code?: string;
  }[];
  message?: string;
}
