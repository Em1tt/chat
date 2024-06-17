<script lang="ts">
  import { users, currentChat, pb, currentUser } from "./pocketbase";
  import type { RecordModel } from "pocketbase";

  const createOrGetGroup = async (userId: string) => {
  try {
    const currentUserId = $currentUser?.id;
    const existingGroups = await pb.collection("group").getFullList({
      filter: `users ~ "${userId}" && users ~ "${currentUserId}"`,
      expand: "users"
    });

    if (existingGroups.length > 0) {
      return existingGroups[0];
    } else {
      let newGroup = await pb.collection("group").create({
        users: [userId, currentUserId],
      });
      newGroup = await pb.collection("group").getOne(newGroup.id, { expand: "users" });
      return newGroup;
    }
  } catch (error) {
    console.error('Error in createOrGetGroup:', error);
    throw error; 
  }
};

const handleUserClick = async (userId: string) => {
  try {
    const group = await createOrGetGroup(userId);
    console.log('Group created or fetched:', group);
    currentChat.set(group);
  } catch (error) {
    console.error('Error handling user click:', error);
  }
};

</script>

{#if $users}
<div class="flex flex-col fixed right-0 w-80 h-80 overflow-auto bottom-0 bg-slate-300">
  <h1 class="text-center text-2xl font-bold p-2 bg-white">Chaty</h1>
  {#each $users as user}
    <button on:click={() => handleUserClick(user.id)} class="flex items-center p-2 border-b border-gray-200 flex-row gap-2 hover:bg-slate-200">
      <img src={`https://api.dicebear.com/8.x/identicon/svg?seed=${user.id}`} alt="avatar" class="w-12" />
      <p>{user.username}</p>
    </button>
  {/each}
</div>
{/if}
