import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_PAGE_SIZE } from '../constants';

export function useTable(data = [], { pageSize: initialPageSize = DEFAULT_PAGE_SIZE } = {}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Reset to page 1 on search
  useEffect(() => { setPage(1); }, [search]);

  const handleSort = useCallback((key) => {
    if (sortKey === key) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  }, [sortKey]);

  const filtered = data.filter((row) => {
    if (!search) return true;
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    if (av < bv) return sortOrder === 'asc' ? -1 : 1;
    if (av > bv) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  return {
    search, setSearch,
    sortKey, sortOrder, handleSort,
    page, setPage,
    pageSize, setPageSize,
    filtered: sorted,
    paginated,
    totalPages,
    total: sorted.length,
  };
}
