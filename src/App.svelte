<script lang="ts">
  import "./app.css";
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./routes/Home.svelte";
  import About from "./routes/About.svelte";
  import Blog from "./routes/Blog.svelte";
  import Chat from "./routes/Chat.svelte";
  import Login from "$lib/Login.svelte";
  import Register from "$lib/Register.svelte";
  import { currentUser } from "$lib/pocketbase";

  export let url = "";

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
      <li>
        <Login />
        <Register />
      </li>
    </ul>
  </nav>
  <div class="rounded-md shadow-md">
    <Route path="/about" component={About} />
    <Route path="/blog" component={Blog} />
    <Route path="/"><Home /></Route>
    <Route path="/chat" component={Chat} />
  </div>
  {#if $currentUser}
    <p class="text-center text-green-400">Logged in as {$currentUser.email}</p>
  {/if}
  {#if !$currentUser}
    <p class="text-center text-red-400">Not logged in</p>
  {/if}
</Router>

<!--
	</div>
</div>
-->