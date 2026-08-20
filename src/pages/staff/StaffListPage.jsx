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

// Backend Staff document -> flat row shape the table/columns expect.
function toRow(staff) {
  return {
    id: staff._id,
    name: staff.user?.name || '(no name)',
    email: staff.user?.email || '',
    phone: staff.user?.phone || '',
    avatar: staff.user?.avatar || '',
    employeeId: staff.employeeId,
    designation: staff.designation || '—',
    department: staff.department || '—',
    salary: staff.salary || 0,
    status: staff.status,
  };
}

function StaffActions({ row, onDeleted }) {
  const handleDelete = async () => {
    const result = await dialog.delete({ title: 'Delete Staff?', text: `"${row.name}" will be permanently removed.` });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/staff/${row.id}`);
      notify.success('Staff deleted successfully');
      onDeleted();
    } catch (err) {
      notify.error(err.message);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <Link to={`/staff/${row.id}`} className="btn-ghost btn btn-sm p-1.5">
        <HiOutlineEye className="w-4 h-4" />
      </Link>
      <Link to={`/staff/${row.id}/edit`} className="btn-ghost btn btn-sm p-1.5">
        <HiOutlinePencil className="w-4 h-4" />
      </Link>
      <button onClick={handleDelete} className="btn-ghost btn btn-sm p-1.5 hover:text-danger hover:bg-red-50 dark:hover:bg-red-900/20">
        <HiOutlineTrash className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function StaffListPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/staff', { params: { limit: 500, sort: '-createdAt' } });
      setStaff((data.data || []).map(toRow));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const columns = [
    {
      key: 'name',
      label: 'Staff Member',
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
    { key: 'designation', label: 'Designation', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'salary', label: 'Salary', render: (v) => `₹${Number(v).toLocaleString('en-IN')}` },
    { key: 'status', label: 'Status', render: (v) => <StatusChip status={v} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => <StaffActions row={row} onDeleted={fetchStaff} />,
    },
  ];

  const {
    search, setSearch, sortKey, sortOrder, handleSort,
    page, setPage, pageSize, setPageSize, paginated, totalPages, total,
  } = useTable(staff);

  return (
    <>
      <Helmet><title>Staff — {APP_NAME}</title></Helmet>
      <PageHeader
        title="Staff"
        subtitle={loading ? 'Loading...' : `${total} staff members`}
        actions={<Link to="/staff/add"><Button variant="primary" icon={HiOutlinePlus}>Add Staff</Button></Link>}
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
