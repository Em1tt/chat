import PocketBase, { type AuthModel } from 'pocketbase';
import type { RecordModel } from 'pocketbase';
import { get, writable, type Writable } from 'svelte/store';

export const currentChat: Writable<RecordModel> = writable();

interface Message extends RecordModel {
  content: string;
  created: string;
  author: string; 
}
interface User extends RecordModel {
  username: string;
  email: string;
  name: string; 
}

export const pb = new PocketBase('https://chatapi.em1t.xyz');

export const currentUser = writable<AuthModel>(pb.authStore.model);

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

  if(!currentChat){
    try {
      console.log('Subscription triggered');
      const records = await pb.collection('messages').getFullList<Message>({ sort: '-created', expand: 'author' });
      console.log('Fetched messages:', records);
      messages.set(records);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }else{
    try {
      console.log('Subscription triggered');
      const records = await pb.collection('messages').getFullList<Message>({ sort: '-created', expand: 'author', filter: `group=${get(currentChat).id}` });
      console.log('Fetched messages:', records);
      messages.set(records);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
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

export const users: Writable<User[]> = writable();


(async () => {
  try {
    const records = await pb.collection('users').getFullList<User>({ sort: '-created', expand: 'author' });
    users.set(records);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
  }
})();