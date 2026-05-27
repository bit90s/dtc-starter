import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { ContainerRegistrationKeys } from '@medusajs/framework/utils';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: products } = await query.graph({
    entity: 'product',
    fields: ['id', 'brand.id', 'brand.name'],
    filters: { id: req.params.id },
  });

  res.json({ brand: products[0]?.brand ?? null });
};
