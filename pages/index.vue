<template>
  <div class="row justify-content-md-center p10">
    <div class="input-group mb-3">
        <span class="input-group-text border-success">repository name</span>
        <input type="text" class="border-success" v-model="repo_name" placeholder="Название репозитория">
        <button @click="getRepoName" type="button" class="btn btn-success">Искать</button>
    </div>

    <div class="flex ffc gap5">
      <div class="flex ffc gap10">
        <div class="flex gap10">
          <input type="text" v-model="repositories.git_user" placeholder="ikv1980">
          <button @click="getRepoUser" type="button" class="btn btn-success">Репозитории по имени пользователя</button>          
        </div>
        <div class="flex ffc gap10">
          <button @click="getMessageToken" type="button" class="btn btn-info">GraphQL. Проблемы и комментарии при помощи IKV1980_TOKEN</button>









          <!-- Ниже метод получения данных при помощи токена пользователя. По идее не нужен, Так как можно прочитать и без разрешений. Но если вдруг это какой-то приватный репозиторий.... -->
          <button @click="getCommentsUserOAuth" class="deny">OAuth_GraphQ. Комментарии при помощи USER_TOKEN (HE РЕШЕНА)</button>
          <a :href="authUrl">API_OAuth</a>
          <button @click="codeAccessToken" class="deny">codeAccessToken</button>
          <button @click="$auth.loginWith('github')">ВХОД</button>
        </div>


      </div>
      <div v-for="(repo, i) in repositories.repo_user" :key="`repo_${i}`" class="border border-success">
        <div class="flex gap10 p5 aic" :style="repo.open_issues != 0?'background:orange;':''">
          <div class="t20">{{i + 1}}</div>
          <div class="t150">{{repo.name}}</div>
          <div class="t70">Проблем: {{repo.open_issues}}</div>
          <div></div>
          <button @click="getIssuesUser(repo)" v-if="repo.open_issues != 0" type="button" class="btn btn-primary">Показать проблемы</button>
          <button @click="getMessageUser(repo.name)" v-if="repo.open_issues != 0" class="accept">GraphQL</button>
        </div>
        <div v-for="(issue, j) in repositories.issues_user" :key="`issue_${j}`">
          <div v-if="repo.name == issue.name" class="flex gap10 p5 aic">
            <div class="t20">{{i + 1}}.{{j + 1}}</div>
            <div class="t150">{{issue.title}}</div>
            <div class="w100">{{issue.body}}</div>
            <div class="t50">{{issue.comments}}</div>
            <div @click="getCommentsUser(repo.name, issue.number)" v-if="issue.number != 0" class="pointer" title="Показать комментарии">👁️</div>
            <div @click="setCommentsUser()" v-if="issue.number != 0" class="pointer" title="Добавить комментарий">✍️</div>
          </div>

        </div>
      </div>
      <div @click="setCommentsUser()" class="pointer">✍️</div>
      <div>{{issues}}</div>
    </div>
  </div>
</template>

<script>

  export default {
    layout: 'default',
    components: {
    },
    data() {
      return {
        repositories:{
					// git_user:'cute',
          git_user:'ikv1980',
					repo_user: '',
					issues_user: '',
					message: '',
				},
				// temp:'',
				issues:'',
        repo_name:'',
      }
    },
    computed: {
      authUrl(){
        return `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=${encodeURIComponent(process.env.SCOPE)}&response_type=token`;
      }
    },
    methods: {
      //Работа с GraphQL GitHub ------------------------------------------------------------------------
      // Документация по объектам  GraphQL: https://docs.github.com/ru/graphql/reference

      // Получение ВСЕХ проблем с комментариями (TOKEN)
      getMessageToken(){
        console.log('getMessageToken');
        this.repositories.repo_user = '';
        this.repositories.issues_user = '';
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
            'Authorization': `Bearer ${process.env.GITHUB_PERSONAL_TOKEN}`
          },
          body: JSON.stringify({ query: query })
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          this.issues = data.data.user.issues.nodes;
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
            'Authorization': `Bearer ${process.env.GITHUB_PERSONAL_TOKEN}`
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
        const token_user = localStorage.getItem('access_token');
        console.log(token_user);
        const url = 'https://api.github.com/graphql';

        // Запрос для получения id  проблемы. В принципе не нужен, так как мы его получаем, когда тащим все сообщения с GitHub
        let issue_id = 'I_kwDOIeC8cs5uW2pQ';
        let text = `!!!!Тестовое сообщение с временем ${Date()}`; 

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
            'Authorization': `Bearer ${token_user}`
          },
          body: JSON.stringify({ query: query })
        })
        .then(response => response.json())
        .then(data => {
          console.log('ОТВЕТ SET: ', data);
        })
        .catch(error => console.error(error));
      },
      // Получение репозитариев (of user) без авторизации(SEARCH).
      getRepoUser(){
        console.log('getRepoUser');
        this.repositories.repo_user = '';
        this.repositories.issues_user = '';
        let count = 20;

        const query_String = 'q=' + encodeURIComponent(`user:${this.repositories.git_user}`) + '+in:name&per_page=' + encodeURIComponent(`${count}`);
        fetch(`https://api.github.com/search/repositories?${query_String}`)
        .then(response => response.json())
        .then(data => {
          if(data.hasOwnProperty('errors')){
            data.errors.forEach((element, i) => {
              console.log(`ERROR ${i+1}: ${element.message}`);
            });          
          } else {
            console.log(data);
            this.repositories.repo_user = data.items;
            this.repositories.repo_user.sort((a, b) => a.open_issues < b.open_issues ? 1 : -1);
          }
        })
        .catch(error => console.error(error));
      },
      // Получение репозитариев (of repo_name) без авторизации(SEARCH) 
      getRepoName(){
        console.log('getRepoName');
        this.repositories.issues_user = '';
        let count = 15;

        const query_String = 'q=' + encodeURIComponent(`${this.repo_name}`) + '+in:name&per_page=' + encodeURIComponent(`${count}`);
        fetch(`https://api.github.com/search/repositories?${query_String}`)
        .then(response => response.json())
        .then(data => {
          if(data.hasOwnProperty('errors')){
            data.errors.forEach((element, i) => {
              console.log(`ERROR ${i+1}: ${element.message}`);
            });          
          } else {
          
          this.repositories.repo_user = data.items;
          this.repositories.repo_user.sort((a, b) => a.open_issues < b.open_issues ? 1 : -1);
          }
        })
        .catch(error => console.error(error));
      },
      // Получение проблем (of user, repo) без авторизации(SEARCH)
      getIssuesUser(repo){
        console.log('getIssuesUser');
        if(repo.archived){
          this.repositories.issues_user = [{
            name: repo.name,
            number: 0,
            title: '',
            body: 'Репозиторий находится в архиве. Просмотр не возможен.',
            comments: '',
          }];
          return 0;
        }
        
        fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/issues`)
        .then(response => response.json())
        .then(data => {
          this.repositories.issues_user = data.map(item=>{
            return {
              name: repo.name,
              number: item.number,
              title: item.title,
              body: item.body,
              comments: item.comments,
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
          const comment = data.map(item => item.body);
          console.log(comment);
        })
        .catch(error => console.error(error));
        // fetch('https://api.github.com/repos/owner/repo/issues/номер_issue/comments')
        // Замените "owner" на имя пользователя владельца репозитория, "repo" на имя репозитория, а "номер_issue" на номер Issue, который вы хотите исследовать. Вы получите список комментариев, связанных с этим Issue. Список будет сохранен в переменной список и отображен в консоли.
      },
      // Получение комментариев (GraphQL)
      getCommentsUserOAuth(){
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
          'Authorization': `Bearer ${process.env.GITHUB_CLIENT_ID}`
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






      
      async codeAccessToken() {
        const response = await fetch('/api/auth/github')
        console.log(response);


        // app.get('/callback', async (req, res) => {
        //   const code = req.query.code;

        //   try {
        //     const response = await axios.post('https://github.com/login/oauth/access_token', {
        //       client_id: clientId,
        //       client_secret: 'your_client_secret',
        //       code: code,
        //       redirect_uri: redirectUri
        //     }, {
        //       headers: {
        //         Accept: 'application/json'
        //       }
        //     });

        //     const accessToken = response.data.access_token;
        //     console.log(accessToken);
        //   } catch (error) {
        //     console.error(error);
        //   }
        // });
















        // const data = await response.json()
        // window.location.href = data.url
        // $auth.loginWith('github');

        // console.log('Переменные окружения');
        // console.log(process.env.GITHUB_CLIENT_ID);
        // console.log(process.env.URL_AUTORIZE);
        // console.log(process.env.HOMEPAGE_URL);
        // console.log(process.env.GITHUB_PERSONAL_TOKEN);

      // const { data } = await this.$auth.loginWith('github')
      // const accessToken = data.access_token
      // localStorage.setItem('accessToken', accessToken)
      // this.$router.push('/')
    }




















    }
  }
</script>