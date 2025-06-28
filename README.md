
# 🖥️ Markdown Presentation App

🎯 **A simplified PowerPoint-like app built with React + Node.js where you can write your presentation slides in Markdown.**


---

## 📦 Tech Stack

| Layer         | Technology                         |
|---------------|------------------------------------|
| Frontend      | React.js, Vite, Context API, Tailwind (optional) |
| Backend       | Node.js, Express.js                |
| Database      | SQLite + Sequelize ORM             |
| File Uploads  | Multer                             |
| Markdown      | Custom Markdown-to-React parser    |
| Tests         | Vitest + React Testing Library     |
| Component UI  | Storybook                          |

---

## ✅ Features

- 🧠 Create, update, delete slides
- ✍️ Write in **Markdown** with image support
- 🖼 Upload and insert images with preview
- 🔄 Navigate between slides (hotkeys: ←/→)
- 🧩 Multiple layouts (default, title-only, code, image-focused)
- 📈 Progress bar to indicate current slide
- ⚡ Mobile responsive UI
- 🧪 Unit + Integration testing
- 🌙 Light & Clean UI
- 📘 Component library preview via Storybook

---

## 🛠️ Getting Started

### 🔧 Installation

```bash
git clone https://github.com/mohamedalgaml/markdown-presentation-app.git
cd markdown-presentation-app
```

Install both `client` and `server` dependencies:

```bash
# In /client
npm install

# In /server
npm install
```

---

### 🚀 Run Locally

**Start the backend:**

```bash
cd server
node index.js
```

**Start the frontend:**

```bash
cd client
npm run dev
```

**Visit:** `http://localhost:5173`

---

## 🔬 Testing

```bash
# In client directory
npm run test
```

---

## 🧪 Storybook (Components Preview)

```bash
# In client directory
npm run storybook
```

---

## 🗂 Project Structure

```
.
├── client
│   ├── components/
│   ├── context/SlidesContext.jsx
│   ├── App.jsx
│   └── ...
├── server
│   ├── index.js
│   ├── models/Slide.js
│   └── routes/
│       ├── slidesRoutes.js
│       └── uploadRoute.js
```

---

## 📋 Example Markdown

```md
# Hello Slide

This is a **bold** text with an image:

![My Image](http://localhost:5000/uploads/sample.png)

- Point 1
- Point 2
```

---

## 📊 Architecture

- **Frontend:** React SPA with local context state for managing slide navigation, editing, and syncing.
- **Backend:** REST API to manage slides with Sequelize ORM + SQLite storage.
- **Image Upload:** Multer stores files in `/uploads`, URLs stored in DB.
- **Markdown Parsing:** Custom parser turns AST into React components directly.
- **Extensibility:** Easily upgradable to support user auth, themes, or export to PDF.

---

## 🚧 Challenges

- Parsing Markdown to **React elements** instead of raw HTML.
- Managing real-time updates and ordering of slides.
- Supporting different slide layouts and keeping layout logic clean.
- File upload and preview handling via Markdown editor.

---

## 🔗 Links

- 🧠 GitHub: [(https://github.com/mohamedalgaml/markdown-presentation-app.git)]
- 📁 DB: `server/slides.db` 

---

## 📌 To Do (Future Scope)

- [ ] User authentication
- [ ] Export slides to PDF
- [ ] Collaborative editing (WebSockets)
- [ ] Custom themes per slide
