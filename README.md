# 🎮 4D Chess - Four-Dimensional Chess Game

Un joc de șah în 4 dimensiuni (8×8×8×8) construit cu **JavaScript** și **Three.js**.

## 📊 Status Implementare

### ✅ Completat (GATA DE TESTARE!)

- **FAZA 1**: Setup inițial (HTML, CSS Dark Mode, Three.js Scene) ✅
- **FAZA 2**: GameBoard.js modificat pentru n=8 (8×8×8×8) ✅
- **FAZA 3**: Adaptare Models.js pentru **OBJ loader** ✅
- **FAZA 4**: Poziții inițiale pentru 256 piese (128 albe + 128 negre) ✅
- **FAZA 5**: Logica mișcărilor 4D pentru toate piesele ✅

**🎉 JOC FUNCȚIONAL! Poți vedea tabla 4D cu 256 piese 3D!**

### 🔨 În lucru

- **FAZA 6**: Sistem de interacțiune (raycasting, selecție, highlight)
- **FAZA 7**: UI complet funcțional
- **FAZA 8**: Reguli de joc complete (șah, șah-mat, validare)
- **FAZA 9**: Features avansate (SAVE/LOAD, castling, en passant)
- **FAZA 10**: Polish și optimizări

### 📝 Vezi `TESTING.md` pentru instrucțiuni de testare!

---

## 🎯 Concept

### Împărțire Teritorială

Tabla 4D este împărțită pe **axa W** (dimensiunea a 4-a):

```
┌──────────────────────┬──────────────────────┐
│  NEGRU (Team 1)      │  ALB (Team 0)        │
│  W = 0, 1, 2, 3      │  W = 4, 5, 6, 7      │
│  128 piese           │  128 piese           │
└──────────────────────┴──────────────────────┘
```

### Spațiul de Joc

- **Total poziții**: 8 × 8 × 8 × 8 = **4,096 poziții**
- **Total piese**: **256 piese** (128 per jucător)
- Fiecare jucător are **4 table complete** de 8×8

### Coordonate 4D

```javascript
Position = (x, y, z, w)
- X: Orizontală (0-7)
- Y: Straturi verticale (0-7)
- Z: Profunzime (0-7)
- W: Dimensiunea a 4-a (0-7)
```

---

## 📐 Mișcări Pieselor în 4D

### Pawn (Pionul)
- Mișcare forward pe axele Z și Y
- Captură diagonală în planurile XZ, XY, YZ
- Promovare când ajunge la z=7, y=7 (alb) sau z=0, y=0 (negru)

### Rook (Tura)
- **8 direcții**: ±X, ±Y, ±Z, ±W
- Mișcare liniară pe orice axă

### Bishop (Nebunul)
- **24 direcții**: diagonale în toate planurile 2D
- Planuri: XY, XZ, XW, YZ, YW, ZW

### Knight (Calul)
- **48 mișcări**: mișcare "L" în orice combinație de 2 axe
- 2 pași pe o axă, 1 pas pe alta

### Queen (Regina)
- **32 direcții**: combinație Rook + Bishop
- Cea mai puternică piesă

### King (Regele)
- **80 poziții adiacente**: 1 pas în orice direcție
- **Regulă**: Orice rege în șah-mat = pierdere

---

## 🚀 Cum să Rulezi Jocul

### Metoda 1: Direct în Browser

1. Deschide `index.html` într-un browser modern (Chrome, Firefox, Edge)
2. **Notă**: Unele browsere blochează loading-ul fișierelor locale. Folosește un server local.

### Metoda 2: Python Server Local

```bash
# Python 3
cd /Users/oana/Documents/4D/4d_chess
python3 -m http.server 8000

# Apoi deschide în browser:
http://localhost:8000
```

### Metoda 3: Node.js Server Local

```bash
# Instalează http-server
npm install -g http-server

# Rulează server
cd /Users/oana/Documents/4D/4d_chess
http-server -p 8000

# Deschide în browser:
http://localhost:8000
```

---

## 🎮 Controale

### Navigare 4D

| Control | Acțiune |
|---------|---------|
| **W / S** | Schimbă axa W (±1) |
| **Q / E** | Schimbă axa Y (±1) |
| **Slider W** | Selectează W-axis (0-7) |
| **Slider Y** | Selectează Y-axis (0-7) |

### Cameră

| Control | Acțiune |
|---------|---------|
| **Mouse Drag** | Rotește camera (orbit) |
| **Scroll** | Zoom in/out |
| **Right Click + Drag** | Pan camera |
| **R** | Reset camera |

### Joc

| Control | Acțiune |
|---------|---------|
| **Click pe piesă** | Selectează piesa |
| **Click pe highlight** | Mută piesa |
| **ESC** | Deselect piesa |
| **Ctrl + Z** | Undo |
| **Ctrl + Y** | Redo |

---

## 📂 Structura Proiectului

```
4d_chess/
├── index.html              # Entry point
├── README.md               # Documentație
├── PLAN_4D_CHESS.md       # Plan detaliat complet
│
├── css/
│   └── main.css           # Dark mode styling
│
├── js/
│   ├── main.js            # Bootstrap & game loop
│   └── pieces/            # Clase piese
│       ├── Piece.js       # Clasa de bază
│       ├── Pawn.js        # Pion 4D
│       ├── Rook.js        # Tură 4D
│       ├── Bishop.js      # Nebun 4D
│       ├── Knight.js      # Cal 4D
│       ├── Queen.js       # Regină 4D
│       └── King.js        # Rege 4D
│
├── GameBoard.js            # Logica tablei 4D
├── MoveManager.js          # Manager mișcări
├── Models.js               # Loader modele 3D
│
└── models/                 # Modele 3D piese (GLB)
    └── *.model.json       # Modele temporare JSON
```

---

## 🔧 Componente Tehnice

### Stack

- **JavaScript ES6+**
- **Three.js** (r128) - Rendering 3D
- **OrbitControls** - Control cameră
- **GLTFLoader** - Loading modele 3D (când vor fi GLB)

### Browsere Suportate

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

---

## 📝 TO-DO Next Steps

### Prioritate Înaltă

1. **Primire modele GLB** pentru piese (Pawn, Rook, Bishop, Knight, Queen, King)
2. **Adaptare Models.js** pentru GLTFLoader
3. **Implementare raycasting** pentru selecție piese
4. **Highlight mișcări posibile** (verde/roșu)
5. **Sistem de mișcare** cu animații

### Prioritate Medie

6. **Detectare șah/șah-mat** completă
7. **Validare mișcări** (nu te poți pune în șah)
8. **Alternanță turelor** (alb/negru)
9. **Move history** vizuală
10. **SAVE/LOAD** joc (JSON)

### Prioritate Joasă

11. **Castling** pe fiecare tablă
12. **En passant** în 4D
13. **Sound effects** (opțional)
14. **Tutorial/Help** modal
15. **AI opponent** (viitor)

---

## 🎨 UI Design

### Color Scheme (Dark Mode)

| Element | Color | Hex |
|---------|-------|-----|
| Background Primary | Very Dark Blue | `#0a0e27` |
| Background Secondary | Dark Navy | `#141933` |
| Accent Primary | Cyan | `#00d4ff` |
| Accent Secondary | Purple | `#7b2ff7` |
| Success | Green | `#00ff88` |
| Danger | Red | `#ff3366` |
| Warning | Orange | `#ffaa00` |

---

## 📖 Documentație Completă

Vezi `PLAN_4D_CHESS.md` pentru:
- Formule matematice pentru mișcări
- Algoritmi de detectare șah
- Strategii de vizualizare 4D→3D
- Specificații tehnice complete

---

## 👨‍💻 Dezvoltat de

**Oana** - Concept și specificații  
**AI Assistant** - Implementare și cod

**Data început**: 30 Octombrie 2025  
**Status**: 🔨 În dezvoltare activă

---

## 📄 Licență

Acest proiect este pentru uz personal și educațional.

---

## 🐛 Bug Reports & Features

Pentru bug-uri sau feature requests, discută direct cu dezvoltatorul.

---

**🎮 Have fun playing 4D Chess! 🚀**

