import { createStep, createWorkflow, StepResponse, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import { BRAND_MODULE } from '../modules/brand';
import BrandModuleService from '../modules/brand/service';

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

  // HERE (option C) — a step that runs AFTER the brand exists and gets full rollback.
  // Examples: link the brand to a product, create a default category, push to Algolia,
  // send a Slack notification. Each step you add here gets its own compensation.
  // linkBrandToDefaultCategoryStep({ brand_id: brand.id })

  return new WorkflowResponse(brand);
});
