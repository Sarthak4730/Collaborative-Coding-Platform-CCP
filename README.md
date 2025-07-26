# 🚀 Collaborative Coding Platform (CCP)
**Deployed** - https://ccp-by-sk.vercel.app

**CCP** - your zero-setup, multi-language, real-time coding platform. Perfect for teaching, interviews, pair-programming, or collaborative debugging. Enjoy coding in sync! 🎉

**CCP** is a full‑stack real‑time collaborative code editor built with the MERN stack and Socket.IO. It allows users to - create or join coding rooms, collaborate on code together, chat in real-time, execute multi-language code — all within a clean, modern interface.

---

## 🔍 Features

- **🛡️ Secure Room Access**  
  Login & Register features powered by JWT & bcrypt. Room access is given to authenticated users only.

- **🔗 Room Creation & Sharing**  
  Generate and share unique room code. Users can join via code.

- **💻 Real‑Time Code & Cursor Sync**  
  Shared editor powered by Monaco with live typing sync. Visual cursors show collaborators’ names in real-time.

- **💬 Built‑in Chat**  
  Text chat embedded alongside the editor with messages tagged by username.

- **🌐 Multi‑Language Support**  
  Compile and run C++, Java, and Python code instantly using Piston API with support for stdin (custom input). Leader selects the editor Language.

- **🔄 Code Execution Sync**  
   Code, language selection, input and output sync across all participants. When anyone clicks “Run”, the entire room is locked with a loader overlay.

- **📊 Room Participants UI**  
  Live member count and "X joined / left" toasts powered by Socket.IO events and SweetAlert2.

- **🎨 Sleek & Responsive UI**  
  Modern visual design with gradient themes, tilt effects on feature cards, and animated typewriter hero intro.

---

## 🧰 Tech Stack

### Frontend
- **React** with **Vite** for optimized development.
- **Tailwind CSS** for utility-first styling.
- **Monaco Editor** for a rich code editing experience.
- **Socket.IO Client** for bi-directional real-time syncing.
- **Axios** for API calls to the Piston execution endpoint.
- **React Router DOM** for route navigation with protection.
- **React UI Components** such as - Icons, SweetAlert2, SimpleTypewriter, LottieFiles, ParallaxTilt, Select, LoadingIndicators - for polished UI and interaction.

### Backend
- **MongoDB** (via Atlas) + **Mongoose** for user data storage.
- **Express** + **Node.js** for REST APIs.
- **Socket.IO Server** for room management - real-time code, cursor, chat, and member syncing.
- **JWT + bcrypt Auth** for secure route protection.

---

## 🚀 Quick Start

### Backend

```bash
cd Backend
npm install
# create .env with PORT, MONGO_URI and JWT_SECRET
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
# set FRONTEND_URL and BACKEND_URL in ENVIRONMENT VARIABLES
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📦 Production Deployment

- **Frontend** ➜ Deploy on [Vercel] with SPA-friendly rewrites.
- Use `.vercel.json` to redirect dynamic routes (e.g., `/room/:id`) to index.html letting react-router-dom handle routing.
- **Backend** ➜ Deploy on [Render] with live WebSocket endpoint.
- Ensure proper configuration of CORS and Socket.IO origin settings.

---

## 🔮 Future Enhancements

- Support for more languages.
- Transfer leadership controls.
- Multi-file environment and upload local files.
- Show cursor-selection and syntax-based auto-complete.
- Mobile-responsive layout and accessibility improvements.
- Confetti on room-entry, red-alert-screen-shake on input invalid room code, one-by-one digit reveal for create-room page.

---

## 📋 Demonstration

[▶️ Watch Demo Video](./assets/demo.mp4)

---

## 🧠 Project Architecture

```
Client (React + MonacoEditor + Socket.IO-Client) ──↔── Server (MongoDB + Express + Node + Socket.IO-Server)
      └── JWT + bcrypt Login & Register.
      └── /create-room → generate room code.
      └── /join-room → input code and enter room.
      └── RoomPage: code-editor & chatbox - write, compile, run code & chat with members.
```

---

## 🤝 Contributions & Feedback

Need features, bug fixes, or UI tweaks? Raise GitHub issues or open pull requests — happy to collaborate!  
Star ⭐ if you find this project useful.

---

## 📬 Contact

- Author: **Sarthak Kharade** - 🎓 Computer Engineer
- Email: **sarthak.kharade.dev@gmail.com**
