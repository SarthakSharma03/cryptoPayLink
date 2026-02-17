import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getUserMe, updateUserMe } from '../services/Api';

export interface UserData {
  fullName: string;
  email: string;
  username:string;
  country:string;
  phone?: string;

  address?: string;

  isProfileComplete?: boolean;

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

  address: '',
 
  isProfileComplete: false

};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(initialUserData);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
    updateUserMe(data).then((res) => {
      if (res?.user) {
        setUserData(res.user as UserData);
      }
    }).catch(() => {});
  };

  const resetUserData = () => {
    setUserData(initialUserData);
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) return;
    getUserMe().then((res) => {
      if (res?.user) {
        setUserData(res.user as UserData);
      }
    }).catch(() => {});
  }, []);

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
