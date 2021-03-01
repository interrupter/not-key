<script>

  import {onMount} from 'svelte';
  export let value        = [];
  export let textVersion  = '';
  export let readonly     = true;

  onMount(()=>{
    textVersion = value.join("\n");
  });

  $: value = textVersion.split("\n");

</script>


<div class="control">
  <textarea name="name" {readonly} disabled={readonly} rows="8" cols="80" bind:value={textVersion}></textarea>
</div>
