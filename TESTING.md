# 🧪 Ghid de Testare - 4D Chess

## ✅ Status: GATA DE TESTARE!

Am integrat cu succes modelele `.obj`! Acum poți testa jocul.

---

## 🚀 Cum să Testezi

### 1. Pornește un Server Local

**Opțiune A: Python (recomandat)**
```bash
cd /Users/oana/Documents/4D/4d_chess
python3 -m http.server 8000
```

**Opțiune B: Node.js**
```bash
npm install -g http-server
cd /Users/oana/Documents/4D/4d_chess
http-server -p 8000
```

### 2. Deschide în Browser

```
http://localhost:8000
```

**Browsere recomandate:**
- ✅ Chrome (cel mai bun pentru WebGL)
- ✅ Firefox
- ✅ Edge

---

## 🔍 Ce Să Verifici

### Loading Screen
- ✅ Ar trebui să vezi un loading spinner
- ✅ Text: "Loading chess piece models..."
- ✅ Apoi: "Creating 4D game board..."
- ✅ Apoi: "Placing 256 chess pieces..."

### Console (F12 → Console)
Ar trebui să vezi:
```
🎮 Initializing 4D Chess...
✅ Three.js setup complete
✅ UI events setup complete
✅ Keyboard shortcuts setup complete
Loading models: ...%
✅ Loaded: pawn
✅ Loaded: rook
✅ Loaded: bishop
✅ Loaded: knight
✅ Loaded: queen
✅ Loaded: king
✅ All models loaded successfully!
🎮 Creating game board...
♟️ Placing pieces...
✅ Placed 256 pieces: 128 White + 128 Black
✅ 4D Chess is ready to play!
📊 Total pieces: 256 (128 white + 128 black)
📐 Board size: 8×8×8×8 = 4,096 positions
```

### Vizual
După loading:
- ✅ Ar trebui să vezi **tablele de șah** (plate 3D cu pattern checkerboard)
- ✅ Ar trebui să vezi **256 piese 3D** pe table
- ✅ UI-ul dark mode pe laterale
- ✅ Slider-ele W și Y funcționale

---

## 🎮 Controale de Testat

### Navigare 4D
- **W / S**: Schimbă axa W (vezi table diferite)
- **Q / E**: Schimbă axa Y (straturi verticale)
- **Slider W**: Drag pentru W = 0-7
- **Slider Y**: Drag pentru Y = 0-7

### Cameră
- **Mouse Drag**: Rotește camera
- **Scroll**: Zoom in/out
- **R**: Reset camera
- **Butoane**: Top View, Side View, Reset View

### UI
- Toate butoanele ar trebui să răspundă (chiar dacă unele nu fac încă nimic)
- Checkbox-urile se pot activa/dezactiva

---

## ❌ Probleme Posibile

### 1. "Failed to load resource" în Console
**Cauză**: CORS policy - browserul blochează fișierele locale

**Soluție**: TREBUIE să folosești un server local (vezi pasul 1)

### 2. "OBJLoader is not defined"
**Cauză**: OBJLoader nu s-a încărcat

**Verifică**:
- Conexiune la internet (OBJLoader se încarcă de pe CDN)
- Deschide Network tab în DevTools

### 3. Piesele nu se văd / sunt prea mari/mici
**Soluție**: Ajustează `SCALE_FACTOR` în `Models.js`:
```javascript
SCALE_FACTOR: 0.15,  // Încearcă valori între 0.05 și 0.5
```

### 4. Piesele sunt în poziții greșite
**Cauză**: Sistemul de coordonate al .obj

**Soluție**: Ajustează rotația în `Models.js`:
```javascript
rotation: new THREE.Vector3(90, 0, 0)  // Rotește pe X
```

### 5. Loading nu se termină niciodată
**Verifică Console**: Ar trebui să vezi mesaje de eroare

**Posibile cauze**:
- Fișierele .obj sunt corupte
- Path-ul către fișiere e greșit
- Lipsește un fișier

---

## 📊 Statistici Așteptate

După încărcare completă:

| Element | Număr |
|---------|-------|
| **Total poziții** | 4,096 (8×8×8×8) |
| **Total piese** | 256 |
| **Piese albe** | 128 (W=4,5,6,7) |
| **Piese negre** | 128 (W=0,1,2,3) |
| **Table vizibile** | 64 (8W × 8Y) |

---

## 🐛 Debug Tips

### Verifică dacă modelele s-au încărcat:
```javascript
// În Console (F12)
Models.geometries
Models.loadedObjects
```

Ar trebui să vezi obiecte pentru: pawn, rook, bishop, knight, queen, king

### Verifică tabla:
```javascript
gameBoard.pieces.length  // Ar trebui să fie 8
gameBoard.n              // Ar trebui să fie 8
```

### Contează piesele:
```javascript
let count = 0;
for(let x=0; x<8; x++)
  for(let y=0; y<8; y++)
    for(let z=0; z<8; z++)
      for(let w=0; w<8; w++)
        if(gameBoard.pieces[x][y][z][w].type) count++;
console.log('Total pieces:', count);  // Ar trebui să fie 256
```

---

## 📸 Screenshots

Când testezi, fă screenshot-uri la:
1. Loading screen
2. Jocul după încărcare (vedere generală)
3. Console log (pentru a vedea că totul s-a încărcat)
4. Piesele de aproape (zoom in)

---

## ✅ Checklist Testare

- [ ] Serverul local pornește fără erori
- [ ] Pagina se încarcă în browser
- [ ] Loading screen apare
- [ ] Console arată progres loading modele
- [ ] Toate cele 6 modele se încarcă (check console)
- [ ] Loading screen dispare după încărcare
- [ ] Se văd table de șah (checkerboard pattern)
- [ ] Se văd piese 3D pe table
- [ ] Slider W funcționează (schimbă vizualizarea)
- [ ] Slider Y funcționează
- [ ] Camera poate fi rotită cu mouse-ul
- [ ] Zoom funcționează (scroll)
- [ ] Butoanele UI răspund
- [ ] Nu sunt erori în Console

---

## 🎯 Ce Urmează După Testare

Dacă totul funcționează:
1. ✅ Raycasting pentru selecție piese
2. ✅ Highlight mișcări posibile (verde/roșu)
3. ✅ Sistem de mișcare cu animații
4. ✅ Detectare șah/șah-mat

---

**Spor la testare! 🚀**

Dacă întâmpini probleme, verifică Console-ul (F12) pentru mesaje de eroare detaliate.

