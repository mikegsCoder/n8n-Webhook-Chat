import { supabase } from '@/integrations/supabase/client';
import { ChatSession, MessageType } from '../interfaces/chat';

export const createChatSession = async (title: string = "New Chat"): Promise<ChatSession | null> => {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert([{ title }])
      .select()
      .single();

    if (error) {
      console.error("Error creating chat session:", error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error("Error creating chat session:", error);
    return null;
  }
};

export const getChatSessions = async (): Promise<ChatSession[]> => {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error("Error fetching chat sessions:", error);
      return [];
    }

    return data.map(session => ({
      id: session.id,
      title: session.title,
      created_at: session.created_at,
      updated_at: session.updated_at
    }));
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    return [];
  }
};

export const updateChatSession = async (id: string, updates: Partial<ChatSession>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('chat_sessions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error("Error updating chat session:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating chat session:", error);
    return false;
  }
};

export const deleteChatSession = async (id: string): Promise<boolean> => {
  try {
    // Delete associated messages first
    const { error: messagesError } = await supabase
      .from('chat_messages')
      .delete()
      .eq('chat_session_id', id);

    if (messagesError) {
      console.error("Error deleting chat messages:", messagesError);
      return false;
    }

    // Then delete the session
    const { error: sessionError } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', id);

    if (sessionError) {
      console.error("Error deleting chat session:", sessionError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting chat session:", error);
    return false;
  }
};

export const getChatMessages = async (chatSessionId: string): Promise<MessageType[]> => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_session_id', chatSessionId)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error("Error fetching chat messages:", error);
      return [];
    }

    return data.map(message => ({
      id: message.id,
      content: message.content,
      sender: message.sender as 'user' | 'n8n',
      timestamp: new Date(message.timestamp)
    }));
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return [];
  }
};

export const saveMessage = async (chatSessionId: string, message: MessageType): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .insert([{
        id: message.id,
        chat_session_id: chatSessionId,
        content: message.content,
        sender: message.sender,
        timestamp: message.timestamp.toISOString()
      }]);

    if (error) {
      console.error("Error saving message:", error);
      return false;
    }

    // Update the session's updated_at timestamp
    await updateChatSession(chatSessionId, { updated_at: new Date().toISOString() });
    
    return true;
  } catch (error) {
    console.error("Error saving message:", error);
    return false;
  }
};
