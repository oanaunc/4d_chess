/* ============================================
   4D CHESS PIECE TUTORIAL SYSTEM
   ============================================ */

// Tutorial data for each piece
const tutorialData = {
    rook: {
        name: 'Rook',
        description: `
            <strong>Linear Movement:</strong> The Rook moves in straight lines along any of the 4 axes (X, Y, Z, W).
            <br><br>
            <strong>Directions:</strong> 8 total - forward/backward on each axis.
            <br><br>
            <strong>Range:</strong> Unlimited distance until blocked by another piece or board edge.
            <br><br>
            <strong>Captures:</strong> Can capture enemy pieces by moving onto their square.
        `,
        examples: [
            {
                title: 'X-Axis Movement',
                text: 'From (3,2,3,1) can move to any square on the same X=3 line: (3,0,3,1), (3,7,3,1), (3,2,3,1), etc.'
            },
            {
                title: 'W-Axis Movement (4D)',
                text: 'From (3,2,3,1) can move across parallel boards: (3,2,3,0), (3,2,3,2), (3,2,3,7)...'
            },
            {
                title: 'Combined Movement',
                text: 'Can move to (5,2,3,1) by moving 2 steps along X-axis, or to (3,2,3,4) by moving 3 steps along W-axis.'
            }
        ]
    },
    bishop: {
        name: 'Bishop',
        description: `
            <strong>Diagonal Movement:</strong> The Bishop moves diagonally within any 2D plane formed by 2 axes.
            <br><br>
            <strong>Planes:</strong> 6 possible 2D planes (XY, XZ, XW, YZ, YW, ZW).
            <br><br>
            <strong>Directions:</strong> 24 total - 4 diagonal directions per plane.
            <br><br>
            <strong>Example:</strong> In the XY plane, moves like (1,1), (-1,1), (1,-1), (-1,-1) while keeping Z and W constant.
        `,
        examples: [
            {
                title: 'XY Plane Diagonal',
                text: 'From (3,3,2,1): Can move to (4,4,2,1), (2,2,2,1), (4,2,2,1), (2,4,2,1)...'
            },
            {
                title: 'XW Plane (4D Diagonal)',
                text: 'From (3,2,3,3): Can move diagonally in X-W space: (4,2,3,4), (2,2,3,2)...'
            },
            {
                title: 'Multi-Plane Movement',
                text: 'Can switch between planes by moving in different diagonal combinations.'
            }
        ]
    },
    knight: {
        name: 'Knight',
        description: `
            <strong>L-Shape Movement:</strong> The Knight moves in an "L" shape: 2 steps on one axis, 1 step on another.
            <br><br>
            <strong>4D Extension:</strong> With 4 axes, picks 2 axes and moves 2+1 on them.
            <br><br>
            <strong>Total Moves:</strong> 48 possible knight moves (6 axis pairs × 2 ways × 4 direction combinations).
            <br><br>
            <strong>Special:</strong> Only piece that can "jump over" other pieces.
        `,
        examples: [
            {
                title: 'XY Plane L-Move',
                text: 'From (3,3,2,1): Can move to (5,4,2,1) [2X + 1Y], (1,4,2,1) [-2X + 1Y], (5,2,2,1) [2X - 1Y]...'
            },
            {
                title: 'XW Plane (4D L-Move)',
                text: 'From (3,2,3,1): Can move to (5,2,3,2) [2X + 1W], allowing movement across boards!'
            },
            {
                title: 'Cross-Plane Movement',
                text: 'Can combine movements: (2X, 1Z) moves both horizontally and in depth simultaneously.'
            }
        ]
    },
    queen: {
        name: 'Queen',
        description: `
            <strong>Combined Power:</strong> The Queen combines Rook + Bishop movements.
            <br><br>
            <strong>Linear:</strong> 8 directions (like Rook) - along any single axis.
            <br><br>
            <strong>Diagonal:</strong> 24 directions (like Bishop) - in any 2D plane.
            <br><br>
            <strong>Total:</strong> 32 movement directions, making it the most powerful piece.
            <br><br>
            <strong>Range:</strong> Unlimited distance in all directions until blocked.
        `,
        examples: [
            {
                title: 'Linear + Diagonal',
                text: 'From (3,3,3,1): Can move linearly to (7,3,3,1) or diagonally to (6,6,3,1) in XY plane.'
            },
            {
                title: '4D Movement',
                text: 'Can move along W-axis to (3,3,3,5), or diagonally across XW: (5,3,3,3).'
            },
            {
                title: 'Maximum Flexibility',
                text: 'Has access to all movement patterns of both Rook and Bishop simultaneously.'
            }
        ]
    },
    king: {
        name: 'King',
        description: `
            <strong>One Step Anywhere:</strong> The King can move exactly 1 step in ANY direction.
            <br><br>
            <strong>Directions:</strong> 80 possible adjacent positions (3^4 - 1 = 80 combinations).
            <br><br>
            <strong>Types:</strong> Linear (8), Diagonal in 2D (24), Diagonal in 3D (32), Diagonal in 4D (16).
            <br><br>
            <strong>Special:</strong> Cannot move into check. Most important piece - if captured, you lose.
        `,
        examples: [
            {
                title: 'Adjacent Squares',
                text: 'From (3,3,3,1): Can move to any of the 80 adjacent positions, like (4,3,3,1), (3,4,3,1), (4,4,3,1)...'
            },
            {
                title: '4D Adjacent',
                text: 'Can move to (3,3,3,2) or (3,3,3,0) - one step along W-axis (across boards).'
            },
            {
                title: 'Multi-Axis Movement',
                text: 'Can move to (4,4,4,2) - moving simultaneously on X, Y, Z, and W axes.'
            }
        ]
    },
    pawn: {
        name: 'Pawn',
        description: `
            <strong>Forward Movement:</strong> Pawns move forward on Z-axis (like regular chess) and Y-axis (4D extension).
            <br><br>
            <strong>Forward Moves:</strong> 1 square forward, or 2 squares on first move (on both Z and Y axes).
            <br><br>
            <strong>Captures:</strong> Diagonal captures in XZ, XY, and YZ planes - only when enemy piece is present.
            <br><br>
            <strong>Promotion:</strong> When reaching the end of any board, promotes to Queen.
        `,
        examples: [
            {
                title: 'Forward Movement',
                text: 'White pawn at (3,1,1,1) can move forward to (3,1,2,1) or double-move to (3,1,3,1).'
            },
            {
                title: '4D Forward (Y-axis)',
                text: 'Can also move "up" layers: (3,1,1,1) → (3,2,1,1) - moving to a higher board layer.'
            },
            {
                title: 'Diagonal Capture',
                text: 'From (3,2,2,1): Can capture diagonally at (4,2,3,1) or (4,3,2,1) if enemy piece is there.'
            }
        ]
    }
};

// Tutorial state
let tutorialState = {
    currentPiece: 0,
    pieces: ['rook', 'bishop', 'knight', 'queen', 'king', 'pawn'],
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    currentMesh: null
};

/* ============================================
   TUTORIAL INITIALIZATION
   ============================================ */

function initTutorial() {
    const canvas = document.getElementById('tutorial-piece-canvas');
    if (!canvas) return;
    
    // Create mini Three.js scene for piece viewer
    tutorialState.scene = new THREE.Scene();
    tutorialState.scene.background = new THREE.Color(0x0a0e27);
    
    const aspect = 280 / 200; // Fixed aspect ratio for the viewer
    tutorialState.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
    tutorialState.camera.position.set(0, 8, 20); // Further back to see pieces better
    tutorialState.camera.lookAt(0, 0, 0);
    
    tutorialState.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: false
    });
    tutorialState.renderer.setSize(280, 200);
    
    // Simple orbit controls for rotation
    if (typeof THREE.OrbitControls !== 'undefined') {
        tutorialState.controls = new THREE.OrbitControls(tutorialState.camera, canvas);
        tutorialState.controls.enableZoom = false;
        tutorialState.controls.enablePan = false;
        tutorialState.controls.minDistance = 10;
        tutorialState.controls.maxDistance = 30;
        tutorialState.controls.target.set(0, 0, 0);
        tutorialState.controls.enableDamping = true;
        tutorialState.controls.dampingFactor = 0.05;
    }
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    tutorialState.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    tutorialState.scene.add(directionalLight);
    
    // Setup navigation buttons
    document.getElementById('tutorial-prev').addEventListener('click', () => {
        tutorialState.currentPiece = (tutorialState.currentPiece - 1 + 6) % 6;
        updateTutorialDisplay();
    });
    
    document.getElementById('tutorial-next').addEventListener('click', () => {
        tutorialState.currentPiece = (tutorialState.currentPiece + 1) % 6;
        updateTutorialDisplay();
    });
    
    // Initial display
    updateTutorialDisplay();
    
    // Start animation loop
    animateTutorial();
    
    console.log('✅ Tutorial system initialized');
}

function updateTutorialDisplay() {
    const pieceType = tutorialState.pieces[tutorialState.currentPiece];
    const data = tutorialData[pieceType];
    
    if (!data) return;
    
    // Update page number
    document.getElementById('tutorial-page-number').textContent = tutorialState.currentPiece + 1;
    
    // Update piece name
    document.getElementById('tutorial-piece-name').textContent = data.name;
    
    // Update description
    document.getElementById('tutorial-description').innerHTML = data.description;
    
    // Update examples
    const examplesContainer = document.getElementById('tutorial-examples');
    examplesContainer.innerHTML = '';
    data.examples.forEach(example => {
        const exampleDiv = document.createElement('div');
        exampleDiv.className = 'tutorial-example';
        exampleDiv.innerHTML = `
            <div class="tutorial-example-title">${example.title}</div>
            <div class="tutorial-example-text">${example.text}</div>
        `;
        examplesContainer.appendChild(exampleDiv);
    });
    
    // Load and display 3D model
    loadTutorialPiece(pieceType);
}

function loadTutorialPiece(pieceType) {
    // Remove previous mesh
    if (tutorialState.currentMesh) {
        tutorialState.scene.remove(tutorialState.currentMesh);
        tutorialState.currentMesh = null;
    }
    
    // Get geometry from Models
    if (!Models || !Models.geometries || !Models.geometries[pieceType]) {
        console.warn(`Tutorial: Geometry not loaded for ${pieceType}`);
        return;
    }
    
    const geometry = Models.geometries[pieceType];
    const material = new THREE.MeshPhongMaterial({
        color: 0xeeeeee,
        specular: 0x8888aa,
        shininess: 30
    });
    
    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    
    // Apply scale - much smaller for tutorial viewer
    // Use a fraction of the game scale factor
    const tutorialScale = Models.SCALE_FACTOR * 0.15; // 15% of game scale
    mesh.scale.set(tutorialScale, tutorialScale, tutorialScale);
    
    // Center the mesh
    const box = new THREE.Box3().setFromObject(mesh);
    const center = box.getCenter(new THREE.Vector3());
    mesh.position.sub(center);
    
    // Adjust height to sit on ground (slightly above)
    const size = box.getSize(new THREE.Vector3());
    mesh.position.y = -size.y / 2 + 1; // Slightly above ground for better visibility
    
    // Handle special pieces
    if (pieceType === 'pawn' || pieceType === 'bishop' || pieceType === 'queen') {
        mesh.material.side = THREE.DoubleSide;
    }
    
    tutorialState.scene.add(mesh);
    tutorialState.currentMesh = mesh;
    
    // Reset camera position
    if (tutorialState.controls) {
        tutorialState.controls.reset();
    }
}

function animateTutorial() {
    requestAnimationFrame(animateTutorial);
    
    if (tutorialState.controls) {
        tutorialState.controls.update();
    }
    
    if (tutorialState.renderer && tutorialState.scene && tutorialState.camera) {
        tutorialState.renderer.render(tutorialState.scene, tutorialState.camera);
    }
}

// Initialize when Models are loaded
if (typeof window !== 'undefined') {
    // Wait for Models to be available
    window.initTutorial = initTutorial;
}

