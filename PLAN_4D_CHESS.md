# 📐 PLAN DETALIAT: ȘAH 4D (8×8×8×8)
## A Mathematical Framework for Four-Dimensional Chess

**Status:** 🔨 În dezvoltare  
**Versiune:** 1.0  
**Data:** 30 Octombrie 2025  
**Framework:** JavaScript + Three.js

---

## 📋 CUPRINS

1. [概念 de Bază](#1-concepte-de-bază)
2. [Sistemul de Coordonate 4D](#2-sistemul-de-coordonate-4d)
3. [Împărțirea Teritorială](#3-împărțirea-teritorială)
4. [Numărul Total de Piese](#4-numărul-total-de-piese)
5. [Poziții Inițiale](#5-poziții-inițiale)
6. [Mișcări în 4D pentru Fiecare Piesă](#6-mișcări-în-4d-pentru-fiecare-piesă)
7. [Reguli Speciale](#7-reguli-speciale)
8. [Sistem de Vizualizare](#8-sistem-de-vizualizare)
9. [Interfață Utilizator (UI)](#9-interfață-utilizator-ui)
10. [Structura Tehnică](#10-structura-tehnică)
11. [Pași de Implementare](#11-pași-de-implementare)

---

## 1. CONCEPTE DE BAZĂ

### 1.1 Spațiul de Joc

**Hipercub:** 8×8×8×8 = **4,096 poziții posibile**

**Dimensiuni:**
- **X-axis:** Stânga-Dreapta (0-7) - orizontală pe tablă
- **Y-axis:** Altitudine/Straturi (0-7) - pentru navigare verticală între table
- **Z-axis:** Sus-Jos (0-7) - verticală pe tablă  
- **W-axis:** Dimensiunea a 4-a (0-7) - "universuri paralele"

### 1.2 Filosofia Design-ului

**Împărțire teritorială naturală:**
- Fiecare jucător începe cu un "teritoriu" masiv în spațiul 4D
- Frontiera este clară și vizuală
- Permite strategii complexe de "expansiune teritorială"

**Vizualizare 3D a 4D:**
- Proiecție: Vedem mai multe table 2D aranjate în spațiu 3D
- Navigare: Slider-e pentru a controla ce "slice" din 4D vedem

---

## 2. SISTEMUL DE COORDONATE 4D

### 2.1 Notație Matematică

**Pozițiile sunt reprezentate ca vectori 4D:**

```
P = (x, y, z, w) unde x, y, z, w ∈ [0, 7] ⊂ ℤ
```

**Exemplu:**
```javascript
position = {x: 3, y: 0, z: 4, w: 5}  // Poziția e4 pe tabla w=5, strat y=0
```

### 2.2 Notație Șah Extinsă

**Format:** `[file][rank]@y[strat]w[univers]`

```
Exemple:
- "e4@y0w5"  → x=4, y=0, z=3, w=5
- "a1@y0w0"  → x=0, y=0, z=0, w=0
- "h8@y7w7"  → x=7, y=7, z=7, w=7
```

### 2.3 Distanță în 4D

**Distanță Manhattan (L1):**
```
d₁(P₁, P₂) = |x₁-x₂| + |y₁-y₂| + |z₁-z₂| + |w₁-w₂|
```

**Distanță Euclidiană (L2):**
```
d₂(P₁, P₂) = √[(x₁-x₂)² + (y₁-y₂)² + (z₁-z₂)² + (w₁-w₂)²]
```

**Distanță Chebyshev (L∞) - pentru rege:**
```
d∞(P₁, P₂) = max(|x₁-x₂|, |y₁-y₂|, |z₁-z₂|, |w₁-w₂|)
```

---

## 3. ÎMPĂRȚIREA TERITORIALĂ

### 3.1 Design Concept

**ÎMPĂRȚIRE PE AXA W (Dimensiunea a 4-a):**

```
╔══════════════════════════════════════╗
║  TERITORIUL NEGRU    ║  TERITORIUL ALB  ║
║     W = 0,1,2,3      ║    W = 4,5,6,7   ║
║   (Stânga vizuală)   ║ (Dreapta vizuală)║
╚══════════════════════════════════════╝
```

### 3.2 Structura Detaliată

#### TERITORIUL NEGRU (Team 1) - W ∈ [0, 3]

Fiecare valoare W = {0, 1, 2, 3} conține **8 table verticale** (Y = 0-7)

```
W=0: [8 table, fiecare 8×8]
     Y=0: Tabla de bază cu toate piesele NEGRE
     Y=1: Tabla goală (pentru mișcări viitoare)
     Y=2-7: Table goale

W=1: [8 table, fiecare 8×8]
     Y=0: Tabla de bază cu toate piesele NEGRE
     Y=1-7: Table goale

W=2: [8 table, fiecare 8×8]
     Y=0: Tabla de bază cu toate piesele NEGRE
     Y=1-7: Table goale

W=3: [8 table, fiecare 8×8]
     Y=0: Tabla de bază cu toate piesele NEGRE
     Y=1-7: Table goale

TOTAL: 4 × 32 piese = 128 piese NEGRE
```

#### TERITORIUL ALB (Team 0) - W ∈ [4, 7]

Același pattern, simetric:

```
W=4: Y=0 → Toate piesele ALBE
W=5: Y=0 → Toate piesele ALBE
W=6: Y=0 → Toate piesele ALBE
W=7: Y=0 → Toate piesele ALBE

TOTAL: 4 × 32 piese = 128 piese ALBE
```

### 3.3 Total Piese în Joc

**GRAND TOTAL: 256 PIESE**
- 128 Albe
- 128 Negre

**Detalii per tip:**

| Piesă   | Per Tablă | × 4 Table | × 2 Jucători | TOTAL |
|---------|-----------|-----------|--------------|-------|
| Pawn    | 8         | 32        | 64           | 64    |
| Rook    | 2         | 8         | 16           | 16    |
| Knight  | 2         | 8         | 16           | 16    |
| Bishop  | 2         | 8         | 16           | 16    |
| Queen   | 1         | 4         | 8            | 8     |
| King    | 1         | 4         | 8            | 8     |
| **TOTAL** | **16** | **64** | **128** | **256** |

---

## 4. NUMĂRUL TOTAL DE PIESE

### 4.1 Breakdown per Jucător

**ALBUL (Team 0):**
```
32 Pawns (8 per tablă × 4 table)
8 Rooks (2 per tablă × 4 table)
8 Knights (2 per tablă × 4 table)
8 Bishops (2 per tablă × 4 table)
4 Queens (1 per tablă × 4 table)
4 Kings (1 per tablă × 4 table)
────────────────────────────────
128 PIESE TOTAL
```

**NEGRUL (Team 1):**
```
Același număr: 128 piese
```

### 4.2 Considerații de Game Balance

**⚠️ IMPORTANT:**
- **8 Regi** per jucător = condiție de victorie complexă
- **Opțiuni:**
  1. **Checkmate orice rege** → Victorie
  2. **Checkmate TOȚI regii** → Victorie (mai dificil)
  3. **Checkmate "Regele Principal"** (doar 1 desemnat) → Victorie

**💡 RECOMANDARE:** Opțiunea 1 (orice rege în șah-mat = pierdere) pentru jucabilitate.

---

## 5. POZIȚII INIȚIALE

### 5.1 Layout Standard per Tablă

**Fiecare tablă de 8×8 are aceeași configurație clasică:**

```
   a  b  c  d  e  f  g  h   (X = 0-7)
8  R  N  B  Q  K  B  N  R   ← Z=7 (back rank)
7  P  P  P  P  P  P  P  P   ← Z=6 (pawns)
6  .  .  .  .  .  .  .  .   ← Z=5 (empty)
5  .  .  .  .  .  .  .  .   ← Z=4 (empty)
4  .  .  .  .  .  .  .  .   ← Z=3 (empty)
3  .  .  .  .  .  .  .  .   ← Z=2 (empty)
2  p  p  p  p  p  p  p  p   ← Z=1 (pawns adversar)
1  r  n  b  q  k  b  n  r   ← Z=0 (back rank adversar)

Legendă:
R/r = Rook, N/n = Knight, B/b = Bishop
Q/q = Queen, K/k = King, P/p = Pawn
MAJUSCULE = Piese negre (sus)
minuscule = Piese albe (jos)
```

### 5.2 Poziții Exacte pentru NEGRUL (Team 1)

**Pentru fiecare W ∈ {0, 1, 2, 3}, la Y=0:**

```javascript
// Back rank (Z=7)
pieces[0][0][7][w] = Rook(team=1)    // a8
pieces[1][0][7][w] = Knight(team=1)  // b8
pieces[2][0][7][w] = Bishop(team=1)  // c8
pieces[3][0][7][w] = Queen(team=1)   // d8
pieces[4][0][7][w] = King(team=1)    // e8
pieces[5][0][7][w] = Bishop(team=1)  // f8
pieces[6][0][7][w] = Knight(team=1)  // g8
pieces[7][0][7][w] = Rook(team=1)    // h8

// Pawns (Z=6)
for (x = 0; x < 8; x++) {
    pieces[x][0][6][w] = Pawn(team=1)
}
```

### 5.3 Poziții Exacte pentru ALBUL (Team 0)

**Pentru fiecare W ∈ {4, 5, 6, 7}, la Y=0:**

```javascript
// Pawns (Z=1)
for (x = 0; x < 8; x++) {
    pieces[x][0][1][w] = Pawn(team=0)
}

// Back rank (Z=0)
pieces[0][0][0][w] = Rook(team=0)    // a1
pieces[1][0][0][w] = Knight(team=0)  // b1
pieces[2][0][0][w] = Bishop(team=0)  // c1
pieces[3][0][0][w] = Queen(team=0)   // d1
pieces[4][0][0][w] = King(team=0)    // e1
pieces[5][0][0][w] = Bishop(team=0)  // f1
pieces[6][0][0][w] = Knight(team=0)  // g1
pieces[7][0][0][w] = Rook(team=0)    // h1
```

### 5.4 Funcție de Inițializare

```javascript
function initializeStartingPosition(pieces) {
    // Clear all positions
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            for (let z = 0; z < 8; z++) {
                for (let w = 0; w < 8; w++) {
                    pieces[x][y][z][w] = new Piece(); // Empty
                }
            }
        }
    }
    
    // Place BLACK pieces (W = 0,1,2,3)
    for (let w = 0; w <= 3; w++) {
        placeTeamPieces(pieces, team=1, w, y=0);
    }
    
    // Place WHITE pieces (W = 4,5,6,7)
    for (let w = 4; w <= 7; w++) {
        placeTeamPieces(pieces, team=0, w, y=0);
    }
}

function placeTeamPieces(pieces, team, w, y) {
    const backRank = (team === 0) ? 0 : 7;
    const pawnRank = (team === 0) ? 1 : 6;
    
    // Back rank
    pieces[0][y][backRank][w] = new Rook(team);
    pieces[1][y][backRank][w] = new Knight(team);
    pieces[2][y][backRank][w] = new Bishop(team);
    pieces[3][y][backRank][w] = new Queen(team);
    pieces[4][y][backRank][w] = new King(team);
    pieces[5][y][backRank][w] = new Bishop(team);
    pieces[6][y][backRank][w] = new Knight(team);
    pieces[7][y][backRank][w] = new Rook(team);
    
    // Pawns
    for (let x = 0; x < 8; x++) {
        pieces[x][y][pawnRank][w] = new Pawn(team);
    }
}
```

---

## 6. MIȘCĂRI ÎN 4D PENTRU FIECARE PIESĂ

### 6.1 Vectori de Mișcare în 4D

**Notație:** `Δ = (Δx, Δy, Δz, Δw)`

### 6.2 PAWN (Pionul) 🔵

**Direcția "înainte" în 4D:**
- **Team 0 (Alb):** Către Z+ (și opțional W-, Y+)
- **Team 1 (Negru):** Către Z- (și opțional W+, Y+)

**Mișcări normale:**
```javascript
// Team 0 (White)
forward = [
    (0, 0, +1, 0),   // Forward pe Z
    (0, +1, 0, 0),   // Forward pe Y (vertical)
]

// Mișcare inițială dublă
if (!hasMoved) {
    forward.push((0, 0, +2, 0))  // Double push pe Z
    forward.push((0, +2, 0, 0))  // Double push pe Y
}
```

**Capturi diagonale:**
```javascript
// Team 0 captures
captures = [
    (±1, 0, +1, 0),  // Diagonal în planul XZ
    (±1, +1, 0, 0),  // Diagonal în planul XY
    (0, +1, +1, 0),  // Diagonal în planul YZ
]
```

**Promovare:**
- Când ajunge la orice poziție cu `z=7 AND y=7` (pentru Team 0)
- Când ajunge la orice poziție cu `z=0 AND y=0` (pentru Team 1)

### 6.3 ROOK (Tura) 🔶

**Mișcare liniară pe cele 4 axe:**

```javascript
directions = [
    // Axa X (orizontal)
    (+1, 0, 0, 0), (-1, 0, 0, 0),
    
    // Axa Y (vertical)
    (0, +1, 0, 0), (0, -1, 0, 0),
    
    // Axa Z (profunzime)
    (0, 0, +1, 0), (0, 0, -1, 0),
    
    // Axa W (4D)
    (0, 0, 0, +1), (0, 0, 0, -1)
]

// Total: 8 direcții
// Poate merge până la 7 pătrate în fiecare direcție
```

**Formula generală:**
```
P' = P + n·d̂  unde n ∈ [1, 7], d̂ ∈ {±x̂, ±ŷ, ±ẑ, ±ŵ}
```

### 6.4 BISHOP (Nebunul) 🔷

**Mișcare diagonală în toate planurile 2D:**

```javascript
// Planul XY (4 direcții)
(±1, ±1, 0, 0)

// Planul XZ (4 direcții)
(±1, 0, ±1, 0)

// Planul XW (4 direcții)
(±1, 0, 0, ±1)

// Planul YZ (4 direcții)
(0, ±1, ±1, 0)

// Planul YW (4 direcții)
(0, ±1, 0, ±1)

// Planul ZW (4 direcții)
(0, 0, ±1, ±1)

// Total: 24 direcții diagonale
```

**Exemplu combinații:**
```javascript
directions = [
    // XY plane
    (+1, +1, 0, 0), (+1, -1, 0, 0), (-1, +1, 0, 0), (-1, -1, 0, 0),
    
    // XZ plane
    (+1, 0, +1, 0), (+1, 0, -1, 0), (-1, 0, +1, 0), (-1, 0, -1, 0),
    
    // XW plane
    (+1, 0, 0, +1), (+1, 0, 0, -1), (-1, 0, 0, +1), (-1, 0, 0, -1),
    
    // YZ plane
    (0, +1, +1, 0), (0, +1, -1, 0), (0, -1, +1, 0), (0, -1, -1, 0),
    
    // YW plane
    (0, +1, 0, +1), (0, +1, 0, -1), (0, -1, 0, +1), (0, -1, 0, -1),
    
    // ZW plane
    (0, 0, +1, +1), (0, 0, +1, -1), (0, 0, -1, +1), (0, 0, -1, -1)
]
```

### 6.5 KNIGHT (Calul) ⚡

**Mișcare "L" în 4D:** 2 pătrate pe o axă, 1 pătrat pe altă axă

```javascript
// Formula: 2 pași pe axa i, 1 pas pe axa j (i ≠ j)

// Combinații cu X
(±2, ±1, 0, 0),  (±2, 0, ±1, 0),  (±2, 0, 0, ±1),
(±1, ±2, 0, 0),  (±1, 0, ±2, 0),  (±1, 0, 0, ±2),

// Combinații cu Y
(0, ±2, ±1, 0),  (0, ±2, 0, ±1),
(0, ±1, ±2, 0),  (0, ±1, 0, ±2),

// Combinații cu Z
(0, 0, ±2, ±1),
(0, 0, ±1, ±2),

// Total: 48 mișcări posibile
```

**Lista completă:**
```javascript
knightMoves = [
    // X-Y combinations
    (+2, +1, 0, 0), (+2, -1, 0, 0), (-2, +1, 0, 0), (-2, -1, 0, 0),
    (+1, +2, 0, 0), (+1, -2, 0, 0), (-1, +2, 0, 0), (-1, -2, 0, 0),
    
    // X-Z combinations
    (+2, 0, +1, 0), (+2, 0, -1, 0), (-2, 0, +1, 0), (-2, 0, -1, 0),
    (+1, 0, +2, 0), (+1, 0, -2, 0), (-1, 0, +2, 0), (-1, 0, -2, 0),
    
    // X-W combinations
    (+2, 0, 0, +1), (+2, 0, 0, -1), (-2, 0, 0, +1), (-2, 0, 0, -1),
    (+1, 0, 0, +2), (+1, 0, 0, -2), (-1, 0, 0, +2), (-1, 0, 0, -2),
    
    // Y-Z combinations
    (0, +2, +1, 0), (0, +2, -1, 0), (0, -2, +1, 0), (0, -2, -1, 0),
    (0, +1, +2, 0), (0, +1, -2, 0), (0, -1, +2, 0), (0, -1, -2, 0),
    
    // Y-W combinations
    (0, +2, 0, +1), (0, +2, 0, -1), (0, -2, 0, +1), (0, -2, 0, -1),
    (0, +1, 0, +2), (0, +1, 0, -2), (0, -1, 0, +2), (0, -1, 0, -2),
    
    // Z-W combinations
    (0, 0, +2, +1), (0, 0, +2, -1), (0, 0, -2, +1), (0, 0, -2, -1),
    (0, 0, +1, +2), (0, 0, +1, -2), (0, 0, -1, +2), (0, 0, -1, -2)
]
// Total: 48 mișcări
```

### 6.6 QUEEN (Regina) 👑

**Combinație Rook + Bishop:**

```javascript
queenMoves = rookDirections + bishopDirections
// Total: 8 + 24 = 32 direcții
```

**Poate merge oricât de departe în oricare din cele 32 de direcții.**

### 6.7 KING (Regele) 🔱

**Exact ca Queen, dar limitat la 1 pătrat:**

```javascript
// 1 pas în oricare din cele 32 de direcții
kingMoves = queenMoves (limitat la distanță = 1)

// Toate combinațiile de (±1, ±1, ±1, ±1) unde nu sunt toate 0
```

**Lista completă (80 mișcări):**
```javascript
// Mișcări pe o singură axă (8)
(±1, 0, 0, 0), (0, ±1, 0, 0), (0, 0, ±1, 0), (0, 0, 0, ±1)

// Mișcări în plane 2D (24)
(±1, ±1, 0, 0), (±1, 0, ±1, 0), (±1, 0, 0, ±1),
(0, ±1, ±1, 0), (0, ±1, 0, ±1), (0, 0, ±1, ±1)

// Mișcări în spații 3D (32)
(±1, ±1, ±1, 0), (±1, ±1, 0, ±1), (±1, 0, ±1, ±1), (0, ±1, ±1, ±1)

// Mișcări în spațiul 4D complet (16)
(±1, ±1, ±1, ±1)

// Total: 80 mișcări posibile
```

---

## 7. REGULI SPECIALE

### 7.1 Șah și Șah-Mat

**Definiție Șah:**
```
Un rege este în ȘAH dacă există o piesă adversă care poate 
captura regele în următoarea mișcare.
```

**Condiție de Victorie (Variantă Recomandată):**
```
Jocul se termină când ORICE rege este pus în șah-mat.
Jucătorul care pierde un rege pierde jocul.
```

**Variante Alternative:**
1. **Ultra-hard mode:** Toate cele 4 regi trebuie capturate
2. **Hybrid mode:** Regele central (w=1 sau w=6) este "Principal King"

### 7.2 Castling în 4D

**Castling este POSIBIL pe fiecare tablă individuală:**

```javascript
// Condiții:
1. Nici regele, nici tura nu s-au mișcat
2. Nu există piese între rege și tură
3. Regele nu este în șah
4. Regele nu trece prin șah
5. Regele nu ajunge în șah

// Mișcare: Același ca în șahul clasic, dar în planul XZ pe fiecare tablă
```

### 7.3 En Passant în 4D

**Aplicabil când un pion adversar face mișcare dublă:**

```javascript
// Similar cu 2D chess, dar extins pentru axele Y și Z
if (enemyPawn.justMoved && enemyPawn.movedDistance === 2) {
    if (adjacentOnXAxis(myPawn, enemyPawn)) {
        canEnPassant = true;
    }
}
```

### 7.4 Promovare Pawn

**Condiție:**
```javascript
// Pentru Team 0 (White)
if (pawn.z === 7 && pawn.y === 7) {
    promote(pawn, targetPiece);  // Default: Queen
}

// Pentru Team 1 (Black)
if (pawn.z === 0 && pawn.y === 0) {
    promote(pawn, targetPiece);
}
```

**Opțiuni de promovare:** Queen, Rook, Bishop, Knight

---

## 8. SISTEM DE VIZUALIZARE

### 8.1 Proiecția 4D → 3D

**Metoda: Slicing (Secționare)**

Afișăm un "slice" 3D din spațiul 4D:

```javascript
// Fixăm o coordonată pentru a vedea un subspațiu 3D
currentView = {
    fixedAxis: 'w',      // Fixăm W
    fixedValue: 2,       // Vedem doar W=2
    visibleAxes: ['x', 'y', 'z']  // Vedem X, Y, Z
}
```

### 8.2 Layout Vizual

**Aranjare în spațiul 3D (Three.js):**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Teritoriul NEGRU        Teritoriul ALB            │
│  ┌──────┐               ┌──────┐                   │
│  │ W=0  │  ┌──────┐     │ W=4  │  ┌──────┐         │
│  │ Y=7  │  │ W=1  │     │ Y=7  │  │ W=5  │         │
│  ├──────┤  │ Y=7  │     ├──────┤  │ Y=7  │         │
│  │ Y=6  │  ├──────┤     │ Y=6  │  ├──────┤         │
│  ├──────┤  │ Y=6  │     ├──────┤  │ Y=6  │         │
│  │ Y=5  │  │ ...  │     │ Y=5  │  │ ...  │         │
│  │ ...  │  │      │     │ ...  │  │      │         │
│  │ Y=0  │  │ Y=0  │     │ Y=0  │  │ Y=0  │         │
│  └──────┘  └──────┘     └──────┘  └──────┘         │
│                                                     │
│  [◄ W-1]  [W: 2/7]  [W+1 ►]                        │
│  [▼ Y-1]  [Y: 0/7]  [Y+1 ▲]                        │
└─────────────────────────────────────────────────────┘
```

### 8.3 Coordonate de Randare (Three.js)

```javascript
function worldPosition(x, y, z, w) {
    const squareSize = 50;
    const boardGap = 80;
    const verticalSpacing = 175;
    
    return new THREE.Vector3(
        x * squareSize,                           // X: orizontal
        y * verticalSpacing,                      // Y: vertical stack
        -(z * squareSize + w * (8*squareSize + boardGap))  // Z: depth + W offset
    );
}
```

### 8.4 Sisteme de Navigare

**1. Mouse Camera Control:**
```javascript
- Orbit control (rotație)
- Zoom (scroll)
- Pan (right-click drag)
```

**2. Keyboard Shortcuts:**
```javascript
- Arrow keys: Rotație cameră
- W/S: Schimbă stratul W
- Q/E: Schimbă stratul Y
- R: Reset camera
- Space: Deselect piece
```

**3. UI Sliders:**
```javascript
- W-axis slider: 0-7
- Y-axis slider: 0-7
- Opacity slider: Transparență table nevizibile
```

---

## 9. INTERFAȚĂ UTILIZATOR (UI)

### 9.1 Layout General (Dark Mode)

```
┌──────────────────────────────────────────────────────────┐
│  ☰ Menu    🎮 4D CHESS    Turn: White ♔    [Settings]  │ ← Header
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [STÂNGA: Control Panel]    [CENTRU: Game View]         │
│                                                          │
│  🎯 Game Status             ╔════════════════════╗       │
│  ├─ Turn: 1                 ║                    ║       │
│  ├─ White to move           ║   [3D Scene]       ║       │
│  └─ No check                ║                    ║       │
│                             ║                    ║       │
│  📍 Selected Piece          ║                    ║       │
│  ├─ Type: Knight            ╚════════════════════╝       │
│  ├─ Position: e4@y0w2                                    │
│  └─ Possible moves: 12      [Dreapta: Navigation]        │
│                                                          │
│  🎲 Actions                 🧭 4D Navigation             │
│  ├─ [🔄 NEW GAME]           ├─ W-axis: [====•===] 2/7   │
│  ├─ [↶ UNDO]               ├─ Y-axis: [•========] 0/7   │
│  ├─ [↷ REDO]               └─ Opacity: [======•=] 60%   │
│  ├─ [💾 SAVE]                                            │
│  └─ [📂 LOAD]               [◄ W-1] [2/7] [W+1 ►]       │
│                             [▼ Y-1] [0/7] [Y+1 ▲]        │
│  📊 Stats                                                │
│  ├─ Pieces: W:128 B:128                                 │
│  └─ Time: 05:23             🎨 View Options              │
│                             ├─ [✓] Show Grid             │
│  📜 Move History            ├─ [✓] Highlight Moves       │
│  1. e4@w2 → e5@w2          ├─ [ ] Show Coords           │
│  2. Nf3@w2 → Nf6@w2        └─ [✓] Animate Pieces        │
│  ...                                                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 9.2 Color Scheme (Dark Mode)

```css
:root {
    /* Backgrounds */
    --bg-primary: #0a0e27;        /* Very dark blue */
    --bg-secondary: #141933;      /* Dark navy */
    --bg-tertiary: #1e2746;       /* Medium navy */
    
    /* Accents */
    --accent-primary: #00d4ff;    /* Cyan */
    --accent-secondary: #7b2ff7;  /* Purple */
    --accent-success: #00ff88;    /* Green */
    --accent-danger: #ff3366;     /* Red */
    --accent-warning: #ffaa00;    /* Orange */
    
    /* Text */
    --text-primary: #ffffff;      /* White */
    --text-secondary: #b4b4d4;    /* Light purple-gray */
    --text-tertiary: #7878a3;     /* Medium gray */
    
    /* Chess pieces */
    --piece-white: #fcf6e3;       /* Cream */
    --piece-black: #818181;       /* Gray */
    
    /* Board */
    --board-light: #ccccfc;       /* Light purple */
    --board-dark: #444464;        /* Dark purple */
    
    /* Highlights */
    --highlight-move: #90ee90;    /* Light green */
    --highlight-capture: #ff0000; /* Red */
    --highlight-selected: #00b9ff;/* Blue */
}
```

### 9.3 Componente UI Detaliate

#### A. Header Bar

```html
<header class="header-bar">
    <button class="menu-btn">☰</button>
    <h1 class="title">🎮 4D CHESS</h1>
    <div class="turn-indicator">
        <span class="turn-icon">♔</span>
        <span class="turn-text">White to move</span>
    </div>
    <div class="check-indicator" style="display:none;">
        <span class="check-text">⚠️ CHECK!</span>
    </div>
    <button class="settings-btn">⚙️</button>
</header>
```

#### B. Control Panel (Stânga)

```html
<aside class="control-panel">
    <!-- Game Status -->
    <section class="status-card">
        <h3>🎯 Game Status</h3>
        <ul>
            <li>Turn: <span id="turn-number">1</span></li>
            <li>Player: <span id="current-player">White</span></li>
            <li>Status: <span id="check-status">No check</span></li>
        </ul>
    </section>
    
    <!-- Selected Piece Info -->
    <section class="piece-card" id="selected-piece-info" style="display:none;">
        <h3>📍 Selected Piece</h3>
        <ul>
            <li>Type: <span id="piece-type"></span></li>
            <li>Position: <span id="piece-pos"></span></li>
            <li>Possible moves: <span id="move-count"></span></li>
        </ul>
    </section>
    
    <!-- Action Buttons -->
    <section class="actions-card">
        <h3>🎲 Actions</h3>
        <button class="btn btn-primary" id="new-game-btn">
            🔄 NEW GAME
        </button>
        <button class="btn btn-secondary" id="undo-btn">
            ↶ UNDO
        </button>
        <button class="btn btn-secondary" id="redo-btn">
            ↷ REDO
        </button>
        <button class="btn btn-secondary" id="save-btn">
            💾 SAVE
        </button>
        <button class="btn btn-secondary" id="load-btn">
            📂 LOAD
        </button>
    </section>
    
    <!-- Statistics -->
    <section class="stats-card">
        <h3>📊 Statistics</h3>
        <div class="stat-row">
            <span>White pieces:</span>
            <span id="white-count">128</span>
        </div>
        <div class="stat-row">
            <span>Black pieces:</span>
            <span id="black-count">128</span>
        </div>
        <div class="stat-row">
            <span>Time elapsed:</span>
            <span id="game-time">00:00</span>
        </div>
    </section>
    
    <!-- Move History -->
    <section class="history-card">
        <h3>📜 Move History</h3>
        <div class="move-list" id="move-history">
            <!-- Populated dynamically -->
        </div>
    </section>
</aside>
```

#### C. Navigation Panel (Dreapta)

```html
<aside class="nav-panel">
    <section class="nav-card">
        <h3>🧭 4D Navigation</h3>
        
        <!-- W-axis slider -->
        <div class="axis-control">
            <label>W-axis (4D)</label>
            <input type="range" id="w-slider" min="0" max="7" value="2">
            <div class="axis-buttons">
                <button class="btn-nav" id="w-minus">◄ W-1</button>
                <span class="axis-value" id="w-value">2/7</span>
                <button class="btn-nav" id="w-plus">W+1 ►</button>
            </div>
        </div>
        
        <!-- Y-axis slider -->
        <div class="axis-control">
            <label>Y-axis (Height)</label>
            <input type="range" id="y-slider" min="0" max="7" value="0">
            <div class="axis-buttons">
                <button class="btn-nav" id="y-minus">▼ Y-1</button>
                <span class="axis-value" id="y-value">0/7</span>
                <button class="btn-nav" id="y-plus">Y+1 ▲</button>
            </div>
        </div>
        
        <!-- Opacity control -->
        <div class="axis-control">
            <label>Board Opacity</label>
            <input type="range" id="opacity-slider" min="0" max="100" value="40">
            <span class="axis-value" id="opacity-value">40%</span>
        </div>
    </section>
    
    <section class="view-card">
        <h3>🎨 View Options</h3>
        <label class="checkbox-label">
            <input type="checkbox" id="show-grid" checked>
            <span>Show Grid</span>
        </label>
        <label class="checkbox-label">
            <input type="checkbox" id="highlight-moves" checked>
            <span>Highlight Possible Moves</span>
        </label>
        <label class="checkbox-label">
            <input type="checkbox" id="show-coords">
            <span>Show Coordinates</span>
        </label>
        <label class="checkbox-label">
            <input type="checkbox" id="animate-pieces" checked>
            <span>Animate Pieces</span>
        </label>
        <label class="checkbox-label">
            <input type="checkbox" id="show-all-boards">
            <span>Show All Boards</span>
        </label>
    </section>
    
    <section class="camera-card">
        <h3>📷 Camera</h3>
        <button class="btn btn-secondary" id="reset-camera">
            🎯 Reset View
        </button>
        <button class="btn btn-secondary" id="top-view">
            ⬆️ Top View
        </button>
        <button class="btn btn-secondary" id="side-view">
            ➡️ Side View
        </button>
    </section>
</aside>
```

### 9.4 Keyboard Shortcuts

```javascript
const KEYBOARD_SHORTCUTS = {
    // Navigation
    'w': () => changeWAxis(+1),
    's': () => changeWAxis(-1),
    'q': () => changeYAxis(+1),
    'e': () => changeYAxis(-1),
    
    // Camera
    'r': () => resetCamera(),
    'ArrowUp': () => rotateCamera('up'),
    'ArrowDown': () => rotateCamera('down'),
    'ArrowLeft': () => rotateCamera('left'),
    'ArrowRight': () => rotateCamera('right'),
    
    // Game actions
    'Escape': () => deselectPiece(),
    'z': (e) => { if (e.ctrlKey) undo(); },
    'y': (e) => { if (e.ctrlKey) redo(); },
    
    // View
    'g': () => toggleGrid(),
    'h': () => toggleHighlights(),
    'c': () => toggleCoordinates(),
    
    // Debug
    'F1': () => showDebugInfo(),
    'F2': () => toggleWireframe()
};
```

---

## 10. STRUCTURA TEHNICĂ

### 10.1 Arhitectura Fișierelor

```
4d_chess/
│
├── index.html                    # Entry point
│
├── css/
│   ├── main.css                  # Stiluri principale
│   ├── dark-theme.css            # Dark mode
│   ├── components.css            # Componente UI
│   └── animations.css            # Animații
│
├── js/
│   ├── main.js                   # Bootstrap & init
│   ├── Game.js                   # Game controller
│   ├── GameBoard.js              # ✅ Există (modificat pentru n=8)
│   ├── MoveManager.js            # ✅ Există
│   ├── pieces/
│   │   ├── Piece.js              # Clasa de bază
│   │   ├── Pawn.js               # Logica Pawn 4D
│   │   ├── Rook.js               # Logica Rook 4D
│   │   ├── Bishop.js             # Logica Bishop 4D
│   │   ├── Knight.js             # Logica Knight 4D
│   │   ├── Queen.js              # Logica Queen 4D
│   │   └── King.js               # Logica King 4D
│   ├── graphics/
│   │   ├── Models.js             # ✅ Există (modificat pentru GLB)
│   │   ├── BoardRenderer.js      # Rendering table
│   │   ├── PieceRenderer.js      # Rendering piese
│   │   └── HighlightSystem.js    # Highlight mișcări
│   ├── ui/
│   │   ├── UIManager.js          # Controller UI
│   │   ├── ControlPanel.js       # Panel stânga
│   │   ├── NavigationPanel.js    # Panel dreapta
│   │   └── Modal.js              # Dialogs (save/load/settings)
│   ├── input/
│   │   ├── MouseHandler.js       # Mouse events
│   │   ├── KeyboardHandler.js    # Keyboard events
│   │   └── Raycaster.js          # Three.js raycasting
│   ├── camera/
│   │   ├── CameraController.js   # Orbit controls
│   │   └── ViewPresets.js        # Preset views
│   └── utils/
│       ├── Coordinates.js        # Conversii coord 4D ↔ 3D
│       ├── MoveValidation.js     # Validare mișcări
│       ├── CheckDetection.js     # Detectare șah
│       └── Serialization.js      # Save/Load joc
│
├── models/                       # Piese 3D (GLB format)
│   ├── Pawn.glb                  # 🆕 Vei furniza
│   ├── Rook.glb                  # 🆕 Vei furniza
│   ├── Bishop.glb                # 🆕 Vei furniza
│   ├── Knight.glb                # 🆕 Vei furniza
│   ├── Queen.glb                 # 🆕 Vei furniza
│   └── King.glb                  # 🆕 Vei furniza
│
├── assets/
│   ├── textures/
│   │   ├── wood.jpg              # Texturi table (opțional)
│   │   └── marble.jpg
│   ├── sounds/                   # Audio (opțional)
│   │   ├── move.mp3
│   │   ├── capture.mp3
│   │   └── check.mp3
│   └── fonts/
│       └── RobotoMono.woff2      # Font monospace
│
├── tests/                        # Unit tests (opțional)
│   ├── test-moves.js
│   └── test-validation.js
│
└── README.md                     # Documentație
```

### 10.2 Stack Tehnologic

```yaml
Core:
  - JavaScript (ES6+)
  - Three.js (r150+) pentru 3D rendering

Libraries:
  - GLTFLoader: Pentru încărcare modele .glb
  - OrbitControls: Pentru control cameră
  - dat.GUI (opțional): Pentru debug controls

Build Tools (opțional pentru production):
  - Vite sau Webpack pentru bundling
  - ESLint pentru code quality
  - Prettier pentru formatting

Hosting:
  - GitHub Pages (static site)
  - Netlify / Vercel (alternative)
```

### 10.3 Modificări la Codul Existent

#### A. GameBoard.js - Schimbă n=4 → n=8

```javascript
// Linia 583 (aproximativ)
function GameBoard(n=8, Graphics=BoardGraphics){  // Era n=4
    this.n = n;
    // ... rest of code
}
```

#### B. Models.js - Suport pentru GLB

```javascript
// Înlocuiește JSONLoader cu GLTFLoader

const Models = {
    SCALE_FACTOR: 9,
    directory: 'models/',
    
    pieceData: [
        {
            name: 'pawn',
            fileName: 'Pawn.glb',  // Era .model.json
            rotation: new THREE.Vector3(0, 0, 0)
        },
        // ... rest of pieces
    ],
    
    geometries: {},
    loadedModels: {},
    
    loadModels: function() {
        return new Promise(function(resolve, reject) {
            const manager = new THREE.LoadingManager();
            manager.onLoad = resolve;
            
            const loader = new THREE.GLTFLoader(manager);  // 🆕
            
            Models.pieceData.forEach(piece => {
                const path = Models.directory + piece.fileName;
                loader.load(path, function(gltf) {
                    Models.loadedModels[piece.name] = gltf.scene;
                    
                    // Extract geometry from first mesh
                    gltf.scene.traverse((child) => {
                        if (child.isMesh) {
                            Models.geometries[piece.name] = child.geometry;
                        }
                    });
                });
            });
        });
    },
    
    createMesh: function(piece, material, x=0, y=0, z=0, scale=1, canRayCast=true) {
        // Clone model instead of creating from geometry
        const model = Models.loadedModels[piece];
        if (!model) {
            console.error(`Model not loaded: ${piece}`);
            return null;
        }
        
        const mesh = model.clone();
        
        // Apply material to all children
        mesh.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshPhongMaterial(material);
            }
        });
        
        const pieceData = Models.pieceData[Models.pieceIndices[piece]];
        mesh.rotation.set(pieceData.rotation.x, pieceData.rotation.y, pieceData.rotation.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.scale.set(
            Models.SCALE_FACTOR * scale,
            Models.SCALE_FACTOR * scale,
            Models.SCALE_FACTOR * scale
        );
        mesh.position.set(x, y, z);
        mesh.canRayCast = canRayCast;
        
        return mesh;
    }
};
```

### 10.4 Clasa Piece - Structura de Bază

```javascript
class Piece {
    constructor(type, team) {
        this.type = type;      // 'pawn', 'rook', etc.
        this.team = team;      // 0 (white) or 1 (black)
        this.mesh = null;      // Three.js mesh
        this.hasMoved = false;
        this.position = {x: 0, y: 0, z: 0, w: 0};
    }
    
    getPossibleMoves(board, x, y, z, w) {
        // Override in subclasses
        return [];
    }
    
    isValidMove(board, x0, y0, z0, w0, x1, y1, z1, w1) {
        const moves = this.getPossibleMoves(board, x0, y0, z0, w0);
        return moves.some(m => 
            m.x === x1 && m.y === y1 && m.z === z1 && m.w === w1
        );
    }
    
    setMesh(mesh) {
        this.mesh = mesh;
    }
    
    update(board, x0, y0, z0, w0, x1, y1, z1, w1) {
        this.hasMoved = true;
        this.position = {x: x1, y: y1, z: z1, w: w1};
        return {justMoved: true};
    }
    
    package() {
        return {
            type: this.type,
            team: this.team,
            hasMoved: this.hasMoved,
            position: this.position
        };
    }
}

// Export pentru alte module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Piece;
}
```

---

## 11. PAȘI DE IMPLEMENTARE

### FAZA 1: Setup Inițial (1-2 ore)

```markdown
✅ 1.1 Creează structura de foldere
✅ 1.2 Creează index.html cu layout de bază
✅ 1.3 Creează CSS pentru dark mode
✅ 1.4 Setup Three.js scene (cameră, lumini, renderer)
✅ 1.5 Test: Afișează un cub pentru a verifica Three.js
```

### FAZA 2: Sistemul de Table (2-3 ore)

```markdown
✅ 2.1 Modifică GameBoard.js pentru n=8
✅ 2.2 Implementează BoardRenderer pentru 64 de table
✅ 2.3 Adaugă coordonate world pentru fiecare (x,y,z,w)
✅ 2.4 Implementează sistemul de slicing (vizualizare W)
✅ 2.5 Test: Afișează toate tablele goale, navighează cu slider W
```

### FAZA 3: Încărcare Modele 3D (1-2 ore)

```markdown
✅ 3.1 Primește modelele .glb de la tine
✅ 3.2 Modifică Models.js pentru GLTFLoader
✅ 3.3 Implementează loadModels() async
✅ 3.4 Testează încărcarea fiecărui model
✅ 3.5 Test: Afișează toate tipurile de piese pe o tablă
```

### FAZA 4: Poziții Inițiale (2-3 ore)

```markdown
✅ 4.1 Implementează initializeStartingPosition()
✅ 4.2 Plasează 128 piese albe (W=4,5,6,7)
✅ 4.3 Plasează 128 piese negre (W=0,1,2,3)
✅ 4.4 Verifică că toate piesele sunt vizibile
✅ 4.5 Test: Verifică poziții cu console.log
```

### FAZA 5: Logica Pieselor în 4D (4-6 ore)

```markdown
✅ 5.1 Implementează Pawn.js (mișcări + capturi 4D)
✅ 5.2 Implementează Rook.js (8 direcții)
✅ 5.3 Implementează Bishop.js (24 direcții)
✅ 5.4 Implementează Knight.js (48 mișcări)
✅ 5.5 Implementează Queen.js (32 direcții)
✅ 5.6 Implementează King.js (80 mișcări)
✅ 5.7 Test: Verifică fiecare tip de piesă individual
```

### FAZA 6: Interacțiune (3-4 ore)

```markdown
✅ 6.1 Implementează Raycasting pentru selecție piese
✅ 6.2 Implementează highlight pentru piesa selectată
✅ 6.3 Implementează showPossibleMoves (verde/roșu)
✅ 6.4 Implementează click pentru mișcare
✅ 6.5 Implementează animație mișcare piesă
✅ 6.6 Test: Joacă câteva mișcări manual
```

### FAZA 7: UI Complet (3-4 ore)

```markdown
✅ 7.1 Implementează Control Panel (stânga)
✅ 7.2 Implementează Navigation Panel (dreapta)
✅ 7.3 Conectează slider-ele W și Y la vizualizare
✅ 7.4 Implementează butonul NEW GAME
✅ 7.5 Implementează butoanele UNDO/REDO
✅ 7.6 Implementează display pentru move history
✅ 7.7 Test: Toate butoanele funcționează
```

### FAZA 8: Reguli de Joc (3-4 ore)

```markdown
✅ 8.1 Implementează detectare șah (inCheck)
✅ 8.2 Implementează detectare șah-mat (inCheckmate)
✅ 8.3 Implementează validare mișcare (nu te pui în șah)
✅ 8.4 Implementează alternanța turelor (alb/negru)
✅ 8.5 Implementează promovare pawn
✅ 8.6 Test: Joacă până la șah-mat
```

### FAZA 9: Features Avansate (2-3 ore)

```markdown
✅ 9.1 Implementează SAVE/LOAD joc (JSON)
✅ 9.2 Implementează castling pe fiecare tablă
✅ 9.3 Implementează en passant
✅ 9.4 Implementează keyboard shortcuts
✅ 9.5 Implementează preset views pentru cameră
✅ 9.6 Test: Toate feature-urile funcționează
```

### FAZA 10: Polish & Optimizare (2-3 ore)

```markdown
✅ 10.1 Optimizează performance (frustum culling)
✅ 10.2 Adaugă animații smooth
✅ 10.3 Adaugă sunet (opțional)
✅ 10.4 Fixează bug-uri găsite în testare
✅ 10.5 Documentează cod
✅ 10.6 Test: Playtest complet
```

### TOTAL ESTIMATED TIME: **25-35 ore**

---

## 12. CHECKLIST FINAL

### ✅ Componente Esențiale

```markdown
□ Tabla 8×8×8×8 funcțională
□ 256 piese plasate corect la start
□ Toate cele 6 tipuri de piese cu mișcări corecte
□ Selecție piese + highlight mișcări posibile
□ Mișcare piese cu animație
□ Detectare șah
□ Detectare șah-mat
□ Alternanță turelor
□ Buton NEW GAME funcțional
□ Buton UNDO/REDO funcțional
□ UI complet (paneluri stânga + dreapta)
□ Navigare 4D (slider W și Y)
□ Dark mode styling
```

### ✅ Features Opționale (Nice-to-Have)

```markdown
□ Castling
□ En passant
□ Promovare pawn
□ SAVE/LOAD joc
□ Move history vizuală
□ Keyboard shortcuts
□ Multiple camera presets
□ Sound effects
□ Tutorial/Help modal
□ AI opponent (viitor)
□ Multiplayer online (viitor)
```

---

## 13. ÎNTREBĂRI RĂMASE

### Pentru tine (Oana):

1. **Modele GLB:**
   - Ai modelele pregătite? 
   - Ce stil au (realistic, low-poly, stylized)?
   - Trebuie să le scal sau rotesc?

2. **Regula regilor:**
   - Care variantă preferi?
     - A. Orice rege în șah-mat = pierdere (RECOMANDAT)
     - B. Toți regii în șah-mat = pierdere
     - C. Un "rege principal" desemnat

3. **Prioritate features:**
   - Vrei să încep cu logica de joc sau cu UI-ul?
   - Care feature e cel mai important pentru tine?

4. **Timeline:**
   - Când vrei să fie gata MVP (Minimum Viable Product)?
   - Putem să facem versiuni incrementale?

---

## 14. URMĂTORII PAȘI

**ACUM:**
1. ✅ AI citit acest plan și ești de acord
2. 🔜 Îmi trimiți modelele GLB pentru piese
3. 🔜 Confirmi regula pentru regi (A, B sau C)
4. 🔜 Încep să implementez (de la FAZA 1)

**APOI:**
- Implementez iterativ, fază cu fază
- Îți arăt progress după fiecare fază majoră
- Testăm împreună și ajustăm
- Refinăm până e perfect

---

## 📚 RESURSE TEHNICE

### Three.js Documentation
- https://threejs.org/docs/
- https://threejs.org/examples/

### 4D Chess References
- https://en.wikipedia.org/wiki/Four-dimensional_chess
- Various academic papers on n-dimensional game theory

### Git Repository Structure
```
4d_chess/
├── .gitignore
├── README.md
├── PLAN.md (acest fișier)
├── LICENSE
└── ... (fișierele de mai sus)
```

---

**🎮 Pregătit să construim cel mai epic joc de șah 4D! 🚀**

**Data ultimei actualizări:** 30 Octombrie 2025  
**Versiune plan:** 1.0  
**Status:** Ready to implement ✅

