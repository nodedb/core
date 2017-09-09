<template lang="jade">
  .query_input {{ value }}
</template>

<script>
  /**
   * editor
   */

  /* Node modules */

  /* Third-party modules */
  import ace from 'brace';

  /* Files */

  export default {

    data () {
      return {
        editor: null,
      };
    },

    mounted () {
      const theme = this.theme || 'chrome';

      if (!this.lang) {
        throw new Error('Query language must be set');
      }

      try {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        require(`brace/mode/${this.lang}`);
      } catch (err) {
        throw new Error(`Unknown query language: ${this.lang}`);
      }
      // eslint-disable-next-line global-require, import/no-dynamic-require
      require(`brace/theme/${theme}`);

      this.editor = ace.edit(this.$el);

      this.editor.$blockScrolling = Infinity;
      this.editor.getSession().setMode(`ace/mode/${this.lang}`);
      this.editor.setTheme(`ace/theme/${theme}`);

      this.editor.on('change', () => {
        const value = this.editor.getValue();

        this.$emit('input', value);
      });
    },

    props: {
      lang: String,
      theme: String,
      value: {
        required: true,
        type: String,
      },
    },

  };
</script>
