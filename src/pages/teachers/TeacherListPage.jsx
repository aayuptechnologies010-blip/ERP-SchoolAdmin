import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/index';
import { Avatar, StatusChip, Button } from '../../components/ui';
import { useTable } from '../../hooks/useTable';
import { dialog } from '../../utils/dialog';
import { notify } from '../../utils/notify';
import { APP_NAME } from '../../constants';
import api from '../../api/api';

// Backend Teacher document -> flat row shape the table/columns expect.
function toRow(teacher) {
  return {
    id: teacher._id,
    name: teacher.user?.name || '(no name)',
    email: teacher.user?.email || '',
    phone: teacher.user?.phone || '',
    avatar: teacher.user?.avatar || '',
    employeeId: teacher.employeeId,
    subject: (teacher.subjects || []).join(', ') || '—',
    qualification: teacher.qualification || '—',
    experience: teacher.experience || '—',
    status: teacher.status,
  };
}

function TeacherActions({ row, onDeleted }) {
  const handleDelete = async () => {
    const result = await dialog.delete({ title: 'Delete Teacher?', text: `"${row.name}" will be permanently removed.` });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/teachers/${row.id}`);
      notify.success('Teacher deleted successfully');
      onDeleted();
    } catch (err) {
      notify.error(err.message);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <Link to={`/teachers/${row.id}`} className="btn-ghost btn btn-sm p-1.5">
        <HiOutlineEye className="w-4 h-4" />
      </Link>
      <Link to={`/teachers/${row.id}/edit`} className="btn-ghost btn btn-sm p-1.5">
        <HiOutlinePencil className="w-4 h-4" />
      </Link>
      <button onClick={handleDelete} className="btn-ghost btn btn-sm p-1.5 hover:text-danger hover:bg-red-50 dark:hover:bg-red-900/20">
        <HiOutlineTrash className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function TeacherListPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/teachers', { params: { limit: 500, sort: '-createdAt' } });
      setTeachers((data.data || []).map(toRow));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const columns = [
    {
      key: 'name',
      label: 'Teacher',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar} name={row.name} size="sm" />
          <div>
            <p className="font-medium text-erp-heading dark:text-erp-dark-heading text-sm">{row.name}</p>
            <p className="text-caption text-erp-muted">{row.employeeId}</p>
          </div>
        </div>
      ),
    },
    { key: 'subject', label: 'Subject', sortable: true },
    { key: 'qualification', label: 'Qualification' },
    { key: 'experience', label: 'Experience', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status', render: (v) => <StatusChip status={v} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => <TeacherActions row={row} onDeleted={fetchTeachers} />,
    },
  ];

  const {
    search, setSearch, sortKey, sortOrder, handleSort,
    page, setPage, pageSize, setPageSize, paginated, totalPages, total,
  } = useTable(teachers);

  return (
    <>
      <Helmet><title>Teachers — {APP_NAME}</title></Helmet>
      <PageHeader
        title="Teachers"
        subtitle={loading ? 'Loading...' : `${total} teachers on staff`}
        actions={<Link to="/teachers/add"><Button variant="primary" icon={HiOutlinePlus}>Add Teacher</Button></Link>}
      />
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>
      )}
      <DataTable
        columns={columns} data={paginated} total={total}
        page={page} pageSize={pageSize} totalPages={totalPages}
        onPageChange={setPage} onPageSizeChange={setPageSize}
        sortKey={sortKey} sortOrder={sortOrder} onSort={handleSort}
        search={search} onSearch={setSearch}
        loading={loading}
      />
    </>
  );
}
