import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { ContainerRegistrationKeys } from '@medusajs/framework/utils';
import { z } from 'zod';
import { createBrandWorkflow } from '../../../workflows/create-brand';
import { PostAdminCreateBrand } from './validators';

type PostAdminCreateBrandType = z.infer<typeof PostAdminCreateBrand>;

export const POST = async (req: MedusaRequest<PostAdminCreateBrandType>, res: MedusaResponse) => {
  const { result } = await createBrandWorkflow(req.scope).run({
    input: req.validatedBody,
  });

  res.json({ brand: result });
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: brands, metadata } = await query.graph({
    entity: 'brand',
    fields: ['id', 'name', 'created_at', 'products.id', 'products.title', 'products.handle'],
    pagination: {
      skip: Number(req.query.offset ?? 0),
      take: Number(req.query.limit ?? 20),
    },
  });

  res.json({
    brands,
    count: metadata?.count,
    offset: metadata?.skip,
    limit: metadata?.take,
  });
};
