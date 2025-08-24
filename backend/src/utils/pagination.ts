export function parsePagination(q: any) {
    const page = Math.max(parseInt(q.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(q.limit as string) || 20, 1), 100);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
  }