<template lang="jade">
  div
    h1 hello world

    v-layout(row wrap)
      v-flex(xs4 offset-xs4)
        v-form(v-if="loaded")
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
                  :src="data.item.logo"
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
            console.log({
              drivers,
            });
          });
      },
    },

    watch: {
      $route: 'fetchData',
    },

  };
</script>
