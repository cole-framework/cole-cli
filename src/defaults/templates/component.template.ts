export const component = `
{{#each imports}}
{{render "import" this print_markers=print_markers print_jsdocs=print_jsdocs print_examples=print_examples}}
{{/each}}
{{#if print_markers}}/*__imports__*/{{/if}}

{{#each types}}
{{render this.type this print_markers=print_markers print_jsdocs=print_jsdocs print_examples=print_examples}}
{{/each}}
{{#if print_markers}}/*__types__*/{{/if}}

{{#each functions}}
{{render this.type this print_markers=print_markers print_jsdocs=print_jsdocs print_examples=print_examples}}
{{/each}}
{{#if print_markers}}/*__functions__*/{{/if}}

{{#each classes}}
{{render this.type this print_markers=print_markers print_jsdocs=print_jsdocs print_examples=print_examples}}
{{/each}}
{{#if print_markers}}/*__classes__*/{{/if}}
`;
