import { MedusaService } from '@medusajs/framework/utils';
import { Brand } from './models/brand';

class BrandModuleService extends MedusaService({
  Brand,
}) {
  // HERE (option D) — override the auto-generated method to add domain logic
  // that ALWAYS applies, regardless of caller (workflows, scripts, seeders, tests).
  // Use this when the rule is intrinsic to "what it means to be a brand."
  // Examples: lowercase the slug, strip whitespace, audit-log on delete.
  //
  // async createBrands(data) {
  //   return super.createBrands(/* transformed data */)
  // }
  //
  // async deleteBrands(ids) {
  //   // pre-delete custom logic
  //   const result = await super.deleteBrands(ids)
  //   // post-delete custom logic
  //   return result
  // }
}

export default BrandModuleService;
