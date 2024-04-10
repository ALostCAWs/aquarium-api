import { Product } from "../interfaces/productInterface";
import { PRODUCT_TYPE } from "../constants/productEnum";
import ProductService from "../services/productsService";

const productsService = new ProductService();

(async () => {
  await productsService.deleteAllProducts();
  loadData();
})();

function loadData() {
  productsService.createProduct({
    name: `Aquarium Co-Op Easy Green`,
    type: PRODUCT_TYPE.WATER_COLUMN_FERTILIZER
  } as Product);

  productsService.createProduct({
    name: `GlasGarten Bacter AE`,
    type: PRODUCT_TYPE.BIOFILM
  } as Product);

  productsService.createProduct({
    name: `Seachem Flourish Excel`,
    type: PRODUCT_TYPE.ALGICIDE
  } as Product);
  productsService.createProduct({
    name: `Seachem Flourish Potassium`,
    type: PRODUCT_TYPE.WATER_COLUMN_FERTILIZER
  } as Product);
  productsService.createProduct({
    name: `Seachem Flourish Tabs`,
    type: PRODUCT_TYPE.SUBSTRATE_FERTILIZER
  } as Product);
  productsService.createProduct({
    name: `Seachem Prime`,
    type: PRODUCT_TYPE.CONDITIONER
  } as Product);
  productsService.createProduct({
    name: `Seachem Stability`,
    type: PRODUCT_TYPE.BACTERIA
  } as Product);
}