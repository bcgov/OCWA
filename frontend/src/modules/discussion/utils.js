import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';

export const contentTransformerProvider = schema =>
  new MarkdownTransformer(schema);

export default {
  contentTransformerProvider,
};
