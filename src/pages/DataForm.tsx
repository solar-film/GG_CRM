import { useEffect, useState } from 'react';
import { Save, CheckCircle, X, UploadCloud, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DataForm() {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState<Record<string, string[]>>({
    admin: [],
    sale: [],
    site_char: [],
    contact_channel: [],
    known_from: [],
    customer_type: [],
    province: [],
    company_list: []
  });

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    lead_status: 'รอติดตาม',
    company: '',
    customer_type: '',
    customer_type_detail: '',
    customer_name: '',
    phone: '',
    contact_info: '',
    province: '',
    site_location: '',
    known_from: '',
    contact_channel: '',
    source_notes: '',
    site_char: '',
    film_types: [] as string[],
    job_details: '',
    area_size: '',
    admin: '',
    sale: '',
    follow_up_date: '',
    priority: 'Hot Lead',
    internal_notes: ''
  });

  const [toast, setToast] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(prev => ({ ...prev, ...(data.data || {}) }));
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData(prev => ({ ...prev, film_types: [...prev.film_types, value] }));
    } else {
      setFormData(prev => ({ ...prev, film_types: prev.film_types.filter(v => v !== value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent, type: 'save' | 'send') => {
    e.preventDefault();
    try {
      const payload = {
        customer_name: formData.customer_name ? `${formData.company} (${formData.customer_name})` : formData.company,
        contact: formData.phone ? `${formData.phone} ${formData.contact_info ? `| ${formData.contact_info}` : ''}` : formData.contact_info,
        site_location: formData.site_location,
        sale: formData.admin,
        status: formData.customer_type,
        details: {
          date: formData.date,
          lead_status: formData.lead_status,
          company: formData.company,
          customer_type: formData.customer_type,
          customer_type_detail: formData.customer_type_detail,
          customer_name: formData.customer_name,
          admin: formData.admin,
          sale: formData.sale,
          known_from: formData.known_from,
          contact_channel: formData.contact_channel,
          source_notes: formData.source_notes,
          phone: formData.phone,
          contact_info: formData.contact_info,
          site_char: formData.site_char,
          film_types: formData.film_types,
          job_details: formData.job_details,
          area_size: formData.area_size,
          follow_up_date: formData.follow_up_date,
          priority: formData.priority,
          internal_notes: formData.internal_notes,
          province: formData.province,
          action: type // 'save' or 'send'
        }
      };

      const res = await fetch('http://localhost:3001/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setToast(true);
        setTimeout(() => {
          setToast(false);
          navigate('/customers');
        }, 2000);
      } else {
        const err = await res.json();
        alert('Error saving data: ' + err.error);
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving data');
    }
  };

  // Styles
  const containerStyle = { maxWidth: '1200px', margin: '0 auto', padding: '2rem', fontFamily: "'Inter', sans-serif" };
  const cardStyle = { background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' };
  const sectionTitleStyle = { display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.125rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '1.5rem' };
  const numberBadge = { width: '28px', height: '28px', background: '#1e40af', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600 };
  const labelStyle = { display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' };
  const inputStyle = { width: '100%', padding: '0.625rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', color: '#1e293b', background: '#ffffff' };
  const requiredMark = <span style={{ color: '#ef4444' }}>*</span>;
  
  const filmOptions = [
    'ฟิล์มกรองแสงลดความร้อน', 'ฟิล์มอาคารภายนอก',
    'ฟิล์มนิรภัย', 'ฟิล์มรถยนต์',
    'ฟิล์มฝ้า / ฟิล์มตกแต่ง', 'ยังไม่แน่ใจ ต้องการให้แนะนำ'
  ];

  return (
    <div style={{ background: '#f4f7fb', minHeight: '100vh', paddingBottom: '5rem' }}>
      <div style={containerStyle}>
        
        <form>
          {/* Top Bar Floating */}
          <div style={{ ...cardStyle, display: 'flex', gap: '2rem', marginBottom: '1.5rem', alignItems: 'center', padding: '1rem 1.5rem' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', margin: 0 }}>วันที่ {requiredMark}</label>
              <div style={{ position: 'relative', width: '200px' }}>
                <input type="date" name="date" style={inputStyle} value={formData.date} onChange={handleChange} required />
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', margin: 0 }}>สถานะ Lead</label>
              <select name="lead_status" style={{ ...inputStyle, width: '100%', background: '#f8fafc' }} value={formData.lead_status} onChange={handleChange}>
                <option value="รอติดตาม">รอติดตาม</option>
                <option value="กำลังเจรจา">กำลังเจรจา</option>
                <option value="ปิดการขาย">ปิดการขาย</option>
                <option value="ยกเลิก">ยกเลิก</option>
              </select>
            </div>
          </div>

          {/* Masonry 2-Column Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* LEFT COLUMN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Section 1 */}
              <div style={cardStyle}>
                <div style={sectionTitleStyle}><div style={numberBadge}>1</div> ข้อมูลทั่วไป</div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>บริษัท {requiredMark}</label>
                    <input list="company-list" name="company" style={inputStyle} placeholder="กรอกชื่อบริษัท" value={formData.company} onChange={handleChange} required autoComplete="off" />
                    <datalist id="company-list">{(settings.company_list || []).map((opt, i) => <option key={i} value={opt} />)}</datalist>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>ประเภทลูกค้า {requiredMark}</label>
                      <select name="customer_type" style={inputStyle} value={formData.customer_type} onChange={handleChange} required>
                        <option value="">เลือกประเภทลูกค้า</option>
                        <option value="ลูกค้าใหม่">ลูกค้าใหม่</option>
                        <option value="ลูกค้าเก่า">ลูกค้าเก่า</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>รายละเอียดลูกค้าเก่า / ใหม่ (ประเภท ลค.)</label>
                      <input list="customer_type-list" name="customer_type_detail" style={inputStyle} placeholder="เลือกประเภท" value={formData.customer_type_detail} onChange={handleChange} autoComplete="off" />
                      <datalist id="customer_type-list">{(settings.customer_type || []).map((opt, i) => <option key={i} value={opt} />)}</datalist>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div style={cardStyle}>
                <div style={sectionTitleStyle}><div style={numberBadge}>2</div> ข้อมูลผู้ติดต่อ</div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>ชื่อลูกค้า / ผู้ติดต่อ {requiredMark}</label>
                    <input type="text" name="customer_name" style={inputStyle} placeholder="กรอกชื่อ-นามสกุล" value={formData.customer_name} onChange={handleChange} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>เบอร์โทรศัพท์ {requiredMark}</label>
                      <input type="tel" name="phone" style={inputStyle} placeholder="กรอกเบอร์โทรศัพท์" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div>
                      <label style={labelStyle}>Line / FB / อีเมล</label>
                      <input type="text" name="contact_info" style={inputStyle} placeholder="กรอก Line / FB / อีเมล" value={formData.contact_info} onChange={handleChange} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>จังหวัด {requiredMark}</label>
                      <input list="province-list" name="province" style={inputStyle} placeholder="เลือกจังหวัด" value={formData.province} onChange={handleChange} required autoComplete="off" />
                      <datalist id="province-list">{(settings.province || []).map((opt, i) => <option key={i} value={opt} />)}</datalist>
                    </div>
                    <div>
                      <label style={labelStyle}>สถานที่หน้างาน {requiredMark}</label>
                      <input type="text" name="site_location" style={inputStyle} placeholder="กรอกสถานที่หน้างาน / ชื่อโครงการ / อาคาร" value={formData.site_location} onChange={handleChange} required />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div style={cardStyle}>
                <div style={sectionTitleStyle}><div style={numberBadge}>3</div> แหล่งที่มาและช่องทางติดต่อ</div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>รู้จักเราครั้งแรก (Known from) {requiredMark}</label>
                      <input list="known_from-list" name="known_from" style={inputStyle} placeholder="เลือกแหล่งที่มา" value={formData.known_from} onChange={handleChange} required autoComplete="off" />
                      <datalist id="known_from-list">{(settings.known_from || []).map((opt, i) => <option key={i} value={opt} />)}</datalist>
                    </div>
                    <div>
                      <label style={labelStyle}>ช่องทางติดต่อ {requiredMark}</label>
                      <input list="contact_channel-list" name="contact_channel" style={inputStyle} placeholder="เลือกช่องทางติดต่อ" value={formData.contact_channel} onChange={handleChange} required autoComplete="off" />
                      <datalist id="contact_channel-list">{(settings.contact_channel || []).map((opt, i) => <option key={i} value={opt} />)}</datalist>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>หมายเหตุช่องทาง (ถ้ามี)</label>
                    <input type="text" name="source_notes" style={inputStyle} placeholder="ระบุเพิ่มเติม" value={formData.source_notes} onChange={handleChange} />
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Section 4 */}
              <div style={cardStyle}>
                <div style={sectionTitleStyle}><div style={numberBadge}>4</div> รายละเอียดหน้างาน</div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>ลักษณะหน้างาน {requiredMark}</label>
                    <input list="site_char-list" name="site_char" style={inputStyle} placeholder="เลือกลักษณะหน้างาน" value={formData.site_char} onChange={handleChange} required autoComplete="off" />
                    <datalist id="site_char-list">{(settings.site_char || []).map((opt, i) => <option key={i} value={opt} />)}</datalist>
                  </div>
                  
                  <div>
                    <label style={labelStyle}>ประเภทฟิล์มที่สนใจ (เลือกได้มากกว่า 1)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                      {filmOptions.map((film) => (
                        <label key={film} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#475569', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            value={film} 
                            checked={formData.film_types.includes(film)} 
                            onChange={handleCheckboxChange} 
                            style={{ width: '16px', height: '16px', accentColor: '#1e40af' }} 
                          />
                          {film}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>รายละเอียดเพิ่มเติม</label>
                    <textarea name="job_details" rows={3} style={{ ...inputStyle, resize: 'none' }} placeholder="ระบุรายละเอียดเพิ่มเติมเกี่ยวกับหน้างาน" value={formData.job_details} onChange={handleChange} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>ขนาดพื้นที่โดยประมาณ (ตร.ม.)</label>
                      <input type="text" name="area_size" style={inputStyle} placeholder="เช่น 120 ตร.ม." value={formData.area_size} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={labelStyle}>อัปโหลดรูปหน้างาน</label>
                      <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '1rem', textAlign: 'center', background: '#f8fafc', cursor: 'pointer' }}>
                        <UploadCloud size={24} color="#64748b" style={{ margin: '0 auto 0.5rem' }} />
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>คลิกหรือลากไฟล์มาวาง<br/>รองรับไฟล์ JPG, PNG (ขนาดไม่เกิน 10MB)</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Section 5 */}
              <div style={cardStyle}>
                <div style={sectionTitleStyle}><div style={numberBadge}>5</div> ผู้รับผิดชอบภายใน</div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>ผู้รับผิดชอบ Admin {requiredMark}</label>
                      <input list="admin-list" name="admin" style={inputStyle} placeholder="เลือก Admin" value={formData.admin} onChange={handleChange} required autoComplete="off" />
                    </div>
                    <div>
                      <label style={labelStyle}>ฝ่ายขาย (Sales) {requiredMark}</label>
                      <input list="sale-list" name="sale" style={inputStyle} placeholder="เลือกฝ่ายขาย" value={formData.sale} onChange={handleChange} required autoComplete="off" />
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>วันที่ต้องติดตามครั้งถัดไป</label>
                      <input type="date" name="follow_up_date" style={inputStyle} value={formData.follow_up_date} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={labelStyle}>Priority (ระดับความสำคัญ)</label>
                      <select name="priority" style={inputStyle} value={formData.priority} onChange={handleChange}>
                        <option value="Hot Lead">🔴 Hot Lead</option>
                        <option value="Warm Lead">🟡 Warm Lead</option>
                        <option value="Cold Lead">🔵 Cold Lead</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>หมายเหตุภายใน</label>
                      <textarea name="internal_notes" rows={2} style={{ ...inputStyle, resize: 'none' }} placeholder="ระบุหมายเหตุภายใน" value={formData.internal_notes} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" onClick={(e) => handleSubmit(e, 'save')} style={{ background: '#ffffff', color: '#1e40af', border: '1px solid #1e40af', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <Save size={20} /> บันทึกข้อมูล
            </button>
            <button type="button" onClick={(e) => handleSubmit(e, 'send')} style={{ background: '#1e40af', color: '#ffffff', border: 'none', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(30, 64, 175, 0.4)' }}>
              <Send size={20} /> บันทึกและส่งต่อฝ่ายขาย
            </button>
          </div>

        </form>
      </div>

      {/* Toast Notification */}
      <div style={{
        position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 50,
        display: 'flex', alignItems: 'center', width: '100%', maxWidth: '320px', padding: '1rem', gap: '0.75rem',
        color: '#1e293b', background: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        borderLeft: '4px solid #22c55e',
        transform: toast ? 'translateX(0)' : 'translateX(120%)',
        transition: 'transform 0.3s ease-in-out'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: '2rem', height: '2rem', color: '#22c55e', background: '#dcfce3', borderRadius: '0.5rem' }}>
          <CheckCircle size={20} />
        </div>
        <div style={{ fontSize: '0.875rem', fontWeight: 500, flex: 1 }}>บันทึกข้อมูลสำเร็จ!</div>
        <button type="button" onClick={() => setToast(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem' }}>
          <X size={16} />
        </button>
      </div>

    </div>
  );
}
