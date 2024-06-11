import PocketBase from 'pocketbase';
import type { RecordModel } from 'pocketbase';
import { writable } from 'svelte/store';

interface Message extends RecordModel {
  content: string;
  created: string;
  author: string; 
}

export const pb = new PocketBase('https://chatapi.em1t.xyz');

export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange((auth) => {
  console.log('authStore changed', auth);
  currentUser.set(pb.authStore.model);
});

export const messages = writable<Message[]>([]);
(async () => {
  try {
    const records = await pb.collection('messages').getFullList<Message>({ sort: '-created', expand: 'author' });
    messages.set(records);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
  }
})();

pb.collection('messages').subscribe('*', async (e) => {
  console.log(e.action);
  
  try {
    console.log('Subscription triggered');
    const records = await pb.collection('messages').getFullList<Message>({ sort: '-created', expand: 'author' });
    console.log('Fetched messages:', records);
    messages.set(records);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
  }
});

export const addMessage = async (content: string) => {
  try {
    const user = pb.authStore.model;
    if (!user) throw new Error('User not authenticated');
    const author = user.id ;
    console.log('Sending message:', content);
    const response = await pb.collection('messages').create({ content, author });
    console.log('Message sent:', response);
  } catch (error) {
    console.error('Failed to add message:', error);
    throw error;
  }
};
