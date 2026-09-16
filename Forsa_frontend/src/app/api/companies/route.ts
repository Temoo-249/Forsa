import { initialCompanies } from '../../../data/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('q')?.toLowerCase() || '';
  const industry = searchParams.get('industry') || '';

  let filtered = initialCompanies;

  if (search) {
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.industry.toLowerCase().includes(search) ||
        c.tagline.toLowerCase().includes(search)
    );
  }

  if (industry && industry !== 'الكل') {
    filtered = filtered.filter((c) => c.industry === industry);
  }

  return Response.json({
    success: true,
    total: filtered.length,
    companies: filtered,
  });
}
