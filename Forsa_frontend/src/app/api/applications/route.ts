import { initialApplications } from '../../../data/mockData';

export async function GET() {
  return Response.json({
    success: true,
    total: initialApplications.length,
    applications: initialApplications,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return Response.json({
      success: true,
      message: 'تم استلام طلب التوظيف بنجاح في نظام ATS',
      applicationId: `app-${Date.now()}`,
      data: body,
    });
  } catch {
    return Response.json(
      { success: false, error: 'بيانات غير صالحة' },
      { status: 400 }
    );
  }
}
