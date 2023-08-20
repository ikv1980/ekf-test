<template>
  <div></div>
</template>
  
  <script>
  import { $http } from '@nuxt/http';

  export default {
    async mounted() {
      // Проверка и получение code от GitHub
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('code')) {
          const code = urlParams.get('code');
          localStorage.setItem('code', code); // Удалить
          // Меняем code на access token
          this.exchangeCodeForToken(code);
          // Очистим лишнее в адресной строке
          // window.history.replaceState({}, '', process.env.HOMEPAGE_URL);
      }
    },
    methods: {
      // async exchangeCodeForToken_old(code) {
      //   try {
      //     const response = await fetch('https://github.com/login/oauth/access_token', {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify({
      //         client_id: process.env.GITHUB_CLIENT_ID,
      //         client_secret: process.env.GITHUB_CLIENT_SECRET,
      //         code: code,
      //         redirect_uri: process.env.HOMEPAGE_URL,
      //       }),
      //     });

      //     const data = await response.json();

      //     if (data.access_token) {
      //       localStorage.setItem('access_token', data.access_token);
      //     }
      //   } catch (error) {
      //     console.error('Ошибка обмена code на access_token', error);
      //   }
      // },
      // async exchangeCodeForToken(code) {
      //   try {
      //     const response = await $http.post('https://github.com/login/oauth/access_token', {
      //       client_id: process.env.GITHUB_CLIENT_ID,
      //       client_secret: process.env.GITHUB_CLIENT_SECRET,
      //       code: code,
      //       redirect_uri: process.env.HOMEPAGE_URL,
      //     });
  
      //     const accessToken = response.access_token;
      //     localStorage.setItem('access_token', accessToken);
      //     // Store the access token in localStorage or Vuex
      //   } catch (error) {
      //     console.error('Ошибка обмена code на access_token:', error);
      //     // Handle error
      //   }
      // },

      async exchangeCodeForToken(code) {
        const data_for_token = `client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`;
        console.log(data_for_token);
  
        var req = new XMLHttpRequest();
        req.open('POST', 'https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token', true);
        req.setRequestHeader('Accept', 'application/json');
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.send(data_for_token);
        req.onload = function() {
          if (req.status === 200) {
            const response = JSON.parse(req.responseText);
            console.log('Token: ', response);
            const accessToken = response.access_token;
            // Сохраняем токен в LocalStorage
            localStorage.setItem('access_token', accessToken);
          } else {
            console.error('Ошибка: ', req.statusText);
          }
        };
        // window.location.replace('/');
      }











      
    }
  }
  </script>  