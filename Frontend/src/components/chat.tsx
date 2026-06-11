import React, { useState, Dispatch, SetStateAction, useEffect } from 'react'
import { View, TextInput, StyleSheet, Pressable, Text, ScrollView } from 'react-native'
import { useAuth } from '@/context/authContext'
import { supabase } from '@/lib/supabase'

type ChatMessage = {
    user_id: string;
    created_at: string;
    chat_id: number;
    message: string;
    session_id: number;
    isUser: boolean;
    isPending?: boolean;
}

type ChatSession = {
    user_id: string;
    created_at: string;
    session_id: number;
}

const Chat = () => {
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [isSessionMenuOpen, setIsSessionMenuOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [sessions, setSessions] = useState<ChatSession[]>([]);


    const { user } = useAuth();
    const userId = user?.id;




    async function loadRecentSesssionId() {
        const { data, error } = await supabase
            .from("chat_session")
            .select("user_id, created_at, session_id")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(); //if not first time user

        if (error) {
            console.log(error.message);
            return;
        }
        setSessionId(data?.session_id ?? null);

    }

    async function loadSessionList() {
        const { data, error } = await supabase
            .from("chat_session")
            .select("user_id, created_at, session_id")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.log(error.message);
            return;
        }

        setSessions(data ?? []);
    }

    useEffect(() => {
        if (!userId) return;
        loadRecentSesssionId();
        loadSessionList();
    }, [userId]);

    async function loadChatLog() {
        const { data, error } = await supabase
            .from("chat")
            .select("created_at, user_id, chat_id, message, session_id, isUser")
            .eq("user_id", userId)
            .eq("session_id", sessionId)
            .order("created_at", { ascending: true });

        if (error) {
            console.log(error.message);
            return;
        }

        setChatMessages(data ?? []);

    }

    useEffect(() => {
        if (!userId || !sessionId) return;
        loadChatLog();
    }, [userId, sessionId]);


    function createNewSession() {
        setSessionId(null)
        setChatMessages([])
        setIsSessionMenuOpen(false)
    }

    function selectSession(selectedSessionId: number) {
        setSessionId(selectedSessionId)
        setIsSessionMenuOpen(false)
    }


    return (
        <View style={styles.chatContainer}>
            <View style={styles.chatHeader}>
                <View>
                    <Text style={styles.chatLabel}>Current session</Text>
                    <Text style={styles.chatSessionText}>{sessionId ?? 'New chat'}</Text>
                </View>
                <View style={styles.chatActions}>
                    <View style={styles.sessionMenuWrapper}>
                        <Pressable
                            style={styles.secondaryButton}
                            onPress={() => setIsSessionMenuOpen((open) => !open)}>
                            <Text style={styles.secondaryButtonText}>Sessions</Text>
                        </Pressable>

                        {isSessionMenuOpen && (
                            <View style={styles.sessionMenu}>
                                {sessions.length === 0 ? (
                                    <Text style={styles.sessionMenuEmpty}>No sessions yet</Text>
                                ) : (
                                    sessions.map((session) => (
                                        <Pressable
                                            key={session.session_id}
                                            style={[
                                                styles.sessionMenuItem,
                                                session.session_id === sessionId && styles.sessionMenuItemActive,
                                            ]}
                                            onPress={() => selectSession(session.session_id)}>
                                            <Text
                                                style={[
                                                    styles.sessionMenuItemText,
                                                    session.session_id === sessionId && styles.sessionMenuItemTextActive,
                                                ]}>
                                                Session {session.session_id}
                                            </Text>
                                        </Pressable>
                                    ))
                                )}
                            </View>
                        )}
                    </View>
                    {/* <Pressable style={styles.secondaryButton} onPress={loadRecentSesssionId}>
                        <Text style={styles.secondaryButtonText}>Latest</Text>
                    </Pressable> */}
                    <Pressable style={styles.primaryButton} onPress={createNewSession}>
                        <Text style={styles.primaryButtonText}>New Chat</Text>
                    </Pressable>
                </View>
            </View>
            <ScrollView style={styles.chatLog} contentContainerStyle={styles.chatLogContent}>
                {chatMessages.length === 0 ? (
                    <View style={styles.emptyLog}>
                        <Text style={styles.emptyLogText}>No messages in this session yet.</Text>
                    </View>
                ) : (
                    chatMessages.map((chat) => (
                        <View
                            key={chat.chat_id}
                            style={[
                                styles.messageRow,
                                chat.isUser ? styles.userMessageRow : styles.aiMessageRow,
                            ]}>
                            <View
                                style={[
                                    styles.messageBubble,
                                    chat.isUser ? styles.userBubble : styles.aiBubble,
                                ]}>
                                <Text
                                    style={[
                                        styles.messageText,
                                        chat.isUser ? styles.userMessageText : styles.aiMessageText,
                                    ]}>
                                    {chat.message}
                                </Text>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            <Chatbox
                sessionId={sessionId}
                setSessionId={setSessionId}
                userId={userId}
                onMessageCreated={(message) => setChatMessages((previous) => [...previous, message])}
                onMessageReplaced={(chatId, message) => setChatMessages((previous) => (
                    previous.map((chat) => chat.chat_id === chatId ? message : chat)
                ))}
            />
        </View>
    );
}

const Chatbox = (
    { userId, sessionId, setSessionId, onMessageCreated, onMessageReplaced }
        : {
            userId: string | undefined;
            sessionId: number | null;
            setSessionId: Dispatch<SetStateAction<number | null>>;
            onMessageCreated: (message: ChatMessage) => void;
            onMessageReplaced: (chatId: number, message: ChatMessage) => void;
        }
) => {
    const [messages, setMessages] = useState("")
    const [isSending, setIsSending] = useState(false);

    //check authcontext 
    //check user
    //check chat session

    async function createSession() {
        const { data, error } = await supabase
            .from("chat_session")
            .insert({
                user_id: userId,
            })
            .select("session_id")
            .single();

        if (error) {
            console.log(error.message);
            return null;
        }

        return data.session_id;
    }

    async function SendMessage() {
        if (isSending) {
            console.log("previous message is still sending, please wait")
            return;
        }

        if (!userId) {
            console.log("user is not logged in")
            return;
        }

        const trimmedMessage = messages.trim();
        if (!trimmedMessage) {
            return; //don't let users send empty message
        }

        setIsSending(true);

        let pendingAiMessage: ChatMessage | null = null;
        let activeSessionId = sessionId;

        try {
            if (!activeSessionId) {
                activeSessionId = await createSession();

                if (!activeSessionId) {
                    return;
                }

                setSessionId(activeSessionId);
            }

            const { data, error } = await supabase
                .from("chat")
                .insert({
                    session_id: activeSessionId,
                    user_id: userId,
                    isUser: true,
                    message: trimmedMessage,
                })
                .select("created_at, user_id, chat_id, message, session_id, isUser")
                .single();

            if (error) {
                console.log(error.message)
                return;
            }

            onMessageCreated(data)
            setMessages("")

            pendingAiMessage = {
                chat_id: -Date.now(),
                created_at: new Date().toISOString(),
                user_id: "ai-pending",
                session_id: activeSessionId,
                isUser: false,
                message: "AI is thinking...",
                isPending: true,
            };

            onMessageCreated(pendingAiMessage);

            const aiResult = await fetch("http://localhost:8001/chat/respond-latest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_id: activeSessionId,
                }),
            });

            if (!aiResult.ok) {
                console.log(await aiResult.text());
                onMessageReplaced(pendingAiMessage.chat_id, {
                    ...pendingAiMessage,
                    message: "AI response failed. Check the backend terminal.",
                    isPending: false,
                });
                return;
            }

            const aiData = await aiResult.json();
            if (aiData.ai_message) {
                onMessageReplaced(pendingAiMessage.chat_id, aiData.ai_message);
            } else {
                onMessageReplaced(pendingAiMessage.chat_id, {
                    ...pendingAiMessage,
                    message: "AI response finished, but no message was returned.",
                    isPending: false,
                });
            }
        } catch (error) {
            console.log(error)
            const errorMessage: ChatMessage = {
                ...(pendingAiMessage ?? {
                    chat_id: -Date.now(),
                    created_at: new Date().toISOString(),
                    user_id: "ai-error",
                    session_id: activeSessionId ?? 0,
                    isUser: false,
                    message: "",
                }),
                message: "AI response request failed. Check backend connection.",
                isPending: false,
            };

            if (pendingAiMessage) {
                onMessageReplaced(pendingAiMessage.chat_id, errorMessage);
            } else {
                onMessageCreated(errorMessage);
            }
        } finally {
            setIsSending(false);
        }

    }

    //clear the message state 




    return (
        <>
            <View style={styles.chatSection}>
                <TextInput
                    value={messages}
                    onChangeText={setMessages}
                    style={styles.chatInput}
                    placeholder={"Message AI Doctor"}
                    placeholderTextColor="#94a3b8"
                    multiline
                />
                <Pressable style={styles.sendButton} onPress={() => SendMessage()}>
                    <Text style={styles.sendButtonText}>
                        Send
                    </Text>
                </Pressable >
            </View >

        </>
    )
}

const styles = StyleSheet.create({
    chatContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#dbe3ef',
        borderRadius: 8,
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
    },
    chatHeader: {
        minHeight: 64,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        zIndex: 20,
    },
    chatLabel: {
        color: '#64748b',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    chatSessionText: {
        marginTop: 2,
        color: '#0f172a',
        fontSize: 18,
        fontWeight: '800',
    },
    chatActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    primaryButton: {
        minHeight: 36,
        paddingHorizontal: 14,
        borderRadius: 8,
        backgroundColor: '#2563eb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
    },
    secondaryButton: {
        minHeight: 36,
        paddingHorizontal: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#cbd5e1',
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        color: '#334155',
        fontSize: 14,
        fontWeight: '700',
    },
    sessionMenuWrapper: {
        position: 'relative',
    },
    sessionMenu: {
        position: 'absolute',
        top: 42,
        right: 0,
        width: 180,
        maxHeight: 240,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        backgroundColor: '#ffffff',
        zIndex: 10,
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 18,
        elevation: 8,
    },
    sessionMenuEmpty: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: '#64748b',
        fontSize: 14,
    },
    sessionMenuItem: {
        minHeight: 38,
        paddingHorizontal: 12,
        justifyContent: 'center',
    },
    sessionMenuItemActive: {
        backgroundColor: '#eff6ff',
    },
    sessionMenuItemText: {
        color: '#334155',
        fontSize: 14,
        fontWeight: '600',
    },
    sessionMenuItemTextActive: {
        color: '#1d4ed8',
        fontWeight: '800',
    },
    chatLog: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    chatLogContent: {
        padding: 16,
        gap: 10,
    },
    emptyLog: {
        minHeight: 140,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyLogText: {
        color: '#64748b',
        fontSize: 14,
    },
    messageRow: {
        width: '100%',
        flexDirection: 'row',
    },
    userMessageRow: {
        justifyContent: 'flex-end',
    },
    aiMessageRow: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        maxWidth: '78%',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
    },
    userBubble: {
        backgroundColor: '#2563eb',
        borderColor: '#2563eb',
    },
    aiBubble: {
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
    },
    messageText: {
        fontSize: 15,
        lineHeight: 21,
    },
    userMessageText: {
        color: '#ffffff',
    },
    aiMessageText: {
        color: '#0f172a',
    },
    chatSection: {
        minHeight: 96,
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
    },
    chatInput: {
        flex: 1,
        minHeight: 72,
        maxHeight: 140,
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        backgroundColor: '#ffffff',
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: '#0f172a',
        fontSize: 15,
        textAlignVertical: 'top',
    },
    sendButton: {
        minHeight: 44,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#0f172a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '800',
    },
});

export default Chat
