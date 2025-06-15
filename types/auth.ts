export interface User {
  id: number;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}
