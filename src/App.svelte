<script lang="ts">
  import "./app.css";
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./routes/Home.svelte";
  import About from "./routes/About.svelte";
  import Blog from "./routes/Blog.svelte";
  import Chat from "./routes/Chat.svelte";

  import { pb } from "$lib/pocketbase";

  import { onMount } from "svelte";

  export let isDesktop = !window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches;

  onMount(() => {
    window.onresize = () => {
      isDesktop = !window.matchMedia("only screen and (max-width: 768px)")
        .matches;
    };
  });

  export let url = "";

  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Sheet from "$lib/components/ui/sheet";
  import * as Drawer from "$lib/components/ui/drawer";
  let form;

  let username: string;
  let password: string;

  async function login() {
    loginIsOpen = false;
    const user = await pb
      .collection("users")
      .authWithPassword(username, password);
    console.log(user);
  }

  async function signUp() {
    try {
      const data = {
        username,
        password,
        passwordConfirm: password,
        name: "hi mom!",
      };
      const createdUser = await pb.collection("users").create(data);
      await login();
    } catch (err) {
      console.error(err);
    }
  }

  function signOut() {
    pb.authStore.clear();
  }

  let loginIsOpen = false;

  const classList = "invalid";
</script>

<!--
<div class="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
	<div class="w-full max-w-md">
		-->
<Router {url}>
  <nav class="text-sky-400 p-4 shadow-md rounded-md mb-3">
    <ul class="flex space-x-4 justify-center">
      <li>
        <Link to="/" class="hover:text-gray-400">Home</Link>
      </li>
      <li>
        <Link to="/about" class="hover:text-gray-400">About</Link>
      </li>
      <li>
        <Link to="/blog" class="hover:text-gray-400">Blog</Link>
      </li>
      <li>
        <Link to="/chat" class="hover:text-gray-400">Chat</Link>
      </li>
      {#if isDesktop}
        <Sheet.Root bind:open={loginIsOpen}>
          <Sheet.Trigger>Open</Sheet.Trigger>
          <Sheet.Content>
            <Sheet.Header>
              <Sheet.Title>Login</Sheet.Title>
              <Sheet.Description>
                <form on:submit|preventDefault>
                  <div class="flex w-full max-w-sm flex-col gap-1.5">
                    <Label for="email">Email</Label>
                    <Input
                      bind:value={username}
                      type="email"
                      id="email"
                      placeholder="Email"
                    />
                    <p class="text-xs text-red-500">
                      Enter your email address.
                    </p>
                  </div>
                  <div class="flex w-full max-w-sm flex-col gap-1.5 mt-2">
                    <Label for="password">Heslo</Label>
                    <Input
                      bind:value={password}
                      type="password"
                      id="password"
                      placeholder="Heslo"
                    />
                    <p class="text-xs text-red-500">Musíte zadať heslo.</p>
                  </div>
                  <div class="flex w-full max-w-sm flex-row gap-1.5 mt-2">
                    <Form.Button on:click={signUp}>Sign Up</Form.Button>
                    <Form.Button on:click={login}>Login</Form.Button>
                  </div>
                </form>
              </Sheet.Description>
            </Sheet.Header>
          </Sheet.Content>
        </Sheet.Root>
      {:else}
        <Drawer.Root>
          <Drawer.Trigger>Open</Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Are you sure absolutely sure?</Drawer.Title>
              <Drawer.Description
                >This action cannot be undone.</Drawer.Description
              >
            </Drawer.Header>
            <Drawer.Footer>
              <Drawer.Close>Cancel</Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Root>
      {/if}
    </ul>
  </nav>
  <div class="rounded-md shadow-md">
    <Route path="/about" component={About} />
    <Route path="/blog" component={Blog} />
    <Route path="/"><Home /></Route>
    <Route path="/chat" component={Chat} />
  </div>
</Router>

<!--
	</div>
</div>
-->

<style lang="postcss">
  .invalid {
    @apply border-red-500 border;
  }
</style>
