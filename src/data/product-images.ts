import { assetUrl } from "@/data/media-map";

/* Site media — resolved from Supabase Storage when VITE_MEDIA_BASE_URL is set. */
const pPremium = { url: assetUrl("Premium_Acrylic_Photos.png") };
const pFramed = { url: assetUrl("Framed_Acrylic_Photos.png") };
const pPillow = { url: assetUrl("Custom_Pillows.png") };
const pMagnet = { url: assetUrl("Fridge_magnets.png") };
const pNamePlate = { url: assetUrl("Custom_name_plates.png") };
const pKeychain = { url: assetUrl("Custom_Keychains.png") };
const pCutout = { url: assetUrl("Acrylic_Cutout_Decor.png") };
const pDesk = { url: assetUrl("Acrylic_Desk_Photos.png") };
const pMonogram = { url: assetUrl("Acrylic_Monogram.png") };
const pCap = { url: assetUrl("Cap.png") };
const pBottle = { url: assetUrl("Cup_Waterbottle.png") };
const pHoodie = { url: assetUrl("Hoodies.png") };
const pJute = { url: assetUrl("Jute_Bag.png") };
const pLaptop = { url: assetUrl("Laptop_Bags.png") };
const pLuggage = { url: assetUrl("Luggage_tags.png") };
const pContainer = { url: assetUrl("Lunch_Container.png") };
const pPenDrive = { url: assetUrl("Pen_Drives.png") };
const pAlbum = { url: assetUrl("Photo_Albums.png") };
const pCandle = { url: assetUrl("Premium_Candle.png") };
const pSweetBox = { url: assetUrl("Sweet_Box.png") };
const pTshirt = { url: assetUrl("T_Shirt.png") };
const pTote = { url: assetUrl("Tote_Bag.png") };
const pTravel = { url: assetUrl("Travel_Bag.png") };
const pUmbrella = { url: assetUrl("Umbrella.png") };
const pClock = { url: assetUrl("Wall_Clocks.png") };
const pPerfume = { url: assetUrl("Perfume.png") };
const pPlant = { url: assetUrl("Potted_Plant.png") };
const gAcrylic = { url: assetUrl("Custom_acrylic_phots.png") };

/** Product artwork by slug — swap for API-provided URLs at handover. */
export const imgBySlug: Record<string, string> = {
  "premium-acrylic-photo": pPremium.url,
  "framed-acrylic-photo": pFramed.url,
  pillows: pPillow.url,
  "fridge-magnet": pMagnet.url,
  "name-plate": pNamePlate.url,
  keychain: pKeychain.url,
  "acrylic-cutouts-decor": pCutout.url,
  "acrylic-desk-photo": pDesk.url,
  "acrylic-monogram": pMonogram.url,
  "luggage-tags": pLuggage.url,
  hoodies: pHoodie.url,
  "laptop-bag": pLaptop.url,
  "water-bottle": pBottle.url,
  cap: pCap.url,
  "jute-bag": pJute.url,
  container: pContainer.url,
  "pen-drive": pPenDrive.url,
  "photo-albums": pAlbum.url,
  candle: pCandle.url,
  "sweet-box": pSweetBox.url,
  tshirt: pTshirt.url,
  "tote-bag": pTote.url,
  "travel-duffle-bag": pTravel.url,
  umbrella: pUmbrella.url,
  "wall-clocks": pClock.url,
  perfume: pPerfume.url,
  plant: pPlant.url,
};

export const productImageFallback = gAcrylic.url;
