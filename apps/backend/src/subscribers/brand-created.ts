// HERE (option E) — a Subscriber reacts to an EVENT after the workflow has succeeded.
// It is decoupled: it doesn't run inside the workflow, has no compensation, and CAN
// fail without rolling back the brand creation. Use it for non-critical side effects:
// "send a welcome email," "post to a Slack channel," "warm a cache."
//
// To make this work you'd:
//  1. Emit an event from your workflow with `emitEventStep({ eventName: 'brand.created', data: { id: brand.id } })`
//  2. Uncomment the file below.
//
// import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';
//
// export default async function brandCreatedHandler({
//   event: { data },
//   container,
// }: SubscriberArgs<{ id: string }>) {
//   // do the side effect here — e.g. fetch the brand, call a webhook
//   const brandService = container.resolve('brand');
//   const brand = await brandService.retrieveBrand(data.id);
//   console.log('brand created!', brand.name);
// }
//
// export const config: SubscriberConfig = {
//   event: 'brand.created',
// };

export {};
