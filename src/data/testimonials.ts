import { assetUrl } from "@/data/media-map";

/* Site media — resolved from Supabase Storage when VITE_MEDIA_BASE_URL is set. */
const v3 = { url: assetUrl("3.mp4") };
const v4 = { url: assetUrl("4.mp4") };
const v10 = { url: assetUrl("10.mp4") };
const v15 = { url: assetUrl("15.mp4") };
const v16 = { url: assetUrl("16.mp4") };
const v20 = { url: assetUrl("20.mp4") };
const v24 = { url: assetUrl("24.mp4") };
const v14 = { url: assetUrl("14.mp4") };
const v23 = { url: assetUrl("23.mp4") };
const v32 = { url: assetUrl("32.mp4") };
const v34 = { url: assetUrl("34.mp4") };
const v5 = { url: assetUrl("5.mp4") };
const v29 = { url: assetUrl("29.mp4") };
const v30 = { url: assetUrl("30.mp4") };
const v7 = { url: assetUrl("7.mp4") };
const v9 = { url: assetUrl("9.mp4") };
const v28 = { url: assetUrl("28.mp4") };
const v6 = { url: assetUrl("6.mp4") };
const v8 = { url: assetUrl("8.mp4") };
const v12 = { url: assetUrl("12.mp4") };
const v33 = { url: assetUrl("33.mp4") };
const v35 = { url: assetUrl("35.mp4") };
const v31 = { url: assetUrl("31.mp4") };
const v22 = { url: assetUrl("22.mp4") };

export type TestimonialGroup = {
  /** Stable id — handy when this content moves to an API. */
  id: string;
  title: string;
  body: string;
  /** Up to 6 short showcase clips. Missing entries render as placeholders. */
  videos: string[];
};

export const testimonialGroups: TestimonialGroup[] = [
  {
    id: "acrylic-photos",
    title: "Acrylic Photos",
    body: "Capture every smile with our crystal-clear acrylic prints polished, vivid, and built to last for the moments you'll always want to revisit.",
    videos: [v3.url, v4.url, v10.url, v32.url, v34.url, v33.url],
  },
  {
    id: "acrylic-clear-photos",
    title: "Acrylic Clear Photos",
    body: "Layered transparency, perfect colour fidelity, and a tactile finish that makes every photograph feel like an heirloom.",
    videos: [v15.url, v16.url, v20.url, v29.url, v30.url, v31.url],
  },
  {
    id: "creative-gifts",
    title: "Creative Gifts",
    body: "Thoughtful, personalised gifts crafted to surprise — designed around the people and stories that matter most to you.",
    videos: [v24.url, v14.url, v23.url, v7.url, v9.url, v22.url],
  },
  {
    id: "name-decors",
    title: "Name Decors",
    body: "Make any door, desk, or doorway truly yours with a custom nameplate finished in vibrant detail.",
    videos: [v28.url, v6.url, v8.url, v12.url, v5.url, v35.url],
  },
];
