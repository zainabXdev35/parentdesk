import { createContext, useContext, useState } from 'react';
import { SCHOOL } from '../data/mock.js';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

const read = () => {
  try { return JSON.parse(sessionStorage.getItem('pd_user')); } catch { return null; }
};

const USERS = {
  admin: { name: 'Sana Rehman', role: 'admin', title: 'School Administrator' },
  teacher: { name: 'Ayesha Khan', role: 'teacher', title: 'Mathematics Teacher' },
  parent: { name: 'Tariq Malik', role: 'parent', title: 'Parent', parentId: 'p-malik' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(read);
  const [childId, setChildId] = useState(null); // null → first child of the logged-in parent

  // TODO(backend): POST /api/auth/login → { token, user }. Store the JWT and send it as
  // `Authorization: Bearer <token>` on every request. For now we fake a successful login.
  const login = (role) => {
    const u = { ...USERS[role], school: SCHOOL };
    sessionStorage.setItem('pd_user', JSON.stringify(u));
    setChildId(null);
    setUser(u);
  };
  const logout = () => { sessionStorage.removeItem('pd_user'); setUser(null); };

  return <Ctx.Provider value={{ user, login, logout, childId, setChildId }}>{children}</Ctx.Provider>;
}
