import pPremium from "@/assets/Premium_Acrylic_Photos.png.asset.json";
import pFramed from "@/assets/Framed_Acrylic_Photos.png.asset.json";
import pPillow from "@/assets/Custom_Pillows.png.asset.json";
import pMagnet from "@/assets/Fridge_magnets.png.asset.json";
import pNamePlate from "@/assets/Custom_name_plates.png.asset.json";
import pKeychain from "@/assets/Custom_Keychains.png.asset.json";
import pCutout from "@/assets/Acrylic_Cutout_Decor.png.asset.json";
import pDesk from "@/assets/Acrylic_Desk_Photos.png.asset.json";
import pMonogram from "@/assets/Acrylic_Monogram.png.asset.json";
import pCap from "@/assets/Cap.png.asset.json";
import pBottle from "@/assets/Cup_Waterbottle.png.asset.json";
import pHoodie from "@/assets/Hoodies.png.asset.json";
import pJute from "@/assets/Jute_Bag.png.asset.json";
import pLaptop from "@/assets/Laptop_Bags.png.asset.json";
import pLuggage from "@/assets/Luggage_tags.png.asset.json";
import pContainer from "@/assets/Lunch_Container.png.asset.json";
import pPenDrive from "@/assets/Pen_Drives.png.asset.json";
import pAlbum from "@/assets/Photo_Albums.png.asset.json";
import pCandle from "@/assets/Premium_Candle.png.asset.json";
import pSweetBox from "@/assets/Sweet_Box.png.asset.json";
import pTshirt from "@/assets/T_Shirt.png.asset.json";
import pTote from "@/assets/Tote_Bag.png.asset.json";
import pTravel from "@/assets/Travel_Bag.png.asset.json";
import pUmbrella from "@/assets/Umbrella.png.asset.json";
import pClock from "@/assets/Wall_Clocks.png.asset.json";
import pPerfume from "@/assets/Perfume.png.asset.json";
import pPlant from "@/assets/Potted_Plant.png.asset.json";
import gAcrylic from "@/assets/Custom_acrylic_phots.png.asset.json";

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
