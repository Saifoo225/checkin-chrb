const OFFICE_LAT = 6.6241405;
const OFFICE_LNG = 101.2301620;
const LIMIT = 100;

function calcDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function send(action) {
  navigator.geolocation.getCurrentPosition(pos => {
    const d = calcDistance(
      pos.coords.latitude,
      pos.coords.longitude,
      OFFICE_LAT,
      OFFICE_LNG
    );
    if (d > LIMIT) {
      status.innerText = "❌ อยู่นอกพื้นที่ปฏิบัติหน้าที่";
      return;
    }
    fetch("https://script.google.com/macros/s/AKfycbxCsB4Nlh5968iKixOLa944XanxvXiczKXiI17Kui0QrLa9_ClCHv1K-RbMohFF3c8t/exec", {
      method: "POST",
      body: JSON.stringify({
        empid: empid.value,
        name: name.value,
        action: action,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      })
    });
    status.innerText = "✅ " + action + " เรียบร้อย";
  }, () => {
    status.innerText = "❌ กรุณาเปิด GPS";
  });
}

function checkIn(){ send("เช็คอิน"); }
function checkOut(){ send("เช็คเอาท์"); }
