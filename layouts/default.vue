<template>
  <v-app>
    <div class="full-container">
      <header>
        <h1>
          <a href="/">
            <img title="COG-UK Sample Metadata Uploader" src="/images/cog-uk-metadata.png">
          </a>
        </h1>
        <nav>
          <a
            href="https://docs.cog-uk.io/metadata/"
            target="_blank"
            class="button--grey"
          >
            Help
          </a>
        </nav>
      </header>
      <main>
        <nuxt />
      </main>
      <footer>
        <span>
          Logged in as <strong>{{ $auth.user.username }}</strong>
        </span>
        <ul>
          <li>
            <a href="mailto:metadata-support@cog-uk.io">metadata-support@cog-uk.io</a>
          </li>
          <li>
            <a href="/logout">
              Log out
            </a>
          </li>
        </ul>
      </footer>
    </div>
  </v-app>
</template>

<script>
export default {
};
</script>

<style scoped>
.v-application >>> .v-application--wrap {
  display: unset;
}
.theme--light.v-application {
  background: unset;
}
.full-container {
  /* position: fixed; */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  /* overflow-x: hidden; */
  /* overflow-y: auto; */
  /* height: 100vh; */
}

header {
  width: 100%;
  height: 64px;
  min-height: 64px;
  padding: 0 8px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
header h1 {
  margin-top: 8px;
  font-size: 16px;
}
header nav {
  display: none;
}
header h1 a {
  align-items: center;
  color: #0060df;
  display: flex;
  text-decoration: none;
}
header img {
  height: 16px;
  margin-right: 8px;
}

main {
  display: flex;
  position: relative;
  /* height: 100%; */
  /* flex-grow: 1; */
  /* flex: 1 1 0%; */
  align-self: center;
  align-items: flex-start;
  margin: auto;
  padding: 0;
  /* min-height: 20rem; */
  /* max-height: 36rem; */
  width: calc(100%);
  -moz-box-flex: 0;
  overflow: auto;
}

section {
  background-color: #fff;
  padding: 32px;
  width: 100%;
  /* overflow: hidden; */
  /* min-height: 100%; */
  /* height: 100%; */
  border: 0 solid #d7d7db;
  /* min-height: 32rem; */
  /* max-height: 38rem; */
  text-align: left;
}

footer {
  width: 100%;
  padding: 8px 32px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: .75rem;
  color: #4a4a4f;
  align-items: flex-start;
  font-weight: 500;
}
footer ul {
  justify-content: flex-end;
  align-items: flex-start;
  flex-direction: column;
  display: flex;
  user-select: none;
  list-style: none;
  margin: 0;
  padding: 0;
}
footer ul li {
  margin: .25rem 0;
}
footer ul li a {
  color: inherit;
  text-decoration: none;
  background-color: initial;
}

@media (min-width:768px) {
  header {
    padding: 0 32px;
    align-items: center;
  }
  header h1 {
    font-size: 24px;
    margin: unset;
  }
  header img {
    height: 32px;
  }
  main {
    max-width: 64rem;
  }
  section {
    margin: 24px;
    box-shadow: 0 12px 18px 2px rgba(34,0,51,.04),0 6px 22px 4px rgba(7,48,114,.12),0 6px 10px -4px rgba(14,13,26,.12);
    border-radius: 16px;
  }
  .full-container {
    min-height: 100vh;
  }
  header nav {
    display: unset;
  }
  footer {
    flex-direction: row;
    align-items: center;
  }
  footer ul {
    flex-direction: row;
    align-items: center;
  }
  footer ul li {
    margin: .5rem;
  }
}
</style>
