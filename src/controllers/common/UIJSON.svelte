<script>
  import { run } from 'svelte/legacy';


    import UICommon from 'not-bulma/src/elements/common.js';
    import ErrorsList from 'not-bulma/src/elements/various/ui.errors.list.svelte';
    import {createEventDispatcher, onMount} from 'svelte';
    let dispatch = createEventDispatcher();
  
  /**
   * @typedef {Object} Props
   * @property {boolean} [inputStarted]
   * @property {any} [value]
   * @property {string} [placeholder]
   * @property {string} [fieldname]
   * @property {boolean} [icon]
   * @property {number} [rows]
   * @property {boolean} [required]
   * @property {boolean} [readonly]
   * @property {boolean} [disabled]
   * @property {boolean} [valid]
   * @property {boolean} [validated]
   * @property {boolean} [errors]
   * @property {boolean} [formErrors]
   * @property {boolean} [formLevelError]
   */

  /** @type {Props} */
  let {
    inputStarted = $bindable(false),
    value = $bindable({}),
    placeholder = 'input some text here, please',
    fieldname = 'textarea',
    icon = false,
    rows = 10,
    required = true,
    readonly = false,
    disabled = false,
    valid = $bindable(true),
    validated = false,
    errors = $bindable(false),
    formErrors = false,
    formLevelError = false
  } = $props();
  
    let iconClasses = $derived((icon? ' has-icons-left ':'') + ' has-icons-right ');
    let allErrors;
  run(() => {
    allErrors = [].concat(errors?errors:[], formErrors?formErrors:[]);
  });
    let showErrors;
  run(() => {
    showErrors = (!(validated && valid) && (inputStarted));
  });
    let invalid = ($derived((valid===false) || (formLevelError)));
    let validationClasses;
  run(() => {
    validationClasses = (valid===true || !inputStarted)?UICommon.CLASS_OK:UICommon.CLASS_ERR;
  });
  
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

    let editingValue = $state('');

    onMount(()=>{
        editingValue = JSON.stringify(value, null, 4);
    });
  
    let readonlyValueStringified = $derived(JSON.stringify(value, null, 4));
  
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
      onblur={onBlur}
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
  