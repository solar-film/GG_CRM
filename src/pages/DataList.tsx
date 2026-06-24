import { useEffect, useState, useRef } from 'react';
import { Search, Info, Filter, Download } from 'lucide-react';

export default function DataList() {
  const [records, setRecords] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const fetchRecords = () => {
    fetch('http://localhost:3001/api/records')
      .then(res => res.json())
      .then(data => setRecords(data.data || []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = records.filter(r => 
    r.customer_name?.toLowerCase().includes(search.toLowerCase()) || 
    r.contact?.includes(search) ||
    r.details?.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', paddingBottom: '3rem', padding: '2rem 1.5rem' }}>
      
      {/* Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>รายการข้อมูลลูกค้า</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.875rem' }}>ข้อมูลลูกค้าทั้งหมด {records.length} รายการ</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
            <Download size={16} /> ส่งออก (Export)
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ background: '#ffffff', borderRadius: '12px 12px 0 0', padding: '1.25rem 1.5rem', border: '1px solid #e2e8f0', borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', maxWidth: '400px' }}>
          <Search size={18} color="#64748b" />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อลูกค้า, บริษัท หรือ เบอร์โทร..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#1e293b', outline: 'none', width: '100%', fontFamily: 'inherit', fontSize: '0.875rem' }}
          />
        </div>
      </div>

      {/* Data Table */}
      <div style={{ background: '#ffffff', borderRadius: '0 0 12px 12px', border: '1px solid #e2e8f0', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>วันที่</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>สถานะ</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>บริษัท / ลูกค้า</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>ข้อมูลติดต่อ</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>สถานที่หน้างาน</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Admin / Sales</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record, index) => (
              <tr key={record.id} style={{ borderBottom: index === filteredRecords.length - 1 ? 'none' : '1px solid #f1f5f9', transition: 'background 0.2s' }} className="table-row-hover">
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#334155', whiteSpace: 'nowrap' }}>
                  {record.details?.date || new Date(record.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    background: record.details?.status === 'รอติดตาม' ? '#fef08a' : record.details?.status === 'ปิดการขาย' ? '#dcfce3' : record.details?.status === 'กำลังเจรจา' ? '#dbeafe' : '#f1f5f9',
                    color: record.details?.status === 'รอติดตาม' ? '#854d0e' : record.details?.status === 'ปิดการขาย' ? '#166534' : record.details?.status === 'กำลังเจรจา' ? '#1e40af' : '#475569',
                  }}>
                    {record.details?.status || record.status || '-'}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{record.details?.company || record.customer_name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>{record.details?.customer_name || '-'}</div>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ fontSize: '0.875rem', color: '#334155' }}>{record.details?.phone || record.contact?.split('|')[0] || '-'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>{record.details?.line_id || record.contact?.split('|')[1] || '-'}</div>
                </td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#334155', maxWidth: '250px' }}>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {record.details?.site_location || record.site_location || '-'}
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ fontSize: '0.875rem', color: '#334155' }}>Admin: {record.details?.entered_by || '-'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>Sale: {record.details?.sale || record.sale || '-'}</div>
                </td>
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
                  <Info size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
                  <div style={{ fontSize: '1.125rem', color: '#475569', fontWeight: 500 }}>ไม่พบข้อมูลลูกค้า</div>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>ลองเปลี่ยนคำค้นหา หรืออัปโหลด CSV</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>
        {`
          .table-row-hover:hover {
            background-color: #f8fafc;
          }
        `}
      </style>
    </div>
  );
}
