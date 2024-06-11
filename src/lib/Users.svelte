<script lang="ts">
  import { users, currentChat, pb, currentUser } from "./pocketbase";
</script>

{#if $users}
<div class="flex flex-col fixed right-0 w-80 h-80 overflow-auto bottom-0 bg-slate-300">
  {#each $users as user}
    <button on:click={
        async () => {
            const group = (await pb.collection("group").getFullList(0, {
                filter: [user.id, $currentUser?.id].map(i => `users ~ "${i}"`).join(" && "),
                expand: "users"
            }))[0];
            if(!group) return;
          currentChat.set(group);
        }
    } class="flex items-center p-2 border-b border-gray-200 flex-row gap-2 hover:bg-slate-200">
      <img src="https://api.dicebear.com/8.x/identicon/svg?seed={user.id}" alt="avatar" class="w-12" />
      <p>{user.username}</p>
    </button>
  {/each}
</div>
{/if}