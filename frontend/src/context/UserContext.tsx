import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface UserData {
  fullName: string;
  email: string;
  username:string;
  country:string;
  phone?: string;
  dob?: string;
  address?: string;
  avatarUrl?: string;

}

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  resetUserData: () => void;
}

const initialUserData: UserData = {
  fullName: '',
  email: '',
  username:'',
  country:'',
  phone: '',
  dob: '',
  address: '',
  avatarUrl: '/ChatGPT Image Feb 10, 2026, 07_59_59 AM.png'

};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;
      return raw ? (JSON.parse(raw) as UserData) : initialUserData;
    } catch {
      return initialUserData;
    }
  });

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const resetUserData = () => {
    setUserData(initialUserData);
  };

  useEffect(() => {
    try {
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch {
      void 0;
    }
  }, [userData]);

  return (
    <UserContext.Provider value={{ userData, updateUserData, resetUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
