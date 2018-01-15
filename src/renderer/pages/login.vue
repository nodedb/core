<template lang="jade">
  div
    v-toolbar(dark color="primary")
      v-toolbar-title @todo
    v-card-text
      v-alert(
        v-if="err",
        color="error",
        icon="warning",
        value="true",
        v-html="$t('errors:CONNECTION', { message: err.message })"
      )

      div(v-if="!loaded")
        v-progress-linear
      div(v-else)
        v-alert(
          v-if="drivers.length === 0",
          icon="priority_high",
          color="warning",
          value="true"
        ) {{ $t('errors:NO_DRIVERS_INSTALLED') }}

        v-form(
          v-else,
          ref="form",
          lazy-validation
        )
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
            :enter="login",
            :form="loginForm",
            :input="model.connection"
          )

    v-card-actions(v-if="loaded")
      v-spacer
      v-btn(
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

  /* Files */
  import logger from '../lib/logger';
  import loginForm from '../components/login.vue';

  export default {

    name: 'login',

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

        /* Add in the connect name */
        this.loginForm.unshift({
          label: 'CONNECTION_NAME',
          key: 'connectionName',
          default: this.$i18n.t('connection:DEFAULT_CONNECTION_NAME', {
            driver: this.active.name,
            number: 1, // @todo
          }),
          type: 'text',
          required: true,
        });

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
        if (!this.$refs.form.validate()) {
          return false;
        }

        const model = {
          connection: this.model.connection,
          name: this.model.driver,
        };

        logger('trace', 'New connection attempt', model);

        return this.active.setConnection(this.model.connection)
          .connect()
          .then(() => {
            logger('trace', 'Connection succeeded', model);

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
            logger('warn', 'Connection failed', model);

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
