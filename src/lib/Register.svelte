<script lang="ts">
  import { pb } from "$lib/pocketbase";
  import { onMount } from "svelte";
  import { isLoginOpen, isRegisterOpen } from "./stores";

  let email: string = "";
  let password: string = "";
  let confirmPassword: string = "";

  let emailError: string = "";
  let passwordError: string = "";
  let confirmPasswordError: string = "";

  let isDesktop = !window.matchMedia("only screen and (max-width: 768px)").matches;

  onMount(() => {
    window.onresize = () => {
      isDesktop = !window.matchMedia("only screen and (max-width: 768px)").matches;
    };
  });

  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Sheet from "$lib/components/ui/sheet";
  import * as Drawer from "$lib/components/ui/drawer";
  import { Button } from "$lib/components/ui/button/index.js";

  async function register() {
    emailError = "";
    passwordError = "";
    confirmPasswordError = "";

    if (password !== confirmPassword) {
      confirmPasswordError = "Passwords do not match";
      return;
    }

    try {
      const user = await pb.collection("users").create({
        email: email,
        password: password,
        passwordConfirm: confirmPassword
      });
      console.log(user);
      isRegisterOpen.set(false);
      isLoginOpen.set(true);
    } catch (e: any) {
      const errors = e.data.data;
      if (errors.email) {
        emailError = errors.email.message;
      }
      if (errors.password) {
        passwordError = errors.password.message;
      }
    }
  }

  async function switchToLogin() {
    isRegisterOpen.set(false);
    isLoginOpen.set(true);
  }

  ["invalid"];
</script>

{#if isDesktop}
  <Sheet.Root bind:open={$isRegisterOpen}>
    <Sheet.Content>
      <Sheet.Header>
        <Sheet.Title>Register</Sheet.Title>
        <Sheet.Description>
          <form on:submit|preventDefault>
            <div class="flex w-full max-w-sm flex-col gap-1.5">
              <Label for="email">Email</Label>
              <Input
                class={emailError ? "border-red-500" : ""}
                bind:value={email}
                on:input={() => (emailError = "")}
                type="email"
                id="email"
                placeholder="Email"
              />
              {#if emailError}
                <p class="text-xs text-red-500">{emailError}</p>
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
                <p class="text-xs text-red-500">{passwordError}</p>
              {/if}
            </div>
            <div class="flex w-full max-w-sm flex-col gap-1.5 mt-2">
              <Label for="confirmPassword">Confirm Password</Label>
              <Input
                class={confirmPasswordError ? "border-red-500" : ""}
                bind:value={confirmPassword}
                on:input={() => (confirmPasswordError = "")}
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
              />
              {#if confirmPasswordError}
                <p class="text-xs text-red-500">{confirmPasswordError}</p>
              {/if}
            </div>
            <div class="flex flex-row items-center">
              <p>Already have an account?</p>
              <Button on:click={switchToLogin} variant="link" class="px-1">Login</Button>
            </div>
            <div class="flex w-full max-w-sm flex-row gap-1.5 mt-2">
              <Form.Button on:click={register}>Register</Form.Button>
            </div>
          </form>
        </Sheet.Description>
      </Sheet.Header>
    </Sheet.Content>
  </Sheet.Root>
{:else}
  <Drawer.Root bind:open={$isRegisterOpen}>
    <Drawer.Content>
      <Drawer.Header>
        <Drawer.Title class="text-center">Register</Drawer.Title>
        <Drawer.Description class="mt-6">
          <form on:submit|preventDefault>
            <div class="flex w-full max-w-sm flex-col gap-1.5 mx-auto mt-2">
              <Label for="email" class="text-left">Email</Label>
              <Input
                class={emailError ? "border-red-500" : ""}
                bind:value={email}
                on:input={() => (emailError = "")}
                type="email"
                id="email"
                placeholder="Email"
              />
              {#if emailError}
                <p class="text-xs text-red-500 text-left">{emailError}</p>
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
            <div class="flex w-full max-w-sm flex-col gap-1.5 mt-2 mx-auto">
              <Label for="confirmPassword" class="text-left">Confirm Password</Label>
              <Input
                class={confirmPasswordError ? "border-red-500" : ""}
                bind:value={confirmPassword}
                on:input={() => (confirmPasswordError = "")}
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
              />
              {#if confirmPasswordError}
                <p class="text-xs text-red-500 text-left">{confirmPasswordError}</p>
              {/if}
            </div>
            <div class="flex flex-row w-full max-w-sm items-center mx-auto">
              <p>Already have an account?</p>
              <Button on:click={switchToLogin} variant="link" class="px-1">Login</Button>
            </div>
            <div class="flex w-full max-w-sm flex-row gap-1.5 mt-2 mx-auto">
              <Form.Button class="w-full" on:click={register}>Register</Form.Button>
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
