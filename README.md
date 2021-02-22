# Vue-Auth0

Vue3 Auth0 is a vu3 plugin, which provide wrapper for Auth0 library authentification with Typescript, old plugin definition or composition-api plugin with provide/inject and reactive

## Installation

Use the package manager [yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/) to install vue-auth0.

```bash
npm i @xtiannyeto/vue-auth0
yarn add @xtiannyeto/vue-auth0
```

## Usage  

### Configuration

The project needs to be configured with your Auth0 domain and client ID in order for the authentication flow to work.

To do this, first copy auth_config.json.example into a new file in the same folder called auth_config.json, and replace the values within with your own Auth0 application credentials:

```json
{
  "domain": "<YOUR AUTH0 DOMAIN>",
  "clientId": "<YOUR AUTH0 CLIENT ID>"
}
```
form more explanation on how to configure auth0 take a look on [auth0-spa](https://auth0.com/docs/quickstart/spa/vuejs)
### Vue2 approach
In main.ts


```typescript
main.ts

import authConfig from '../auth_config.json';
import { AuthPluginOption, installAuth0 } from './auth/AuthPlugin';

const config = {
  options: authConfig,
  callbackRedirect: (appState: any) => {
    router.push(appState && appState.targetUrl ? appState.targetUrl : '/');
  }
} as AuthPluginOption;


const app = createApp(App)
  .use(...)
  .use(....);

installAuth0(config).then((auth: any) => {
  app.use(auth).mount('#app');
})
```

In component

```html
<template>
   <button @click.prevent="login"></button>
   <div>
   <img :src="$auth.user.value.picture" alt=""/>
      <p>{{ $auth.user.value.email }}</p>
      <p>{{ $auth.user.value.name }}</p>
   </div>
</template>
```
```typescript
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'user',
  methods: {
    async login() {
      this.$auth.loginWithRedirect();
    }
  }
});
```

use in composition-api
```typescript
import { defineComponent, ref } from 'vue';
import { AuthPlugin } from './auth/AuthPlugin';

export default defineComponent({
  name: 'user',
  setup() {
    const auth: AuthPlugin =  inject('auth');
    .....
  }
});
```

### Vue3 approach
main.ts

```typescript
createApp(App)
  .use(...)
  .use(....)
  .mount('#app');

```
app.vue


```typescript
import { defineComponent } from 'vue';
import router from './router';
import authConfig from '../auth_config.json';
import { AuthPluginOption, provideAuth0 } from '@/auth/AuthPlugin';


export default defineComponent({
  name: 'App',
  setup() {
    const config = {
      options: authConfig,
      callbackRedirect: (appState: any) => {
        router.push(appState && appState.targetUrl ? appState.targetUrl : '/');
      }
    } as AuthPluginOption;
    provideAuth0(config);
  }
});
```

Component.vue


```typescript
import { defineComponent, Ref } from 'vue';
import { AuthPlugin, useAuth0 } from '@/auth/AuthPlugin';
export default defineComponent({
  name: 'xxxx',
  setup() {
    const auth: Ref<AuthPlugin> = useAuth0();
    return { auth };
  },
  methods: {
    async login() {
      await this.auth.loginWithRedirect();
    }
  }
});
```
provideAuth0 is async so check the inject before using it.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please make sure to update tests as appropriate.

## Credits
[lstyles](https://github.com/lstyles/vue3-auth0-sample), [auth0-sample](https://github.com/auth0-samples/auth0-vue-samples/tree/master/01-Login)


## License
[MIT](https://choosealicense.com/licenses/mit/)
