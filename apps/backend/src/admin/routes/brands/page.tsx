import { defineRouteConfig } from '@medusajs/admin-sdk';
import { Container, Heading, Table, Text } from '@medusajs/ui';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

const BrandsIcon = () => (
  <svg width='15' height='15' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <circle cx='7' cy='7' r='1.5' fill='currentColor' />
  </svg>
);

type Brand = {
  id: string;
  name: string;
  created_at: string;
  products?: { id: string; title: string }[];
};

type BrandsResponse = {
  brands: Brand[];
  count: number;
  offset: number;
  limit: number;
};

const PAGE_SIZE = 10;

const BrandsPage = () => {
  const [offset, setOffset] = useState(0);

  const { data, isLoading } = useQuery<BrandsResponse>({
    queryKey: ['brands', offset],
    queryFn: async () => {
      const res = await fetch(`/admin/brands?limit=${PAGE_SIZE}&offset=${offset}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch brands');
      return res.json();
    },
  });

  const pageCount = useMemo(() => (data ? Math.max(1, Math.ceil(data.count / PAGE_SIZE)) : 1), [data]);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  return (
    <Container className='divide-y p-0'>
      <div className='flex items-center justify-between px-6 py-4'>
        <Heading level='h1'>Brands</Heading>
        <Text className='txt-small text-ui-fg-muted'>{data?.count ?? 0} total</Text>
      </div>

      <div className='px-6 py-4'>
        {isLoading ? (
          <Text className='txt-small text-ui-fg-muted'>Loading…</Text>
        ) : !data?.brands.length ? (
          <Text className='txt-small text-ui-fg-muted'>No brands yet.</Text>
        ) : (
          <>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Products</Table.HeaderCell>
                  <Table.HeaderCell>Created</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.brands.map((brand) => (
                  <Table.Row key={brand.id}>
                    <Table.Cell>{brand.name}</Table.Cell>
                    <Table.Cell>{brand.products?.length ?? 0}</Table.Cell>
                    <Table.Cell>{new Date(brand.created_at).toLocaleDateString()}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <Table.Pagination
              className='pt-4'
              count={data.count}
              pageSize={PAGE_SIZE}
              pageIndex={currentPage - 1}
              pageCount={pageCount}
              canPreviousPage={offset > 0}
              canNextPage={offset + PAGE_SIZE < data.count}
              nextPage={() => setOffset((o) => o + PAGE_SIZE)}
              previousPage={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
            />
          </>
        )}
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: 'Brands',
  icon: BrandsIcon,
});

export default BrandsPage;
