<p class="text-red-500 text-3xl text-center">(👍≖‿‿≖)👍 👍(≖‿‿≖👍)</p>

<script lang="ts">
  import { onMount } from 'svelte';
  import { globalMessages, addMessage, users, currentChat, currentUser } from '$lib/pocketbase';
  import { writable } from 'svelte/store';
  import Users from '$lib/Users.svelte';
  import ChatWindow from '$lib/ChatWindow.svelte';

  let newMessage = writable('');

  const sendMessage = async () => {
    const messageContent = $newMessage.trim();
    if (messageContent.length > 0) {
      try {
        await addMessage(messageContent);
        newMessage.set('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  onMount(() => {
    globalMessages.subscribe((value) => {
      console.log('Global messages:', value);
    });
  });

  const handleBackToGlobal = () => {
    currentChat.set(null);
  };
</script>
{#if $currentUser}
<Users/>
{/if}

{#if $currentChat}
  <ChatWindow/>
  <button on:click={handleBackToGlobal} class="bg-gray-500 text-white p-2 rounded"> Global Chat </button>
{:else}
  <div class="container mx-auto p-4">
    <div class="bg-white shadow-md rounded-lg p-4 mb-4">
      <h1 class="text-2xl font-bold mb-2">Global Chat</h1>
      <div class="mb-4 h-64 overflow-y-auto">
        {#key $globalMessages}
        {#each $globalMessages as message (message.id)}
          <div class="p-2 border-b border-gray-200">
            <p><strong>{message.expand?.author.username}</strong>: {message.content}</p>
            <small class="text-gray-500">{new Date(message.created).toLocaleString()}</small>
          </div>
        {/each}
        {/key}
      </div>
      <input
        type="text"
        bind:value={$newMessage}
        placeholder="Type a message"
        class="w-full p-2 border rounded mb-2"
      />
      <button on:click={sendMessage} class="w-full bg-blue-500 text-white p-2 rounded">
        Send
      </button>
    </div>
  </div>
{/if}
