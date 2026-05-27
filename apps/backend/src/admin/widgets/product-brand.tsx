import { defineWidgetConfig } from '@medusajs/admin-sdk';
import type { AdminProduct, DetailWidgetProps } from '@medusajs/framework/types';
import { Badge, Container, Heading, Text } from '@medusajs/ui';
import { useQuery } from '@tanstack/react-query';

type Brand = { id: string; name: string };

const ProductBrandWidget = ({ data: product }: DetailWidgetProps<AdminProduct>) => {
  const { data, isLoading } = useQuery<{ brand: Brand | null }>({
    queryKey: ['product-brand', product.id],
    queryFn: async () => {
      const res = await fetch(`/admin/products/${product.id}/brand`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch brand');
      return res.json();
    },
  });

  return (
    <Container className='divide-y p-0'>
      <div className='flex items-center justify-between px-6 py-4'>
        <Heading level='h2'>Brand</Heading>
      </div>
      <div className='px-6 py-4'>
        {isLoading ? (
          <Text className='txt-small text-ui-fg-muted'>Loading…</Text>
        ) : data?.brand ? (
          <Badge size='small'>{data.brand.name}</Badge>
        ) : (
          <Text className='txt-small text-ui-fg-muted'>No brand linked.</Text>
        )}
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: 'product.details.side.after',
});

export default ProductBrandWidget;
