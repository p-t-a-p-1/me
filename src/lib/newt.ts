import { createClient } from "newt-client-js";

export interface Tag {
  _id: string;
  name: string;
  slug: string;
}

export interface Article {
  title: string;
  url: string;
  slug: string;
  meta: {
    title: string;
    description: string;
    ogImage: {
      src: string;
    };
  };
  body: string;
  author: string;
  categories: string[];
  emoji: {
    type: string;
    value: string;
  };
  pDate: string;
  tags: Tag[];
  thumbnail: {
    src: string;
  };
}

export const newtClient = createClient({
  spaceUid: import.meta.env.NEWT_SPACE_UID,
  token: import.meta.env.NEWT_CDN_API_TOKEN,
  apiType: "cdn",
});
