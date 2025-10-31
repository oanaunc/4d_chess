# 4D Chess - Deployment Guide

This guide explains how to upload your 4D Chess game to your website using FileZilla.

## 📁 Files to Upload

Upload ALL of the following files and folders to your web server:

### **Root Files (Main Directory)**
- `index.html` ⭐ **REQUIRED** - Main HTML file
- `GameBoard.js` - Game board logic
- `Models.js` - 3D model loader
- `MoveManager.js` - Move management system

### **CSS Folder**
```
css/
  └── main.css  ⭐ **REQUIRED** - All styles
```

### **JavaScript Folder**
```
js/
  ├── main.js  ⭐ **REQUIRED** - Main application
  ├── Animation.js - Animation system
  ├── Bot.js - Bot AI
  ├── PieceMovement.js - Piece movement logic
  ├── tutorial.js - Tutorial system
  │
  ├── graphics/
  │   └── logo_chess.png  ⭐ **REQUIRED** - Logo image
  │
  └── pieces/
      ├── Piece.js - Base piece class
      ├── King.js - King piece logic
      ├── Queen.js - Queen piece logic
      ├── Rook.js - Rook piece logic
      ├── Bishop.js - Bishop piece logic
      ├── Knight.js - Knight piece logic
      ├── Pawn.js - Pawn piece logic
      │
      └── obj_pieces/  ⭐ **REQUIRED** - 3D Models
          ├── Bishop.obj
          ├── King.obj
          ├── Knight V1.obj
          ├── Pawn.obj
          ├── Queen.obj
          └── Rook.obj
```

### **Optional Files** (Not required but nice to have)
- `README.md` - Documentation
- `PLAN_4D_CHESS.md` - Development plan
- `TESTING.md` - Testing notes

### **Files NOT to Upload**
- ❌ `example/` folder - This is just example code, not needed
- ❌ `assets/` folder - Currently empty/unused
- ❌ `models/` folder - Models are in `js/pieces/obj_pieces/`
- ❌ Any `.md` files except README if you want

---

## 🚀 Step-by-Step Upload Instructions

### **Option 1: Upload via FileZilla (Recommended)**

1. **Open FileZilla**
   - Enter your FTP credentials
   - Connect to your web server

2. **Navigate to your website's root directory**
   - Usually `public_html/`, `www/`, `htdocs/`, or `html/`
   - Check with your hosting provider if unsure

3. **Create a folder for the game** (optional but recommended)
   - Example: `public_html/4d-chess/`
   - Or upload directly to root if this is your main page

4. **Upload the files maintaining the folder structure:**
   ```
   Your Website/
   ├── index.html
   ├── GameBoard.js
   ├── Models.js
   ├── MoveManager.js
   ├── css/
   │   └── main.css
   └── js/
       ├── main.js
       ├── Animation.js
       ├── Bot.js
       ├── PieceMovement.js
       ├── tutorial.js
       ├── graphics/
       │   └── logo_chess.png
       └── pieces/
           ├── Piece.js
           ├── King.js
           ├── Queen.js
           ├── Rook.js
           ├── Bishop.js
           ├── Knight.js
           ├── Pawn.js
           └── obj_pieces/
               ├── Bishop.obj
               ├── King.obj
               ├── Knight V1.obj
               ├── Pawn.obj
               ├── Queen.obj
               └── Rook.obj
   ```

5. **Set file permissions** (if needed):
   - Files: `644`
   - Folders: `755`
   - Most hosting providers set these automatically

6. **Test your game:**
   - Visit: `https://yourwebsite.com/4d-chess/` (if in subfolder)
   - Or: `https://yourwebsite.com/index.html` (if in root)

---

## ✅ Quick Checklist

Before going live, verify:

- [ ] `index.html` is in the root or your chosen folder
- [ ] `css/main.css` exists in `css/` folder
- [ ] All `js/*.js` files are uploaded
- [ ] `js/graphics/logo_chess.png` exists
- [ ] All piece files in `js/pieces/` are uploaded
- [ ] All `.obj` model files in `js/pieces/obj_pieces/` are uploaded
- [ ] Folder structure matches exactly (case-sensitive on Linux servers!)

---

## 🌐 Access Your Game

Once uploaded, access your game at:

- **If uploaded to root:** `https://yourwebsite.com/index.html`
- **If in subfolder:** `https://yourwebsite.com/4d-chess/index.html`

You can rename `index.html` to anything, but `index.html` is typically the default page.

---

## ⚠️ Important Notes

1. **Three.js is loaded from CDN** - No need to upload Three.js files, they load automatically from:
   - `cdnjs.cloudflare.com`
   - `cdn.jsdelivr.net`

2. **Case Sensitivity** - Linux servers are case-sensitive:
   - `Logo.png` ≠ `logo.png`
   - Make sure file names match exactly

3. **File Permissions** - Some servers require specific permissions:
   - Files: `644` (rw-r--r--)
   - Folders: `755` (rwxr-xr-x)

4. **HTTPS Recommended** - The game works on HTTP, but HTTPS is recommended for security

5. **Browser Compatibility** - Works on modern browsers:
   - Chrome/Edge (recommended)
   - Firefox
   - Safari
   - Opera

---

## 🐛 Troubleshooting

**Game doesn't load:**
- Check browser console (F12) for errors
- Verify all files uploaded correctly
- Check file paths match exactly

**3D models don't appear:**
- Verify `.obj` files are in `js/pieces/obj_pieces/`
- Check browser console for 404 errors
- Ensure file names match exactly (case-sensitive)

**Logo doesn't show:**
- Verify `js/graphics/logo_chess.png` exists
- Check file permissions

**Styling looks broken:**
- Verify `css/main.css` uploaded
- Check path in `index.html`: `<link rel="stylesheet" href="css/main.css">`

---

## 📝 FileZilla Quick Tips

1. **Maintain folder structure** - Drag entire folders, not just files
2. **Binary transfer** - FileZilla should auto-detect, but if images/models don't work, set transfer type to "Binary"
3. **Upload queue** - You can queue many files and upload all at once
4. **Synchronization** - Use "Synchronize directories" to update only changed files

---

## 🎮 That's It!

Your 4D Chess game should now be live on your website! 

If you encounter any issues, check the browser console (F12 → Console tab) for error messages.

Good luck! 🚀


