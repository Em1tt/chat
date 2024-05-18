<script>
  import "./app.css";
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./routes/Home.svelte";
  import About from "./routes/About.svelte";
  import Chat from "./routes/Chat.svelte";

  export let url = "";
</script>


<Router {url}>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/about">About</Link>
    <Link to="/blog">Blog</Link>
    <Link to="/chat">Chat</Link>
  </nav>
  <div>
    <Route path="/about" component={About} />
    <Route path="/"><Home /></Route>
    <Route path="/chat" component={Chat} />
  </div>
  <p>McDonalds</p>
</Router>
