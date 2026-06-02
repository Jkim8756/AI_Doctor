import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
    session: Session | null;    
    user: User | null;
    isCheckingSession: boolean;
    setSession: (session: Session | null) => void;
    setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    isCheckingSession: true,
    setSession: () => {},
    setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    useEffect(() => {
        async function checkSession() {
            try{
                const { data } = await supabase.auth.getSession();
                setSession(data.session);
                setUser(data.session?.user || null);
            } catch (error) {
                console.error("Error fetching session:", error);
            } finally {
                setIsCheckingSession(false);
            }
        }

        checkSession();
        
        // supabase.auth.getSession().then(({ data }) => {
        //     setSession(data.session);
        //     setUser(data.session?.user || null);
        //     setIsCheckingSession(false);
        // });

        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user || null);
            setIsCheckingSession(false);
        });

        return () => data.subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ session, user, isCheckingSession, setSession, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
