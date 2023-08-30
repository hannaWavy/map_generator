<template>
    <input type="text">
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
    name: 'FormInput',
    className: 'FormInput',
    props: {
        label: {
            type: String,
            default: '',
        },
        placeholder: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'text',
            validator(value: string) {
                return [
                    'textarea',
                    'text',
                    'number',
                    'tel',
                    'email',
                    'password',
                    'search',
                    'date',
                    'time',
                ].includes(value);
            },
        },
        formType: {
            type: String,
            default: '',
        },
        model: {
            type: String,
            default: '',
        },
        hasError: {
            type: Boolean,
            default: false,
        },
        rules: {
            type: Array,
            default: () => [],
        },
    },
    emits: ['update:model'],
    setup(props, { emit }) {
        const message = computed({
            get: () => props.model,
            set: (value) => emit('update:model', value),
        });

        return {
            message,
        };
    },
});
</script>