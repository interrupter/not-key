<script>
  import {Elements} from 'not-bulma';
  const UICommon = {Elements};
  
  import {
    createEventDispatcher, onMount
  } from 'svelte';
  let dispatch = createEventDispatcher();

  /**
   * @typedef {Object} Props
   * @property {boolean} [inputStarted]
   * @property {any} [value]
   * @property {string} [placeholder]
   * @property {string} [fieldname]
   * @property {number} [rows]
   * @property {boolean} [required]
   * @property {boolean} [readonly]
   * @property {boolean} [valid]
   * @property {boolean} [validated]
   * @property {boolean} [errors]
   * @property {boolean} [formErrors]
   * @property {boolean} [formLevelError]
   */

  /** @type {Props} */
  let {
    inputStarted = $bindable(false),
    value = $bindable([]),
    placeholder = 'List of urls',
    fieldname = 'list-of-urls',
    rows = 10,
    required = true,
    readonly = false,
    valid = true,
    validated = false,
    errors = false,
    formErrors = false,
    formLevelError = false
  } = $props();

  let allErrors = $derived([].concat(errors?errors:[], formErrors?formErrors:[]));
  let helper = $derived(allErrors?allErrors.join(', '): placeholder);
  let invalid = ($derived((valid===false) || (formLevelError)));
  let validationClasses = $derived((valid===true || !inputStarted)?UICommon.CLASS_OK:UICommon.CLASS_ERR);

  let listText = $state('');

  onMount(()=>{
    listText = value.join("\n");
  });

  function onBlur(ev){
    value = listText.split("\n");
    let data = {
      field: fieldname,
      value
    };
    inputStarted = true;
    dispatch('change', data);
    return true;
  }

  function onInput(ev){
    value = listText.split("\n");
    let data = {
      field: fieldname,
      value
    };
    inputStarted = true;
    dispatch('change', data);
    return true;
  }
</script>

<div class="control">
  <textarea
    id="form-field-listOfUrls-{fieldname}"
    name={fieldname}
    bind:value={listText}
    class="textarea {validationClasses}"
    {readonly}
    disabled={readonly}
    invalid="{invalid}"
    required={required}
    onchange={onBlur} oninput={onInput}
    {rows}
    placeholder="{placeholder}"
    aria-controls="input-field-helper-{fieldname}" aria-describedby="input-field-helper-{fieldname}"
    ></textarea>
    {#if validated === true }
    <span class="icon is-small is-right">
      {#if valid === true }
      <i class="fas fa-check"></i>
      {:else if (valid === false) }
      <i class="fas fa-exclamation-triangle"></i>
      {/if}
    </span>
    {/if}
</div>
<p class="help {validationClasses}" id="input-field-helper-{fieldname}">
  {#if !(validated && valid) && (inputStarted) }
  {helper}
  {:else}&nbsp;{/if}
</p>
