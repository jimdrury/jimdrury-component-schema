import { contentType } from '~/schema/component-type';
import { blocks } from '~/schema/field-type';

export default contentType({
  name: 'page',
  display_name: 'Page',
  folder: 'pages',
  schema: [
    blocks({
      name: 'body',
      allowed_folders: ['layouts'],
    }),
  ],
});