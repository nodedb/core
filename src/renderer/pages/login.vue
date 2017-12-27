<template lang="jade">
  v-layout(wrap row)
    v-flex(xs-12)
      h1 hello world

    v-flex(xs-12)
      v-alert(
        v-if="err",
        color="error",
        icon="warning",
        value="true",
        v-html="$t('errors:CONNECTION', { message: err.message })"
      )

      div(v-if="loaded")
        v-alert(
          v-if="drivers.length === 0"
          icon="priority_high",
          color="warning",
          value="true"
        ) no drivers installed

        v-form(v-else)
          v-select(
            :label="$t('forms:DRIVER_LABEL')",
            :items="drivers",
            item-avatar="logo",
            item-text="name",
            item-value="id",
            v-model="model.driver",
            single-line,
            bottom
          )
            template(
              slot="item",
              slot-scope="data"
            )
              v-list-tile-avatar
                img(
                  :src="data.item.logo || 'assets/img/logo.png'"
                )
              v-list-tile-content
                v-list-tile-title {{ data.item.name }}

          login-form(
            :form="loginForm",
            :input="model.connection"
          )

          .text-xs-centers
            v-btn(
              block,
              color="primary",
              @click="login"
            ) {{ $t('buttons:LOGIN') }}
</template>

<script>
  /**
   * login
   */

  /* Node modules */

  /* Third-party modules */
  import { remote } from 'electron';

  /* Files */
  import loginForm from '../components/login.vue';

  const { logger } = remote.app;

  export default {

    components: {
      loginForm,
    },

    created () {
      this.fetchData();
    },

    data () {
      return {
        active: null,
        drivers: [],
        err: null,
        loaded: false,
        loginForm: [],
        model: {
          connection: {},
          driver: null,
        },
      };
    },

    methods: {
      changeDriver (driver) {
        this.active = this.drivers.find(({ id }) => id === driver);

        this.loginForm = this.active.getLoginForm();

        this.model.connection = this.loginForm.reduce((result, item) => {
          result[item.key] = item.default || null;
          return result;
        }, {});
      },

      fetchData () {
        return this.$store.dispatch('drivers/loadAll')
          .then((drivers) => {
            this.loaded = true;
            this.drivers = drivers;

            if (this.drivers.length > 0) {
              this.model.driver = drivers[0].id;
            }
          });
      },

      login () {
        const model = {
          driver: this.model.driver,
          connection: this.model.connection,
        };

        logger.trigger('trace', 'New connection attempt', model);

        return this.active.connect(this.model.connection)
          .then(() => {
            logger.trigger('trace', 'Connection succeeded', model);

            return this.$store.dispatch('connections/save', model);
          })
          .then(id => this.$router.push({
            name: 'query',
            params: {
              id,
            },
          }))
          .catch((err) => {
            model.err = err;
            logger.trigger('warn', 'Connection failed', model);

            this.err = err;
          });
      },
    },

    watch: {
      $route: 'fetchData',
      'model.driver': 'changeDriver',
    },

  };
</script>
