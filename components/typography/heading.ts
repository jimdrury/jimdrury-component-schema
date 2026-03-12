import { nestable } from '~/schema/component-type';
import { text } from '~/schema/field-type';

export default nestable({
  name: 'heading',
  display_name: 'Heading',
  folder: 'typography',
  schema: [
    text({ name: 'text', required: true }),
  ],
});
