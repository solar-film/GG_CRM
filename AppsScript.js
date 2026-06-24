/**
 * ==========================================
 * Google Apps Script (GAS) สำหรับอัปเดตงานหลุด
 * ==========================================
 * 
 * วิธีการติดตั้ง:
 * 1. เปิดไฟล์ Google Sheets ของคุณ
 * 2. ไปที่เมนู Extensions (ส่วนขยาย) > Apps Script
 * 3. ลบโค้ดเก่าทิ้งทั้งหมด แล้วก๊อปปี้โค้ดในไฟล์นี้ไปวาง
 * 4. ไปที่เมนู Deploy > New deployment (การทำให้ใช้งานได้แบบใหม่)
 *    - Select type: Web App
 *    - Execute as: Me (ตัวคุณเอง)
 *    - Who has access: Anyone (ทุกคน)
 * 5. กด Deploy แล้วก็อปปี้ "Web App URL" ที่ได้ เอาไปใส่ในไฟล์ Sales_DataEntry.html
 */

const SHEET_NAME = 'Sheet1'; // <-- เปลี่ยนชื่อชีตให้ตรงกับที่เก็บข้อมูลหลัก (เช่น 'Data', 'Customer')

function doPost(e) {
  try {
    // กำหนด Header สำหรับ CORS เพื่อให้เรียกข้ามโดเมนได้
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    
    // ตรวจสอบข้อมูลที่รับมา
    if (!e || !e.postData || !e.postData.contents) {
      return output.setContent(JSON.stringify({ status: 'error', message: 'No data provided' }));
    }

    const data = JSON.parse(e.postData.contents);
    const customerName = data.customerName;
    const saleRep = data.saleRep;
    const location = data.location;
    
    const newStatus = data.status; // Col X
    const newDate = data.date; // Col Z (yyyy-mm-dd)
    const newMonth = data.month; // Col Y (e.g. "มิ.ย. 66")
    const newReason = data.reason; // Col AQ
    
    if (!customerName || !saleRep) {
      return output.setContent(JSON.stringify({ status: 'error', message: 'Missing identifying data' }));
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0]; // หาชีตตามชื่อ หรือเอาชีตแรกสุด
    
    // ดึงข้อมูลทั้งหมดมาเพื่อค้นหาบรรทัดที่ต้องการอัปเดต
    const allData = sheet.getDataRange().getValues();
    let targetRowIndex = -1;
    
    // ค้นหาหาแถวที่ตรงกัน
    // หมายเหตุ: โค้ดนี้สมมติว่า Header อยู่บรรทัดแรก (index 0) ข้อมูลเริ่มบรรทัดที่ 2 (index 1)
    for (let i = 1; i < allData.length; i++) {
      const row = allData[i];
      // ปรับ index ตามคอลัมน์จริงใน Sheet (index เริ่มที่ 0)
      // C = 2 (ชื่อลูกค้า)
      const sheetCustomer = row[2] ? String(row[2]).trim() : ''; 
      
      if (sheetCustomer === customerName.trim()) {
        targetRowIndex = i + 1; // +1 เพราะ getValues เริ่มที่ 0 แต่ getRange เริ่มที่ 1
        break;
      }
    }
    
    if (targetRowIndex === -1) {
      return output.setContent(JSON.stringify({ status: 'error', message: 'Customer not found' }));
    }
    
    // อัปเดตข้อมูล (คำนวณคอลัมน์จาก A=1, B=2, ... X=24, Y=25, Z=26, AQ=43)
    if(newStatus) sheet.getRange(targetRowIndex, 24).setValue(newStatus); // Col X
    if(newMonth) sheet.getRange(targetRowIndex, 25).setValue(newMonth); // Col Y
    if(newDate) sheet.getRange(targetRowIndex, 26).setValue(newDate); // Col Z
    if(newReason) sheet.getRange(targetRowIndex, 43).setValue(newReason); // Col AQ
    
    return output.setContent(JSON.stringify({ 
      status: 'success', 
      message: 'Data updated successfully',
      row: targetRowIndex
    }));
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'error', 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  // ตอบกลับ preflight request สำหรับ CORS
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
