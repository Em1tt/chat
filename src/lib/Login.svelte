<script lang="ts">
  import { pb } from "$lib/pocketbase";
  import { onMount } from "svelte";
  import { isLoginOpen, isRegisterOpen } from "./stores";

  let username: string;
  let password: string;

  let usernameError: string;
  let passwordError: string;

  let isDesktop = !window.matchMedia("only screen and (max-width: 768px)")
    .matches;

  onMount(() => {
    window.onresize = () => {
      isDesktop = !window.matchMedia("only screen and (max-width: 768px)")
        .matches;
    };
  });

  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Sheet from "$lib/components/ui/sheet";
  import * as Drawer from "$lib/components/ui/drawer";
  import { Button } from "$lib/components/ui/button/index.js";

  async function login() {
    try {
      const user = await pb
        .collection("users")
        .authWithPassword(username, password);
      console.log(user);
      isLoginOpen.set(false);
    } catch (e: any) {
      if (e.data.message == "Failed to authenticate.") {
        usernameError = "Email or password incorrect";
      } else {
        Object.keys(e.data.data).forEach((key) => {
          if (key === "identity") {
            usernameError = e.data.data[key].message;
          }
          if (key === "password") {
            passwordError = e.data.data[key].message;
          }
        });
      }
    }
  }

  async function switchToRegister() {
    isLoginOpen.set(false);
    isRegisterOpen.set(true);
  }

  ["invalid"];
</script>

{#if isDesktop}
  <Sheet.Root bind:open={$isLoginOpen}>
    <Sheet.Trigger>Login</Sheet.Trigger>
    <Sheet.Content>
      <Sheet.Header>
        <Sheet.Title>Login</Sheet.Title>
        <Sheet.Description>
          <form on:submit|preventDefault>
            <div class="flex w-full max-w-sm flex-col gap-1.5">
              <Label for="email">Email/Username</Label>
              <Input
                class={usernameError ? "border-red-500" : ""}
                bind:value={username}
                on:input={() => (usernameError = "")}
                type="text"
                id="email"
                placeholder="Email/Username"
              />
              {#if usernameError}
                <p class="text-xs text-red-500">{usernameError}</p>
              {/if}
            </div>
            <div class="flex w-full max-w-sm flex-col gap-1.5 mt-2">
              <Label for="password">Password</Label>
              <Input
                class={passwordError ? "border-red-500" : ""}
                bind:value={password}
                on:input={() => (passwordError = "")}
                type="password"
                id="password"
                placeholder="Password"
              />
              {#if passwordError}
                <p class="text-xs text-red-500 gap-1.5">{passwordError}</p>
              {/if}
            </div>
            <div class="flex flex-row items-center">
              <p>No account?</p>
              <Button on:click={switchToRegister} variant="link" class="px-1"
                >Register</Button
              >
            </div>
            <div class="flex w-full max-w-sm flex-row gap-1.5 mt-2">
              <Form.Button on:click={login}>Login</Form.Button>
            </div>
          </form>
        </Sheet.Description>
      </Sheet.Header>
    </Sheet.Content>
  </Sheet.Root>
{:else}
  <Drawer.Root bind:open={$isLoginOpen}>
    <Drawer.Trigger>Login</Drawer.Trigger>
    <Drawer.Content>
      <Drawer.Header>
        <Drawer.Title class="text-center">Login</Drawer.Title>
        <Drawer.Description class="mt-6">
          <form on:submit|preventDefault>
            <div class="flex w-full max-w-sm flex-col gap-1.5 mx-auto mt-2">
              <Label for="email" class="text-left">Email</Label>
              <Input
                class={usernameError ? "border-red-500" : ""}
                bind:value={username}
                on:input={() => (usernameError = "")}
                type="text"
                id="email"
                placeholder="Email"
              />
              {#if usernameError}
                <p class="text-xs text-red-500 text-left">{usernameError}</p>
              {/if}
            </div>
            <div class="flex w-full max-w-sm flex-col gap-1.5 mt-2 mx-auto">
              <Label for="password" class="text-left">Password</Label>
              <Input
                class={passwordError ? "border-red-500" : ""}
                bind:value={password}
                on:input={() => (passwordError = "")}
                type="password"
                id="password"
                placeholder="Password"
              />
              {#if passwordError}
                <p class="text-xs text-red-500 text-left">{passwordError}</p>
              {/if}
            </div>
            <div class="flex flex-row w-full max-w-sm items-center mx-auto">
              <p>No account?</p>
              <Button on:click={switchToRegister} variant="link" class="px-1"
                >Register</Button
              >
            </div>
            <div class="flex w-full max-w-sm flex-row gap-1.5 mt-2 mx-auto">
              <Form.Button class="w-full" on:click={login}>Login</Form.Button>
            </div>
          </form>
        </Drawer.Description>
      </Drawer.Header>
    </Drawer.Content>
  </Drawer.Root>
{/if}

<style lang="postcss">
  input.invalid {
    @apply border-red-500 border;
  }
</style>
