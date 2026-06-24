import { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import Papa from 'papaparse';

export default function ImportData() {
  const [isUploading, setIsUploading] = useState(false);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setSuccessCount(null);
    setError(null);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const importedRecords = results.data.map((row: any) => {
            const getCol = (keyParts: string[]) => {
              const matchingKey = Object.keys(row).find(k => keyParts.some(part => k.replace(/\n/g, '').includes(part)));
              return matchingKey ? row[matchingKey] : '';
            };

            return {
              customer_name: getCol(['ชื่อลูกค้า']) || 'ไม่ระบุชื่อ',
              contact: getCol(['เบอร์ติดต่อ']) || getCol(['Line @']) || '-',
              site_location: getCol(['สถานที่หน้างาน']) || '-',
              sale: getCol(['Sale']) || '-',
              status: getCol(['สถานะ']) || 'รอดำเนินการ',
              details: {
                month: getCol(['เดือน']),
                date: getCol(['วันที่']),
                customer_type_1: getCol(['ประเภท ลค.(1)']),
                contact_date: getCol(['Sวันที่บริษัทต่อ']),
                sale: getCol(['Sale']),
                department: getCol(['ฝ่าย/แผนก']),
                site_location: getCol(['สถานที่หน้างาน']),
                customer_name: getCol(['ชื่อลูกค้า']),
                company: getCol(['บริษัท']),
                contact_channel: getCol(['ช่องทาง']),
                line_id: getCol(['Line @']),
                note: getCol(['Note']),
                phone: getCol(['เบอร์ติดต่อ']),
                job_type: getCol(['ประเภทงาน']),
                customer_type_2: getCol(['ประเภท ลค.(2)']),
                additional_info: getCol(['ข้อมูลเพิ่มเติม']),
                entered_by: getCol(['ลงข้อมูลโดย']),
                quotation_no: getCol(['เลขที่ใบเสนอราคา']),
                glass_area: getCol(['หน้ากระจก']),
                film_area: getCol(['หน้าฟิล์ม', 'หน้าฟิล์ม (ตรฟ.)']),
                quotation_unit: getCol(['หน่วย']),
                proposed_film_model: getCol(['รุ่นฟิล์มที่เสนอราคา']),
                quotation_count: getCol(['จำนวนใบเสนอราคาที่ทำ']),
                status: getCol(['สถานะ']),
                install_month: getCol(['เดือนติดตั้ง']),
                install_date: getCol(['วันที่ติดตั้ง']),
                install_sale: getCol(['Sale']), 
                install_team: getCol(['ทีมช่าง ติดตั้ง']),
                technician_from: getCol(['ช่างของ']),
                bill_no: getCol(['เลขที่บิล']),
                install_job_type: getCol(['ประเภทงานติดตั้ง']),
                film_brand: getCol(['ยี่ห้อฟิล์ม']),
                installed_film_model: getCol(['รุ่นฟิล์มที่ติดตั้ง', 'รุ่นฟิล์มที่ติดตั้ง']),
                film_width: getCol(['หน้าฟิล์ม']),
                length_used: getCol(['ความยาวนิ้วที่ช่างใช้']),
                area_used_sqft: getCol(['พื้นที่ช่างใช้']),
                installed_area_sqft: getCol(['พื้นที่ที่ติดตั้ง']),
                install_unit: getCol(['หน่วย']),
                price_per_unit: getCol(['ราคา/หน่วย']),
                product_cost: getCol(['ค่าสินค้า']),
                operation_cost: getCol(['ค่าดำเนินการ']),
                total_amount: getCol(['ยอดรวม']),
                lost_reason: getCol(['สาเหตุ'])
              }
            };
          });

          let count = 0;
          for (const rec of importedRecords) {
            if (rec.customer_name === 'ไม่ระบุชื่อ' && rec.contact === '-') continue;
            
            const res = await fetch('http://localhost:3001/api/records', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(rec)
            });
            if (res.ok) count++;
          }
          
          setSuccessCount(count);
        } catch (err) {
          console.error(err);
          setError('เกิดข้อผิดพลาดในการอัปโหลดข้อมูล กรุณาตรวจสอบไฟล์และลองใหม่อีกครั้ง');
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      }
    });
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem', padding: '2rem 1.5rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>นำเข้าข้อมูล (Import Data)</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.875rem' }}>อัปโหลดไฟล์ฐานข้อมูลเดิมจาก Excel หรือ Google Sheets เข้าสู่ระบบ</p>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px dashed #cbd5e1', padding: '3rem 2rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ width: '64px', height: '64px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <UploadCloud size={32} />
        </div>
        
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>อัปโหลดไฟล์ .CSV</h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
          รองรับเฉพาะไฟล์ .csv เท่านั้น โปรดตรวจสอบให้แน่ใจว่าหัวข้อคอลัมน์ในไฟล์ตรงกับรูปแบบของระบบ
        </p>

        <input 
          type="file" 
          accept=".csv" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleImportCSV} 
        />

        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          style={{ 
            background: '#4f46e5', 
            color: 'white', 
            padding: '0.75rem 2rem', 
            borderRadius: '8px', 
            border: 'none', 
            fontSize: '1rem', 
            fontWeight: 600, 
            cursor: isUploading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            margin: '0 auto',
            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)',
            transition: 'all 0.2s',
            opacity: isUploading ? 0.7 : 1
          }}
        >
          {isUploading ? (
            <>กำลังอัปโหลดและประมวลผลข้อมูล...</>
          ) : (
            <><FileText size={20} /> เลือกไฟล์เพื่อนำเข้า</>
          )}
        </button>

        {/* Success Message */}
        {successCount !== null && (
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#dcfce3', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#166534', justifyContent: 'center' }}>
            <CheckCircle size={20} />
            <span style={{ fontWeight: 600 }}>อัปโหลดข้อมูลสำเร็จทั้งหมด {successCount} รายการ!</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#fee2e2', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#991b1b', justifyContent: 'center' }}>
            <AlertCircle size={20} />
            <span style={{ fontWeight: 600 }}>{error}</span>
          </div>
        )}

      </div>
    </div>
  );
}
