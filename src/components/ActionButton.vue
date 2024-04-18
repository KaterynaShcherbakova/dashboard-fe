<template>
    <button :class="'button-basic' + ' ' + buttonClass" @click="emitAction">{{ buttonText }}</button>
</template>

<script>
import { actionButtonNames } from '@/utils/constants';

export default {
    props: {
        actionType: {
            type: String,
            required: true
        }
    },
    computed: {
        buttonText() {
            return actionButtonNames[this.actionType] || 'Action';
        },
        buttonClass() {
            return `button-${this.actionType}`;
        }
    },
    methods: {
        emitAction() {
            this.$emit('action', this.actionType);
        }
    }
}
</script>

<style lang="scss">
.button-basic {
    outline: none;
    border: 1px solid transparent;
    padding: 12px 36px;
    border-radius: 8px;
    color: white;
    transition: all 0.3s;
    cursor: pointer;
}

.button-start {
    background-color: green;

    &:hover {
        color: green;
        border: 1px solid green;
        background-color: white
    }
}

.button-stop {
    background-color: red;

    &:hover {
        color: red;
        border: 1px solid red;
        background-color: white
    }
}

.button-reset {
    background-color: orange;

    &:hover {
        color: orange;
        border: 1px solid orange;
        background-color: white
    }
}
</style>