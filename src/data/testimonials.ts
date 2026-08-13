import v3 from "@/assets/3.mp4.asset.json";
import v4 from "@/assets/4.mp4.asset.json";
import v10 from "@/assets/10.mp4.asset.json";
import v15 from "@/assets/15.mp4.asset.json";
import v16 from "@/assets/16.mp4.asset.json";
import v20 from "@/assets/20.mp4.asset.json";
import v24 from "@/assets/24.mp4.asset.json";
import v14 from "@/assets/14.mp4.asset.json";
import v23 from "@/assets/23.mp4.asset.json";
import v32 from "@/assets/32.mp4.asset.json";
import v34 from "@/assets/34.mp4.asset.json";
import v5 from "@/assets/5.mp4.asset.json";
import v29 from "@/assets/29.mp4.asset.json";
import v30 from "@/assets/30.mp4.asset.json";
import v7 from "@/assets/7.mp4.asset.json";
import v9 from "@/assets/9.mp4.asset.json";
import v28 from "@/assets/28.mp4.asset.json";
import v6 from "@/assets/6.mp4.asset.json";
import v8 from "@/assets/8.mp4.asset.json";
import v12 from "@/assets/12.mp4.asset.json";
import v33 from "@/assets/33.mp4.asset.json";
import v35 from "@/assets/35.mp4.asset.json";
import v31 from "@/assets/31.mp4.asset.json";
import v22 from "@/assets/22.mp4.asset.json";

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
