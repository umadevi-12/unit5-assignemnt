
## **2️⃣ Backend Repo - README.md**

```markdown
# Recipe Sharing Platform - Backend

This is the **backend** of the Recipe Sharing Platform built with **Node.js** and **Express.js**. It handles user authentication, recipe management, favorites, likes, comments, and image/video uploads.

---

## **Features**

- User registration and login with JWT
- CRUD operations for recipes
- Favorite, like, and comment support
- Image/video upload via Cloudinary
- Firestore integration for storing recipes and user data
- Role-based access control (Admin/User)
- RESTful API endpoints

---

## **Folder Structure**

backend/
│
├── routes/
│ ├── auth.js
│ ├── recipes.js
│ └── users.js
│
├── middleware/
│ └── authMiddleware.js
│
├── models/
│ ├── User.js
│ └── Recipe.js
│
├── server.js
├── package.json
└── README.md

