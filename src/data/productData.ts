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
    product: `Aquarium Co-Op Easy Green`,
    product_type: PRODUCT_TYPE.WATER_COLUMN_FERTILIZER
  } as Product);

  productsService.createProduct({
    product: `GlasGarten Bacter AE`,
    product_type: PRODUCT_TYPE.BIOFILM
  } as Product);

  productsService.createProduct({
    product: `Seachem Flourish Excel`,
    product_type: PRODUCT_TYPE.ALGICIDE
  } as Product);
  productsService.createProduct({
    product: `Seachem Flourish Potassium`,
    product_type: PRODUCT_TYPE.WATER_COLUMN_FERTILIZER
  } as Product);
  productsService.createProduct({
    product: `Seachem Flourish Tabs`,
    product_type: PRODUCT_TYPE.SUBSTRATE_FERTILIZER
  } as Product);
  productsService.createProduct({
    product: `Seachem Prime`,
    product_type: PRODUCT_TYPE.CONDITIONER
  } as Product);
  productsService.createProduct({
    product: `Seachem Stability`,
    product_type: PRODUCT_TYPE.BACTERIA
  } as Product);
}