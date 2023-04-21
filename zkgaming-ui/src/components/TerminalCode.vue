<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TerminalCode",
  props: {
    message: {
      type: String,
    },
  },
  methods: {
    // onCopy: function (e) {
    //   alert('You just copied: ' + e.text)
    // },
    // onError: function (e) {
    //   alert('Failed to copy texts')
    // }
    clicked(event) {
      event.preventDefault();
      this.$copyText(this.message);
      this.$emit('onClose')
    },
  },
});
</script>

<template>
  <div>
    <el-dialog :model-value="!!message" title="Bash" @close="() => {this.$emit('onClose')}">
      <code>{{ message }}</code>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            class="bg-amber-500 hover:bg-amber-500/50 hover:border-amber-500/50 border-amber-500"
            @click="clicked"
          >
            Copy
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
