<template>
<!--    
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
-->
    <div class="flex ffc gap10 aifs p10">
      <div class="flex ffc gap10">
        <div class="flex aic gap10">
          <input type="text" v-model="repositories.git_user">
          <button @click="getRepoUser" class="accept">Репозитории</button>
          <button @click="getMessageToken" class="secondary">API_token_GET</button>
          <button @click="getCommentsUserOAuth" class="deny">OAuth_GraphQL</button>
          <a :href="authUrl">API_OAuth</a>
          <button @click="login">Login with GitHub</button>
        </div>
        <div 
          v-for="(repo, i) in repositories.repo_user" :key="`repo_${i}`">
          <div class="flex gap10 p5 aic" :style="repo.open_issues != 0?'background:orange;':''">
            <div class="t150">{{repo.name}}</div>
            <div class="t70">Проблем: {{repo.open_issues}}</div>
            <div></div>
            <button @click="getIssuesUser(repo.name)" v-if="repo.open_issues != 0" class="accept">Показать</button>
            <button @click="getMessageUser(repo.name)" v-if="repo.open_issues != 0" class="accept">GraphQL</button>
          </div>
          <div v-for="(issue,i) in repositories.issues_user" :key="`issue_${i}`" class="flex gap10 p5 aic">
            <div v-if="repo.name == issue.name">
              <div class="t150">{{issue.title}}</div>
              <div class="w100">{{issue.body}}</div>
              <div class="t50">{{issue.comments}}</div>
              <div @click="getCommentsUser(repo.name, issue.number)" v-if="issue.number != 0" class="pointer">👁️</div>
              <div @click="setCommentsUser()" v-if="issue.number != 0" class="pointer">✍️</div>
            </div>
          </div>
        </div>
        <div @click="setCommentsUser()" class="pointer">✍️</div>
        <div>{{issues}}</div>
      </div>
    </div>
</template>

<script>
import Menu from '@/components/Menu'

  export default {
    components: {
      Menu
    },
    data() {
      return {
        //clientId: 'db0b43c29907d29e8996',
        //client_secret: '060c3f5d8ef6838891d806da47e835f8ba1b464e',
        repositories:{
					git_user:'ikv1980',
					repo_user: '',
					issues_user: '',
					message: '',
				},
				temp:'',
				issues:''
      }
    },
    computed: {
      authUrl(){
        const clientId = 'db0b43c29907d29e8996';
        const redirectUri = 'http://localhost:3000/callback';
        const scope = "read:user";
        return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;
      }
    },
    methods: {
      //Работа с GraphQL GitHub ------------------------------------------------------------------------
      // Документация по объектам  GraphQL: https://docs.github.com/ru/graphql/reference

      // Получение ВСЕХ проблем с комментариями (TOKEN)
      getMessageToken(){
        console.log('getMessageToken');
        const url = 'https://api.github.com/graphql';

        const query = `
        query { 
          user(login: "${this.repositories.git_user}") { 
            issues(last: 10, orderBy: {field: CREATED_AT, direction: ASC}){
              nodes{
                id,
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
            'Authorization': `Bearer ${process.env.PERSONAL_TOKEN}`
          },
          body: JSON.stringify({ query: query })
        })
        .then(response => response.json())
        .then(data => {
          this.issues = data.data.user.issues.nodes;
          console.log(this.issues);
        })
        .catch(error => console.error(error));
      },
      // Получение проблем репозитория с комментариями (TOKEN)
      getMessageUser(repo_name){
        console.log('getMessageUser');
        const url = 'https://api.github.com/graphql';

        const query = `
        query {
          repository(owner:"${this.repositories.git_user}", name:"${repo_name}") {
            issues(last: 10, orderBy: {field: CREATED_AT, direction: ASC}, states:OPEN){
              nodes{
                id,
                title, 
                body,
                createdAt,
                closedAt,
                comments(last: 10) {
                  nodes {
                    author {
                      login
                    }
                    body,
                    createdAt
                  }
                }
              },
              edges {
                node {
                  title
                  url
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
            'Authorization': `Bearer ${process.env.PERSONAL_TOKEN}`
          },
          body: JSON.stringify({ query: query })
        })
        .then(response => response.json())
        .then(data => {
          console.log('ОТВЕТ GET: ', data);
          this.issues = data.data.repository.issues.nodes;
        })
        .catch(error => console.error(error));
      },
      // Добавление сообщения к проблеме (TOKEN)
      setCommentsUser(){
        console.log('setCommentsUser');
        const url = 'https://api.github.com/graphql';

        // Запрос для получения id  проблемы. В принципе не нужен, так как мы его получаем, когда тащим все сообщения с GitHub
        let issue_id = 'I_kwDOIeC8cs5uW2pQ';
        let text = `Тестовое сообщение с временем ${Date()}`; 

        const query = `
        mutation {
          addComment(input:{subjectId:"${issue_id}",body:"${text}"}) {
            subject {
              id
            }
          }
        }
        `
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.PERSONAL_TOKEN}`
          },
          body: JSON.stringify({ query: query })
        })
        .then(response => response.json())
        .then(data => {
          console.log('ОТВЕТ SET: ', data);
        })
        .catch(error => console.error(error));
      },
      // Получение репозитариев (of user) без авторизации(SEARCH) 
      getRepoUser(){
        console.log('getRepoUser');
        this.repositories.issues_user = '';
        const query_String = 'q=' + encodeURIComponent(`user:${this.repositories.git_user}`);
        fetch(`https://api.github.com/search/repositories?${query_String}`)
        .then(response => response.json())
        .then(data => {
          // Просто вывод всех данных
          this.repositories.repo_user = data.items;
          this.repositories.repo_user.sort((a, b) => a.open_issues < b.open_issues ? 1 : -1);
          console.log(this.repositories.repo_user);
        })
        .catch(error => console.error(error));
      },
      // Получение проблем (of user, repo) без авторизации(SEARCH)
      getIssuesUser(repo_name){
        console.log('getIssuesUser');
        fetch(`https://api.github.com/repos/${this.repositories.git_user}/${repo_name}/issues`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          this.repositories.issues_user = data.map(item=>{
            return {
              name: repo_name,
              number: item.number,
              title: item.title,
              body: item.body,
              comments: item.comments
            };
          });
        })
        .catch(error => console.error(error));
      },
      // Получение комментариев (of user, repo, issue) без авторизации(SEARCH)
      getCommentsUser(repo_name, issue_number){
        console.log('getCommentsUser');
        fetch(`https://api.github.com/repos/${this.repositories.git_user}/${repo_name}/issues/${issue_number}/comments`)
        .then(response => response.json())
        .then(data => {
          const список = data.map(item => item.body);
          console.log(список);
        })
        .catch(error => console.error(error));
        // fetch('https://api.github.com/repos/owner/repo/issues/номер_issue/comments')
        // Замените "owner" на имя пользователя владельца репозитория, "repo" на имя репозитория, а "номер_issue" на номер Issue, который вы хотите исследовать. Вы получите список комментариев, связанных с этим Issue. Список будет сохранен в переменной список и отображен в консоли.
      },
      // Получение комментариев (GraphQL)
      getCommentsUserOAuth(){
        const client_id = 'db0b43c29907d29e8996';
        const query = `
        query {
          viewer {
          repositories(first: 10) {
            nodes {
            name
            }
          }
          }
        }
        `;

        fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${client_id}`
        },
        body: JSON.stringify({
          query
        })
        })
        .then(response => response.json())
        .then(data => {
        // const список = data.data.viewer.repositories.nodes.map(item => item.name);
        console.log(data);
        })
        .catch(error => console.error(error));
      },

      async login() {
        
        // $auth.loginWith('github');

        console.log('Переменные окружения');
        console.log(process.env.CLIENT_ID);
        console.log(process.env.URL_AUTORIZE);
        console.log(process.env.HOMEPAGE_URL);
        console.log(process.env.PERSONAL_TOKEN);

      // const { data } = await this.$auth.loginWith('github')
      // const accessToken = data.access_token
      // localStorage.setItem('accessToken', accessToken)
      // this.$router.push('/')
    }




















    }
  }
</script>