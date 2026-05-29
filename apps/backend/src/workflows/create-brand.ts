import { Modules } from '@medusajs/framework/utils';
import { createStep, createWorkflow, StepResponse, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import { emitEventStep } from '@medusajs/medusa/core-flows';
import { BRAND_MODULE } from '../modules/brand';
import BrandModuleService from '../modules/brand/service';

type Brand = { id: string; name: string };

const notifyBrandCreatedStep = createStep('notify-brand-created-step', async (brand: Brand, { container }) => {
  const notification = container.resolve(Modules.NOTIFICATION);
  await notification.createNotifications({
    to: 'admin@example.com',
    channel: 'console',
    template: 'brand-created',
    data: { name: brand.name, id: brand.id },
  });
  return new StepResponse();
});

export type CreateBrandInput = {
  name: string;
};

const createBrandStep = createStep(
  'create-brand-step',
  async (input: CreateBrandInput, { container }) => {
    const brandService: BrandModuleService = container.resolve(BRAND_MODULE);

    // HERE (option A) — logic that should run *as part of* writing the brand row.
    // Examples: normalize input.name, generate a slug, enforce a uniqueness check.
    // Keep it tight: this code runs inside the step's transaction window.

    const brand = await brandService.createBrands(input);

    // HERE (option A continued) — post-insert work that still belongs to "creating a brand"
    // (e.g. push the new ID into a search index). If this throws, the step throws and
    // the compensation below runs.

    return new StepResponse(brand, brand.id);
  },
  async (brandId, { container }) => {
    if (!brandId) return;
    const brandService: BrandModuleService = container.resolve(BRAND_MODULE);

    // HERE (option A — compensation) — undo whatever option-A code did above.
    // Runs when this step succeeded but a *later* step in the workflow failed.

    await brandService.deleteBrands(brandId);
  },
);

export const createBrandWorkflow = createWorkflow('create-brand', (input: CreateBrandInput) => {
  // HERE (option B) — a step that runs BEFORE the brand exists.
  // Examples: validate against an external system, reserve a brand code,
  // pull enrichment data, check entitlements.
  // const enriched = enrichBrandInputStep(input)

  const brand = createBrandStep(input);

  notifyBrandCreatedStep(brand);

  emitEventStep({ eventName: 'brand.created', data: { id: brand.id } });

  return new WorkflowResponse(brand);
});
