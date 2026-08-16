// script.js – Chuyển đổi với IANA timezone, fetch data.json
// Hỗ trợ chọn định dạng output cho timestamp → datetime
// Tất cả các định dạng đều hiển thị theo múi giờ đã chọn (có offset)

document.addEventListener('DOMContentLoaded', function () {
  const inputBox = document.getElementById('inputBox');
  const outputBox = document.getElementById('outputBox');
  const toDateTimeBtn = document.getElementById('toDateTimeBtn');
  const toTimestampBtn = document.getElementById('toTimestampBtn');
  const copyBtn = document.getElementById('copyBtn');
  const resetBtn = document.getElementById('resetBtn');
  const countrySelect = document.getElementById('countrySelect');
  const citySelect = document.getElementById('citySelect');
  const timezoneInfo = document.getElementById('timezoneInfo');
  const outputFormatSelect = document.getElementById('outputFormatSelect');

  // Lưu trữ dữ liệu
  let allTimezones = [];
  let countryMap = {};               // { country: [ {city, iana}, ... ] }
  let countryCityToIANA = {};        // { "country|city": "iana" }

  // Lưu trạng thái hiện tại
  let currentMode = null;
  let currentInputLines = [];

  // ---------- 1. Fetch dữ liệu ----------
  async function loadTimezoneData() {
    try {
      const response = await fetch('data.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!data.timezones || !Array.isArray(data.timezones)) {
        throw new Error('Dữ liệu không đúng định dạng (thiếu mảng timezones)');
      }
      allTimezones = data.timezones;
      buildMaps();
      populateCountrySelect();
      const vietnam = allTimezones.find(tz => tz.country === 'Vietnam');
      if (vietnam) {
        countrySelect.value = 'Vietnam';
        updateCitySelect('Vietnam');
      } else {
        const firstCountry = Object.keys(countryMap)[0];
        if (firstCountry) {
          countrySelect.value = firstCountry;
          updateCitySelect(firstCountry);
        }
      }
      updateInfo();
    } catch (error) {
      console.error('Lỗi tải dữ liệu múi giờ:', error);
      timezoneInfo.textContent = '❌ Không thể tải dữ liệu múi giờ. Vui lòng kiểm tra file data.json.';
    }
  }

  function buildMaps() {
    countryMap = {};
    countryCityToIANA = {};
    allTimezones.forEach(item => {
      const country = item.country;
      const city = item.city;
      const key = `${country}|${city}`;
      if (!countryCityToIANA[key]) {
        if (!countryMap[country]) countryMap[country] = [];
        countryMap[country].push({ city, iana: item.iana });
        countryCityToIANA[key] = item.iana;
      }
    });
    const sortedCountries = Object.keys(countryMap).sort((a, b) => a.localeCompare(b));
    const sortedMap = {};
    sortedCountries.forEach(c => { sortedMap[c] = countryMap[c]; });
    countryMap = sortedMap;
  }

  function populateCountrySelect() {
    countrySelect.innerHTML = '';
    const countries = Object.keys(countryMap);
    countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country;
      option.textContent = country;
      countrySelect.appendChild(option);
    });
  }

  function updateCitySelect(country) {
    citySelect.innerHTML = '';
    const cities = countryMap[country] || [];
    if (cities.length === 0) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = '— Không có thành phố —';
      citySelect.appendChild(option);
      return;
    }
    cities.sort((a, b) => a.city.localeCompare(b.city));
    cities.forEach(item => {
      const option = document.createElement('option');
      option.value = item.city;
      option.textContent = item.city;
      citySelect.appendChild(option);
    });
    if (cities.length > 0) {
      citySelect.value = cities[0].city;
    }
    updateInfo();
  }

  // ---------- Lấy offset phút ----------
  function getTimezoneOffset(iana, date) {
    if (!iana) return 0;
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: iana,
        hour12: false,
        timeZoneName: 'longOffset'
      }).formatToParts(date);
      const tzPart = parts.find(p => p.type === 'timeZoneName');
      if (tzPart) {
        const match = tzPart.value.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
        if (match) {
          const sign = match[1] === '+' ? 1 : -1;
          const hours = parseInt(match[2]);
          const mins = match[3] ? parseInt(match[3]) : 0;
          return sign * (hours * 60 + mins);
        }
      }
    } catch (e) {
      console.warn('Lỗi lấy offset cho', iana, e);
    }
    return 0;
  }

  // ---------- Format date theo múi giờ (cách thủ công, chính xác) ----------
  function formatDateTimeInTimezone(date, iana) {
    const offsetMinutes = getTimezoneOffset(iana, date);
    const localTime = new Date(date.getTime() + offsetMinutes * 60000);
    const pad = n => String(n).padStart(2, '0');
    const y = localTime.getUTCFullYear();
    const m = pad(localTime.getUTCMonth() + 1);
    const d = pad(localTime.getUTCDate());
    const h = pad(localTime.getUTCHours());
    const min = pad(localTime.getUTCMinutes());
    const s = pad(localTime.getUTCSeconds());
    return `${y}-${m}-${d} ${h}:${min}:${s}`;
  }

  // ---------- Cập nhật thông tin múi giờ ----------
  function updateInfo(date = new Date()) {
    const country = countrySelect.value;
    const city = citySelect.value;
    const key = `${country}|${city}`;
    const iana = countryCityToIANA[key];
    if (country && city && iana) {
      const offsetMinutes = getTimezoneOffset(iana, date);
      const sign = offsetMinutes >= 0 ? '+' : '';
      const hours = Math.abs(Math.floor(offsetMinutes / 60));
      const mins = Math.abs(offsetMinutes % 60);
      const offsetStr = `GMT ${sign}${hours}${mins ? ':' + String(mins).padStart(2,'0') : ''}`;
      timezoneInfo.textContent = `📍 ${country} – ${city} (${iana}) • ${offsetStr}`;
    } else {
      timezoneInfo.textContent = '⚠️ Vui lòng chọn quốc gia và thành phố hợp lệ.';
    }
  }

  function updateInfoFromInput() {
    const firstLine = inputBox.value.split('\n')[0].trim();
    let dateForInfo = new Date();
    if (firstLine) {
      if (/^\d+$/.test(firstLine) && (firstLine.length === 10 || firstLine.length === 13)) {
        const ms = firstLine.length === 10 ? Number(firstLine) * 1000 : Number(firstLine);
        const d = new Date(ms);
        if (!isNaN(d.getTime())) dateForInfo = d;
      } else {
        const d = new Date(firstLine);
        if (!isNaN(d.getTime())) dateForInfo = d;
      }
    }
    updateInfo(dateForInfo);
  }

  // ---------- Lấy IANA từ country + city ----------
  function getSelectedIANA() {
    const country = countrySelect.value;
    const city = citySelect.value;
    const key = `${country}|${city}`;
    if (countryCityToIANA[key]) {
      return countryCityToIANA[key];
    }
    return 'UTC';
  }

  // ---------- Hàm chuyển đổi ----------
  function isTimestamp(str) {
    return /^\d+$/.test(str) && (str.length === 10 || str.length === 13);
  }

  function timestampToDate(timestamp) {
    const num = Number(timestamp);
    const ms = timestamp.length === 10 ? num * 1000 : num;
    const date = new Date(ms);
    if (isNaN(date.getTime())) return null;
    return date;
  }

  function dateToTimestamp(dateStr, iana) {
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
    if (match) {
      const year = parseInt(match[1]);
      const month = parseInt(match[2]) - 1;
      const day = parseInt(match[3]);
      const hour = parseInt(match[4]);
      const minute = parseInt(match[5]);
      const second = parseInt(match[6]);
      const localDate = new Date(Date.UTC(year, month, day, hour, minute, second));
      const offsetMinutes = getTimezoneOffset(iana, localDate);
      const timestampMs = localDate.getTime() - offsetMinutes * 60000;
      return Math.floor(timestampMs / 1000);
    } else {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return null;
      const offsetMinutes = getTimezoneOffset(iana, d);
      const timestampMs = d.getTime() - offsetMinutes * 60000;
      return Math.floor(timestampMs / 1000);
    }
  }

  // ---------- Định dạng với offset ----------
  function formatOffset(offsetMinutes) {
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const abs = Math.abs(offsetMinutes);
    const hours = String(Math.floor(abs / 60)).padStart(2, '0');
    const mins = String(abs % 60).padStart(2, '0');
    return `${sign}${hours}:${mins}`;
  }

  // ---------- Format date theo định dạng và múi giờ ----------
  function formatDate(date, format, iana) {
    const offsetMinutes = getTimezoneOffset(iana, date);
    const localTime = new Date(date.getTime() + offsetMinutes * 60000);
    const pad = n => String(n).padStart(2, '0');
    const y = localTime.getUTCFullYear();
    const m = pad(localTime.getUTCMonth() + 1);
    const d = pad(localTime.getUTCDate());
    const h = pad(localTime.getUTCHours());
    const min = pad(localTime.getUTCMinutes());
    const s = pad(localTime.getUTCSeconds());

    const offsetStr = formatOffset(offsetMinutes);
    const offsetStrUTC = `UTC${offsetStr}`;

    // Mặc định: YYYY-MM-DD HH:mm:ss (không có offset)
    if (format === 'default') {
      return `${y}-${m}-${d} ${h}:${min}:${s}`;
    }
    // UTC: YYYY-MM-DD HH:mm:ss UTC±offset
    if (format === 'utc') {
      return `${y}-${m}-${d} ${h}:${min}:${s} ${offsetStrUTC}`;
    }
    // ISO 8601: YYYY-MM-DDTHH:mm:ss±offset
    if (format === 'iso8601') {
      return `${y}-${m}-${d}T${h}:${min}:${s}${offsetStr}`;
    }
    // RFC 822: Day, DD Mon YYYY HH:mm:ss ±offset
    if (format === 'rfc822') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dayName = days[localTime.getUTCDay()];
      const monthName = months[localTime.getUTCMonth()];
      const day = String(localTime.getUTCDate()).padStart(2, '0');
      const year = localTime.getUTCFullYear();
      const offsetRFC = offsetStr.replace(':', ''); // RFC 822 dùng ±HHMM
      return `${dayName}, ${day} ${monthName} ${year} ${h}:${min}:${s} ${offsetRFC}`;
    }
    // RFC 2822: Day, DD-Mon-YY HH:mm:ss ±offset
    if (format === 'rfc2822') {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dayName = days[localTime.getUTCDay()];
      const monthName = months[localTime.getUTCMonth()];
      const day = String(localTime.getUTCDate()).padStart(2, '0');
      const year = String(localTime.getUTCFullYear()).slice(-2);
      const offsetRFC = offsetStr.replace(':', '');
      return `${dayName}, ${day}-${monthName}-${year} ${h}:${min}:${s} ${offsetRFC}`;
    }
    // RFC 3339: YYYY-MM-DDTHH:mm:ss±offset (giống ISO 8601)
    if (format === 'rfc3339') {
      return `${y}-${m}-${d}T${h}:${min}:${s}${offsetStr}`;
    }
    return `${y}-${m}-${d} ${h}:${min}:${s}`;
  }

  // ---------- Xử lý dòng ----------
  function processLine(line, mode, format) {
    const trimmed = line.trim();
    if (trimmed === '') return '';
    const iana = getSelectedIANA();

    if (mode === 'toDateTime') {
      if (isTimestamp(trimmed)) {
        const date = timestampToDate(trimmed);
        if (date === null) return '⚠️ Không hợp lệ (timestamp)';
        return formatDate(date, format, iana);
      } else {
        return '⚠️ Không phải timestamp (cần số 10 hoặc 13 chữ số)';
      }
    } else if (mode === 'toTimestamp') {
      const ts = dateToTimestamp(trimmed, iana);
      if (ts !== null) {
        return String(ts);
      } else {
        return '⚠️ Không thể phân tích ngày giờ';
      }
    }
    return '';
  }

  function renderOutput() {
    if (!currentMode || currentInputLines.length === 0) {
      outputBox.value = '';
      return;
    }
    const format = outputFormatSelect.value;
    const results = currentInputLines.map(line => processLine(line, currentMode, format));
    outputBox.value = results.join('\n');
  }

  function convert(mode) {
    const lines = inputBox.value.split('\n');
    currentInputLines = lines;
    currentMode = mode;
    renderOutput();
    updateInfoFromInput();
  }

  // ---------- Gán sự kiện ----------
  toDateTimeBtn.addEventListener('click', function () {
    convert('toDateTime');
  });

  toTimestampBtn.addEventListener('click', function () {
    convert('toTimestamp');
  });

  copyBtn.addEventListener('click', function () {
    const text = outputBox.value;
    if (!text) {
      alert('Không có gì để sao chép!');
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => alert('✅ Đã sao chép vào clipboard!'))
        .catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  });

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      alert('✅ Đã sao chép!');
    } catch (err) {
      alert('❌ Không thể sao chép, hãy copy thủ công.');
    }
    document.body.removeChild(textarea);
  }

  resetBtn.addEventListener('click', function () {
    inputBox.value = '';
    outputBox.value = '';
    currentInputLines = [];
    currentMode = null;
    inputBox.focus();
    updateInfo();
  });

  outputFormatSelect.addEventListener('change', function () {
    if (currentMode === 'toDateTime') {
      renderOutput();
    }
  });

  countrySelect.addEventListener('change', function () {
    const country = this.value;
    if (country) {
      updateCitySelect(country);
      if (currentMode) {
        renderOutput();
        updateInfoFromInput();
      }
    } else {
      citySelect.innerHTML = '<option value="">— Chọn quốc gia trước —</option>';
      timezoneInfo.textContent = '🌍 Vui lòng chọn quốc gia.';
    }
  });

  citySelect.addEventListener('change', function () {
    updateInfo();
    if (currentMode) {
      renderOutput();
      updateInfoFromInput();
    }
  });

  // ---------- Khởi tạo ----------
  loadTimezoneData();

  // Ví dụ mẫu
  inputBox.value = `1704067200\n2024-01-01 08:00:00\n1704067200000\n2024/12/31 23:59:59`;
});