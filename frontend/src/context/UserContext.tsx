import { createContext, useContext, useState, ReactNode } from 'react';

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
  avatarUrl: ''

};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(initialUserData);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const resetUserData = () => {
    setUserData(initialUserData);
  };

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
