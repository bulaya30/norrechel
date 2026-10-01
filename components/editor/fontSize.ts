import { TextStyle } from "@tiptap/extension-text-style";

export const FONT_SIZES = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
] as const;

export type FontSize = (typeof FONT_SIZES)[number];

export const DEFAULT_FONT_SIZE: FontSize = "12px";

const FontSize = TextStyle.extend({
  name: "textStyle",

  addAttributes() {
    return {
      ...this.parent?.(),

      fontSize: {
        default: null,

        parseHTML: (element) => {
          const value = element.style.fontSize;

          return FONT_SIZES.includes(value as FontSize)
            ? value
            : null;
        },

        renderHTML: (attributes) => {
          if (!attributes.fontSize) {
            return {};
          }

          return {
            style: `font-size: ${attributes.fontSize}`,
          };
        },
      },
    };
  },
});

export default FontSize;