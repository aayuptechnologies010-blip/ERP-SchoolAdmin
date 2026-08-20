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
import { formatDate } from '../../utils/helpers';
import { APP_NAME } from '../../constants';
import api from '../../api/api';

// Backend Student document -> flat row shape the table/columns expect.
function toRow(student) {
  return {
    id: student._id,
    name: student.user?.name || '(no name)',
    email: student.user?.email || '',
    phone: student.user?.phone || '',
    avatar: student.user?.avatar || '',
    rollNo: student.rollNo,
    class: student.class,
    section: student.section,
    gender: student.gender,
    admissionDate: student.admissionDate,
    fees: student.feeStatus,
    status: student.status,
  };
}

function StudentActions({ row, onDeleted }) {
  const handleDelete = async () => {
    const result = await dialog.delete({ title: 'Delete Student?', text: `"${row.name}" will be permanently removed.` });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/students/${row.id}`);
      notify.success('Student deleted successfully');
      onDeleted();
    } catch (err) {
      notify.error(err.message);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <Link to={`/students/${row.id}`} className="btn-ghost btn btn-sm p-1.5">
        <HiOutlineEye className="w-4 h-4" />
      </Link>
      <Link to={`/students/${row.id}/edit`} className="btn-ghost btn btn-sm p-1.5">
        <HiOutlinePencil className="w-4 h-4" />
      </Link>
      <button onClick={handleDelete} className="btn-ghost btn btn-sm p-1.5 hover:text-danger hover:bg-red-50 dark:hover:bg-red-900/20">
        <HiOutlineTrash className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function StudentListPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/students', { params: { limit: 500, sort: '-createdAt' } });
      setStudents((data.data || []).map(toRow));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const columns = [
    {
      key: 'name',
      label: 'Student',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar} name={row.name} size="sm" />
          <div>
            <p className="font-medium text-erp-heading dark:text-erp-dark-heading text-sm">{row.name}</p>
            <p className="text-caption text-erp-muted">{row.rollNo}</p>
          </div>
        </div>
      ),
    },
    { key: 'class', label: 'Class', sortable: true, render: (v, row) => `${row.class} – ${row.section}` },
    { key: 'gender', label: 'Gender', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'admissionDate', label: 'Admission Date', sortable: true, render: (v) => (v ? formatDate(v) : '—') },
    { key: 'fees', label: 'Fees', render: (v) => <StatusChip status={v} /> },
    { key: 'status', label: 'Status', render: (v) => <StatusChip status={v} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => <StudentActions row={row} onDeleted={fetchStudents} />,
    },
  ];

  const {
    search, setSearch, sortKey, sortOrder, handleSort,
    page, setPage, pageSize, setPageSize, paginated, totalPages, total,
  } = useTable(students);

  return (
    <>
      <Helmet><title>Students — {APP_NAME}</title></Helmet>
      <PageHeader
        title="Students"
        subtitle={loading ? 'Loading...' : `${total} students enrolled`}
        actions={
          <Link to="/students/add">
            <Button variant="primary" icon={HiOutlinePlus}>Add Student</Button>
          </Link>
        }
      />
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>
      )}
      <DataTable
        columns={columns}
        data={paginated}
        total={total}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={handleSort}
        search={search}
        onSearch={setSearch}
        loading={loading}
      />
    </>
  );
}
