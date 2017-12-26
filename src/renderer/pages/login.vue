<template lang="jade">
  div
    h1 hello world

    v-layout(row wrap)
      v-flex(xs4 offset-xs4)
        div(v-if="loaded")
          div(v-if="drivers.length === 0") no drivers installed

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
</template>

<script>
  /**
   * login
   */

  /* Node modules */

  /* Third-party modules */

  /* Files */

  export default {

    created () {
      this.fetchData();
    },

    data () {
      return {
        drivers: [],
        loaded: false,
        model: {
          driver: null,
        },
      };
    },

    methods: {
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
    },

    watch: {
      $route: 'fetchData',
    },

  };
</script>
