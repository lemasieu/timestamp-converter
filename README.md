# Timestamp Converter

A powerful, dark‑themed web tool for converting Unix timestamps to human‑readable dates and vice versa, with IANA timezone support, automatic DST handling, and multiple output formats.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://xn--msiu-goa8b.vn/github/timestamp-converter/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## 📌 Description

**Timestamp Converter** is a client‑side web application that lets you convert Unix timestamps (seconds or milliseconds) to formatted date/time strings and back. It supports batch conversion, full IANA timezone selection (with automatic DST), and offers **six output formats** for timestamp‑to‑date conversions. A built‑in format table displays the current date in various standard formats (UTC, ISO 8601, RFC 822, RFC 2822, RFC 3339) for any selected result line.

All timezone logic uses the browser's native `Intl.DateTimeFormat` API, ensuring accurate DST transitions without external libraries.

---

## ✨ Features

- **Two‑way conversion**  
  - `Timestamp → Date/Time` – supports both 10‑digit (seconds) and 13‑digit (milliseconds) Unix timestamps.  
  - `Date/Time → Timestamp` – returns Unix time in seconds.

- **Batch processing** – Convert multiple values at once, one per line.

- **Full IANA timezone support** – Choose from 190+ countries and cities. DST is applied automatically based on the specific timestamp/date you enter.

- **Multiple output formats** – When converting timestamps to dates, you can choose from:  
  - **Default** – `YYYY-MM-DD HH:mm:ss` in the selected timezone.  
  - **UTC** – `YYYY-MM-DD HH:mm:ss UTC±offset`.  
  - **ISO 8601** – `YYYY-MM-DDTHH:mm:ss±offset`.  
  - **RFC 822 / RFC 1123** – `Day, DD Mon YYYY HH:mm:ss ±offset`.  
  - **RFC 2822** – `Day, DD-Mon-YY HH:mm:ss ±offset` (full weekday name).  
  - **RFC 3339** – `YYYY-MM-DDTHH:mm:ss±offset`.

- **Format table** – After conversion, a table displays the selected date in multiple standard formats (UTC, ISO, RFC 822, RFC 2822, RFC 3339, and local time). Use the dropdown to switch between different output lines.

- **Copy & Reset** – Copy all results to your clipboard with one click, or clear the entire form instantly.

- **Dark theme** – Easy on the eyes for late‑night coding sessions.

- **Fully client‑side** – No server, no API keys, no data sent anywhere. Runs entirely in your browser.

- **Responsive** – Works on desktop, tablet, and mobile devices.

---

## 🚀 Demo

Try the live version here:  
👉 [https://xn--msiu-goa8b.vn/github/timestamp-converter/](https://xn--msiu-goa8b.vn/github/timestamp-converter/)

---

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lemasieu/timestamp-converter.git
   ```

2. Go to the project folder:
   ```bash
   cd timestamp-converter
   ```

3. Open `index.html` in your favourite browser – or use a local development server (e.g., VS Code Live Server) for the best experience.

> Note: Because the tool fetches `data.json` via `fetch()`, you need to serve it through a web server (not directly with `file://`) to avoid CORS restrictions.

## 🧰 How to Use

**1. Enter your data** – Paste or type timestamps or date/time strings into the input box (one per line).
Supported formats:
- Timestamps: 10‑digit (seconds) or 13‑digit (milliseconds) numbers.
- Date/Time: YYYY-MM-DD HH:mm:ss, YYYY/MM/DD HH:mm:ss, and other formats recognised by new Date().

**2. Choose your timezone** – Pick a country from the first dropdown, then a city from the second. The tool shows the current offset (including DST) for that location.

**3. Select output format** – Choose your preferred date format from the dropdown (only applies when converting timestamps → dates).

**4. Select conversion direction**
- Click ⏰ Timestamp → Ngày giờ to get formatted date/time strings in your chosen format.
- Click 📅 Ngày giờ → Timestamp to get Unix timestamps (seconds).

**5. Preview format table** – After conversion, a table appears below the output. It displays the selected date in multiple standard formats. Use the dropdown to switch between different output lines.

**6. Copy or reset** – Use the 📋 Sao chép button to copy all output lines, or 🔄 Đặt lại to clear everything.

## 📁 Project Structure

```
timestamp-converter/
├── index.html          # Main HTML page
├── style.css           # Dark theme styles
├── script.js           # All conversion logic + IANA handling
├── data.json           # Timezone data (IANA, offset, country, city)
└── README.md           # This file
```

## 🛠️ Technology Stack

- **HTML5** – Semantic markup.
- **CSS3** – Custom properties, Flexbox, dark theme.
- **JavaScript (ES6+)** – async/await, Intl.DateTimeFormat, DOM manipulation.
- **JSON** – Timezone data with IANA identifiers.

All timezone logic relies on the browser’s built‑in `Intl.DateTimeFormat` API, which is updated regularly and supports DST out of the box.

## 🌍 Timezone Data

The timezone list is derived from the [Thales EMS documentation](https://docs.sentinel.thalesgroup.com/softwareandservices/ems/EMSdocs/WSG/Content/TimeZone.htm), then enriched with proper country and city names. Each entry uses a standard IANA identifier (e.g., Asia/Ho_Chi_Minh, America/New_York). This ensures that DST is applied correctly for any date you enter.

## 🤝 Contributing

- Contributions, bug reports, and feature requests are welcome!
- Feel free to open an [issue](https://github.com/lemasieu/timestamp-converter/issues) or submit a pull request.

## 📄 License

This project is open‑source and available under the MIT License. Created by Deepseek with my idea.

## 🙏 Acknowledgements

- [IANA](https://www.iana.org/time-zones) – for maintaining the timezone database.
- [Thales Group](https://www.thalesgroup.com/) – for the timezone reference list.
