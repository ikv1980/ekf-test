<template>
    <div class="row justify-content-md-center">
        <div class="col col-lg-6">
            <div class="input-group mb-3">
                <span class="input-group-text border-success" id="inputGroup-sizing-default">repository</span>
                <input type="text" class="form-control border-success" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                <button type="button" class="btn btn-success" @click="graphQL">Success</button>
            </div>
            <button @click="loginWithGitHub">Login with GitHub</button>
            <a :href="authUrl">Авторизоваться через GitHub</a>
        </div>
    </div>
</template>

<script>
  import Navbar from '@/components/Navbar'

  export default {
    components: {
      Navbar
    },
    data() {
      return {
        //clientId: '111',
      }
    },
    computed: {
      authUrl(){
        const clientId = 'db0b43c29907d29e8996';
        const scope = "read:user";
        return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${process.env.REDIRECT_URI}&scope=${scope}&response_type=token`;
      }
    },
    methods: {
      graphQL(){
        const token = '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'
        const url = 'https://api.github.com/graphql';

        const query = `
        query { 
        user(login: "ikv1980") { 
            issues(last: 10, orderBy: {field: CREATED_AT, direction: ASC}){
              nodes{
              title, 
              body, 
              closedAt,
                comments(last: 10) {
                  nodes {
                    author {
                    login
                    }
                  body
                  }
                }
              }
            }
          }
        }
        `
        fetch(url, {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ query: query })
        })
        .then(response => response.json())
        .then(data => console.log(data.data.user.issues))
        .catch(error => console.error(error));
      },
      async loginWithGitHub() {
        {
          console.log('loginWithGitHub');
          const scope = "read:user";
          document.location.href = (`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=${scope}&response_type=token`)
        }
      },
    }
  }
</script>