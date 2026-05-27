import { Modules } from '@medusajs/framework/utils';
import { StepResponse } from '@medusajs/framework/workflows-sdk';
import { createProductsWorkflow } from '@medusajs/medusa/core-flows';
import { BRAND_MODULE } from '../../modules/brand';

createProductsWorkflow.hooks.productsCreated(
  async ({ products, additional_data }, { container }) => {
    const brandId = (additional_data as { brand_id?: string } | undefined)?.brand_id;
    if (!brandId) {
      return new StepResponse([], []);
    }

    const link = container.resolve('link');
    const logger = container.resolve('logger');

    const links = products.map((product) => ({
      [BRAND_MODULE]: { brand_id: brandId },
      [Modules.PRODUCT]: { product_id: product.id },
    }));

    await link.create(links);
    logger.info(`Linked brand ${brandId} to ${products.length} product(s).`);

    return new StepResponse(links, links);
  },
  async (links, { container }) => {
    if (!links?.length) return;
    const link = container.resolve('link');
    await link.dismiss(links);
  },
);
