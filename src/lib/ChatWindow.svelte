<script lang="ts">
  import { onDestroy } from "svelte";
  import { currentChat, currentUser, messages, pb } from "./pocketbase";
  import type { RecordModel } from "pocketbase";

  let messagesSubDestroy: () => void;
  let sprava: string;

  function sendMessage(){
    pb.collection("messages").create({
      content: sprava,
      group: $currentChat.id,
      author: $currentUser?.id
    });
  }

  let userNames: string = "";

  const chatSubDestroy = currentChat.subscribe(async (v) => {
    userNames = $currentChat.expand?.users.map((i: RecordModel) => i.username).join(", ");
    messages.set(
          await pb.collection("messages").getFullList({
            expand: "author",
            filter: `group="${v.id}"`,
            sort: "created",
            order: "asc",
          })
    );
    messagesSubDestroy = await pb
      .collection("messages")
      .subscribe("*", async (message) => {
        messages.set(
          await pb.collection("messages").getFullList({
            expand: "author",
            filter: `group="${v.id}"`,
            sort: "created",
            order: "asc",
          })
        );
      });
  });
  onDestroy(() => {
    chatSubDestroy?.();
  });

</script>

{#if $currentChat}
  <div
    class="flex flex-col fixed right-80 w-80 h-80 overflow-auto bottom-0 bg-slate-300"
  >
  <div class="bg-slate-500">{userNames}</div>
    <div>
    {#each $messages as message (message.id)}
      <div class="p-2 border-b border-gray-200">
        <p>
          <strong>{message.expand?.author.username}</strong>: {message.content}
        </p>
        <small class="text-gray-500"
          >{new Date(message.created).toLocaleString()}
        </small>
    </div>
    {/each}
    </div>
    <input bind:value={sprava} type="text">
    <button on:click={sendMessage}>Send</button>
</div>
{/if}
