import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';
import { BRAND_MODULE } from '../modules/brand';

const brandCreatedHandler = async ({ event: { data }, container }: SubscriberArgs<{ id: string }>) => {
  const logger = container.resolve('logger');
  const brandService = container.resolve(BRAND_MODULE);

  const brand = await brandService.retrieveBrand(data.id);

  logger.info(`[subscriber] brand.created fired → "${brand.name}" (${brand.id})`);
};

export default brandCreatedHandler;

export const config: SubscriberConfig = {
  event: 'brand.created',
};
