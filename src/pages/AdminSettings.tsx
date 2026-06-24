import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string[]>>({
    admin: [],
    sale: [],
    site_char: [],
    contact_channel: [],
    known_from: [],
    customer_type: [],
    province: [],
    company_list: [],
    lead_status: []
  });

  const [newItems, setNewItems] = useState<Record<string, string>>({
    admin: '',
    sale: '',
    site_char: '',
    contact_channel: '',
    known_from: '',
    customer_type: '',
    province: '',
    company_list: '',
    lead_status: ''
  });

  const [editingItem, setEditingItem] = useState<{ key: string, index: number } | null>(null);
  const [editValue, setEditValue] = useState('');

  const labels: Record<string, string> = {
    admin: 'Admin',
    sale: 'ฝ่ายขาย (Sales)',
    site_char: 'ลักษณะหน้างาน',
    contact_channel: 'ช่องทางติดต่อ',
    known_from: 'รู้จักเราครั้งแรก',
    customer_type: 'ประเภท ลค. (เก่า/ใหม่)',
    province: 'จังหวัด',
    company_list: 'บริษัท',
    lead_status: 'สถานะ Lead'
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(prev => ({ ...prev, ...(data.data || {}) }));
      })
      .catch(err => console.error(err));
  }, []);

  const handleUpdate = async (key: string, items: string[]) => {
    try {
      await fetch(`http://localhost:3001/api/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: items })
      });
      setSettings(prev => ({ ...prev, [key]: items }));
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    }
  };

  const handleAdd = (key: string) => {
    const val = newItems[key]?.trim();
    if (!val) return;
    const items = [...(settings[key] || []), val];
    handleUpdate(key, items);
    setNewItems(prev => ({ ...prev, [key]: '' }));
  };

  const handleDelete = (key: string, index: number) => {
    if (!confirm('ยืนยันการลบ?')) return;
    const items = [...(settings[key] || [])];
    items.splice(index, 1);
    handleUpdate(key, items);
  };

  const startEdit = (key: string, index: number, value: string) => {
    setEditingItem({ key, index });
    setEditValue(value);
  };

  const saveEdit = (key: string, index: number) => {
    const val = editValue.trim();
    if (!val) return;
    const items = [...(settings[key] || [])];
    items[index] = val;
    handleUpdate(key, items);
    setEditingItem(null);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditValue('');
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem 1rem' }}>
      {/* Header outside the grid so it stays centered at the top */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>ตั้งค่าตัวเลือก (Admin Settings)</h1>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Setting Cards */}
        {Object.keys(labels).map(key => (
          <div key={key} style={{ 
            background: '#ffffff', 
            borderRadius: '16px', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', 
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem' 
          }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 700, 
              color: '#4f46e5', 
              margin: 0,
              paddingBottom: '0.75rem',
              borderBottom: '1px solid #f1f5f9'
            }}>
              {labels[key]}
            </h3>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.5rem', 
              maxHeight: '280px', 
              overflowY: 'auto',
              paddingRight: '0.5rem'
            }}>
              {(settings[key] || []).length === 0 && (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                  ไม่มีตัวเลือก
                </div>
              )}

              {(settings[key] || []).map((item, idx) => {
                const isEditing = editingItem?.key === key && editingItem?.index === idx;

                if (isEditing) {
                  return (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.875rem', border: '1px solid #4f46e5', borderRadius: '6px', outline: 'none' }}
                        value={editValue} 
                        onChange={e => setEditValue(e.target.value)} 
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') saveEdit(key, idx);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                      />
                      <button onClick={() => saveEdit(key, idx)} style={{ background: '#22c55e', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}>
                        <Check size={16} />
                      </button>
                      <button onClick={cancelEdit} style={{ background: '#94a3b8', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}>
                        <X size={16} />
                      </button>
                    </div>
                  );
                }

                return (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: '#f8fafc', 
                    padding: '0.6rem 1rem', 
                    borderRadius: '8px', 
                    fontSize: '0.875rem',
                    border: '1px solid transparent',
                    transition: 'border-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                  >
                    <span style={{ fontWeight: 500, color: '#334155' }}>{item}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => startEdit(key, idx, item)} style={{ background: 'transparent', border: 'none', color: '#4f46e5', cursor: 'pointer', padding: '0.2rem', display: 'flex' }} title="แก้ไข">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(key, idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem', display: 'flex' }} title="ลบ">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input 
                type="text" 
                style={{ 
                  flex: 1, 
                  padding: '0.6rem 1rem', 
                  fontSize: '0.875rem', 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '8px', 
                  outline: 'none',
                  background: '#ffffff',
                  color: '#1e293b'
                }}
                placeholder="เพิ่มตัวเลือก..."
                value={newItems[key]}
                onChange={e => setNewItems(prev => ({ ...prev, [key]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleAdd(key)}
              />
              <button 
                style={{ 
                  background: '#4f46e5', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0 1rem', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)'
                }} 
                onClick={() => handleAdd(key)}
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        ))}

        <style>
          {`
            /* Custom Scrollbar for the lists */
            div::-webkit-scrollbar {
              width: 6px;
            }
            div::-webkit-scrollbar-track {
              background: #f1f5f9;
              border-radius: 10px;
            }
            div::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 10px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
            }
          `}
        </style>

      </div>
    </div>
  );
}
