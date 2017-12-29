<template lang="jade">
  div.query_input(
    :class="'query_input--' + lang",
    :style="{ height: height ? px(height) : '100%', width: width ? px(width) : '100%' }"
  )
</template>

<script>
  /**
   * query
   */

  /* Node modules */

  /* Third-party modules */
  import ace from 'brace';

  /* Files */

  export default {

    name: 'query',

    data () {
      return {
        editor: null,
      };
    },

    methods: {
      createEditor () {
        this.editor = ace.edit(this.$el);

        try {
          // eslint-disable-next-line global-require, import/no-dynamic-require
          require(`brace/mode/${this.lang}`);
        } catch (err) {
          throw new Error(`Unknown query language: ${this.lang}`);
        }

        if (this.theme) {
          // eslint-disable-next-line global-require, import/no-dynamic-require
          require(`brace/theme/${this.theme}`);
          this.editor.setTheme(`ace/theme/${this.theme}`);
        }

        this.$emit('init', this.editor);

        this.editor.$blockScrolling = Infinity;
        this.editor.getSession().setMode(`ace/mode/${this.lang}`);
        this.editor.setShowPrintMargin(this.printMargin);
        this.editor.setFontSize(this.fontSize);
        this.editor.setValue(this.value, 1);

        if (this.cursor) {
          this.editor.moveCursorToPosition(this.cursor);
        }

        this.editor.on('change', () => {
          const cursor = this.editor.getCursorPosition();
          const query = this.editor.getValue();
          this.$emit('update:cursor', cursor);
          this.$emit('input', query);
        });
      },

      px (value) {
        if (/^\d*$/.test(value)) {
          return `${value}px`;
        }
        return value;
      },
    },

    mounted () {
      return this.createEditor();
    },

    props: {
      cursor: {
        type: Object,
      },

      fontSize: {
        type: Number,
        default: 14,
      },

      height: {
        type: Number,
      },

      lang: {
        type: String,
        default: 'sql',
      },

      printMargin: {
        type: Boolean,
        default: false,
      },

      theme: {
        type: String,
        default: 'monokai',
      },

      value: {
        required: true,
        type: String,
      },

      width: {
        type: Number,
      },
    },

    watch: {
      $route: 'createEditor',
    },

  };
</script>

<style lang="scss">

  .query_input {

    &.query_input--sql {

      .ace_keyword {
        text: {
          transform: uppercase;
        }
      }

    }

  }

</style>
