import { nestable } from '~/schema/component-type';
import { blocks } from '~/schema/field-type';

export default nestable({
  name: 'section',
  display_name: 'Section',
  folder: 'layouts',
  schema: [
    blocks({
      name: 'body',
      allowed_folders: [
        'typography',
      ],
    }),
  ],
});
