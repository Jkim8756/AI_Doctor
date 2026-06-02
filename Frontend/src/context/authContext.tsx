import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
    session: Session | null;    
    user: User | null;
    setSession: (session: Session | null) => void;
    setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    setSession: () => {},
    setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setUser(data.session?.user || null);
        });

        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user || null);
        });

        return () => data.subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ session, user, setSession, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}