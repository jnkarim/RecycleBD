# ♻️ RecycleBD
**Bangladesh's First Intelligent Waste Marketplace**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Dhaka generates over 6,000 tons of solid waste daily. While a massive parallel recycling economy exists (scrap dealers, tokais), it suffers from a lack of **Trust**, **Transparency**, and **Convenience**. 

**LoopBD** bridges the gap between everyday citizens and verified waste collectors using AI-powered waste identification, transparent market pricing, and optimized localized pickups. 

*Built as an MVP for hackathon demonstration.*

---

## ✨ Features

### For Users
* **🤖 AI Waste Scanner:** Upload a photo of your waste. Google Gemini AI automatically categorizes it (Plastic, Paper, Metal, E-Waste).
* **💰 Transparent Pricing:** Real-time visibility of standard scrap market rates. No more unfair negotiations.
* **📍 Easy Pickup Requests:** Submit estimated weight and location to notify nearby collectors instantly.

### For Collectors
* **🚛 Live Dashboard:** View real-time, nearby pickup requests.
* **💸 Seamless Transactions (Mock):** One-click "Collect & Pay" simulation via bKash/Nagad.

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas
* **Artificial Intelligence:** Google Gemini API (`gemini-1.5-flash`) for image classification
* **Image Handling:** Multer (Memory Storage)

---

## 🚀 Getting Started (Local Setup)

Follow these steps to run the project locally on your machine.

### Prerequisites
* Node.js installed
* A free MongoDB Atlas cluster
* A free Google Gemini API Key (get it from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/loopbd.git](https://github.com/your-username/loopbd.git)
cd loopbd
