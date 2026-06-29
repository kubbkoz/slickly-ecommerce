import { useDebounceFn } from '@vueuse/core';
import type { Ref } from 'vue';

interface HistoryMessage { role: string; text: string }

export function useChatHistory(
  messages: Ref<HistoryMessage[]>,
  currentTopicId: Ref<string | null>
) {
  const chatSid = useCookie('mtsport-chat-sid', {
    maxAge: 30 * 24 * 60 * 60,
    sameSite: 'lax',
    path: '/'
  });

  if (!chatSid.value) {
    chatSid.value = Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  const saveHistory = useDebounceFn(async () => {
    if (!chatSid.value || !messages.value.length) return;
    await $fetch('/api/chat/history', {
      method: 'POST',
      body: {
        sid: chatSid.value,
        messages: messages.value.map(m => ({ role: m.role, text: m.text })),
        topicId: currentTopicId.value
      }
    }).catch(() => null);
  }, 800);

  const loadHistory = async () => {
    if (!chatSid.value) return null;
    return $fetch<any>(`/api/chat/history?sid=${chatSid.value}`).catch(() => null);
  };

  const clearHistory = () => {
    if (!chatSid.value) return;
    $fetch('/api/chat/history', {
      method: 'POST',
      body: { sid: chatSid.value, messages: [], topicId: null }
    }).catch(() => null);
  };

  return { chatSid, saveHistory, loadHistory, clearHistory };
}
