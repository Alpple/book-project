<template>
  <svg
      :width="size" :height="size"
       viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11879">
    <path
        :fill="color"
        d="M192.608008 1023.936a192 192 0 0 1-192-192v-640a192 192 0 0 1 192-192h383.296a64 64 0 0 1 0 128H192.608008a64 64 0 0 0-64 64v640a64 64 0 0 0 64 64h383.296a64 64 0 0 1 0 128z m544.896-289.6a64 64 0 0 1 0-90.432L805.280008 576H384.352008a64 64 0 1 1 0-128h420.928l-82.688-82.816a64 64 0 0 1 90.368-90.496l192 192a64.576 64.576 0 0 1 13.76 69.824 65.6 65.6 0 0 1-13.76 20.672l-176.896 177.152a64 64 0 0 1-90.368 0z"
        fill="#8F9BB2" p-id="11880"></path>
  </svg>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: '23px'
  },
  color: {
    type: String,
    default: () => 'currentColor',
    required: false
  },
})
</script>
