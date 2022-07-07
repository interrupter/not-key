<script>

    import UICommon from 'not-bulma/src/elements/common.js';
    import ErrorsList from 'not-bulma/src/elements/various/ui.errors.list.svelte';
    import {createEventDispatcher, onMount} from 'svelte';
    let dispatch = createEventDispatcher();
  
    export let inputStarted = false;
    export let value = {};
    export let placeholder = 'input some text here, please';
    export let fieldname = 'textarea';
    export let icon = false;
    export let rows = 10;
    export let required = true;
    export let readonly = false;
    export let disabled = false;
    export let valid = true;
    export let validated = false;
    export let errors = false;
    export let formErrors = false;
    export let formLevelError = false;
  
    $: iconClasses = (icon? ' has-icons-left ':'') + ' has-icons-right ';
    $: allErrors = [].concat(errors?errors:[], formErrors?formErrors:[]);
    $: showErrors = (!(validated && valid) && (inputStarted));
    $: invalid = ((valid===false) || (formLevelError));
    $: validationClasses = (valid===true || !inputStarted)?UICommon.CLASS_OK:UICommon.CLASS_ERR;
  
    function onBlur(ev){
        try{
            value = JSON.parse(editingValue);
            valid = true;
            errors = false;
            let data = {
                field: fieldname,
                value
            };
            inputStarted = true;
            dispatch('change', data);
            return true;
        }catch(e){
            valid = false;
            errors = ["JSON parsing error"];
        }
    }

    let editingValue = '';

    onMount(()=>{
        editingValue = JSON.stringify(value, null, 4);
    });
  
    $:readonlyValueStringified = JSON.stringify(value, null, 4);
  
  </script>
  
    <div class="control {iconClasses}">
      {#if readonly }
      <pre>{readonlyValueStringified}</pre>
      {:else}
      <textarea
      id="form-field-textarea-{fieldname}"
      {invalid}
      {disabled}
      {required} {readonly}
      on:blur={onBlur}
      class="textarea {validationClasses}"
      bind:value={editingValue}
      name="{fieldname}"
      placeholder="{placeholder}" rows="{rows}"
      aria-controls="input-field-helper-{fieldname}" aria-describedby="input-field-helper-{fieldname}"
      ></textarea>
      {#if icon }
      <span class="icon is-small is-left"><i class="fas fa-{icon}"></i></span>
      {/if}
      {#if validated === true }
      <span class="icon is-small is-right">
        {#if valid === true }
        <i class="fas fa-check"></i>
        {:else if (valid === false) }
        <i class="fas fa-exclamation-triangle"></i>
        {/if}
      </span>
      {/if}
      {/if}
    </div>
    <ErrorsList
      bind:errors={allErrors}
      bind:show={showErrors}
      bind:classes={validationClasses}
      id="input-field-helper-{fieldname}"
      />
  