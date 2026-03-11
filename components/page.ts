import { contentType } from "~/schema/component-type";
import { 
    blocks,
    tab,
    text,
} from "~/schema/field-type";

export default contentType({
    name: 'page',
    display_name: 'Page',
    folder: 'content',
    schema: [
        blocks({
            name: 'body',
        }),
    ],
});