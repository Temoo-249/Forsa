import { initialJobs } from '../../../data/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('q')?.toLowerCase() || '';
  const domain = searchParams.get('domain') || '';

  let filtered = initialJobs;

  if (search) {
    filtered = filtered.filter(
      (job) =>
        job.title.toLowerCase().includes(search) ||
        job.company.toLowerCase().includes(search) ||
        job.skills.some((s) => s.toLowerCase().includes(search))
    );
  }

  if (domain && domain !== 'الكل') {
    filtered = filtered.filter((job) => job.domain === domain);
  }

  return Response.json({
    success: true,
    total: filtered.length,
    jobs: filtered,
  });
}
