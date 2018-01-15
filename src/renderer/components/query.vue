<template lang="jade">
  div
    .query_input(
      :class="'query_input--' + lang",
      :style="{ height: height ? px(height) : '100%', width: width ? px(width) : '100%' }",
      @keyup="execute"
    )
    slot(name="buttons")
</template>

<script>
  /**
   * query
   */

  /* Node modules */

  /* Third-party modules */
  import ace from 'brace';

  /* Files */
  import logger from '../lib/logger';

  export default {

    name: 'query',

    data () {
      return {
        editor: null,
      };
    },

    methods: {
      createEditor () {
        const element = this.$el.getElementsByClassName('query_input')[0];
        this.editor = ace.edit(element);

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

        if (this.focus) {
          this.editor.focus();
        }

        logger('debug', 'New editor created', {
          lang: this.lang,
          theme: this.theme,
          value: this.value,
        });

        this.editor.on('change', () => {
          const cursor = this.editor.getCursorPosition();
          const query = this.editor.getValue();
          this.$emit('update:cursor', cursor);
          this.$emit('input', query);
        });
      },

      execute (event) {
        try {
          const valid = this.executeOn.find((target) => {
            const keys = Object.keys(target);

            return keys.every(key => target[key] === event[key]);
          });

          if (valid) {
            this.$emit('execute');
          }
        } catch (err) {
          throw new Error('Unable to process the execution event - check the executeOn property');
        }
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

      executeOn: {
        type: Array,
        default: () => [{
          /* F5 */
          keyCode: 116,
        }, {
          /* Ctrl + Enter */
          keyCode: 13,
          ctrlKey: true,
        }],
      },

      focus: {
        type: Boolean,
        default: true,
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

<style lang="scss" scoped>

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
