/* ============================================
   4D CHESS - MAIN GAME CONTROLLER
   ============================================ */

// Global variables
let scene, camera, renderer, controls;
let gameBoard, moveManager;
let canvas, loadingScreen;

// Game mode (local single player for now)
const LocalMode = {
    move: function(x0, y0, z0, w0, x1, y1, z1, w1, receiving) {
        // Simple local move (no validation yet)
        console.log(`Move: (${x0},${y0},${z0},${w0}) → (${x1},${y1},${z1},${w1})`);
    },
    undo: function() {
        console.log('Undo move');
    },
    redo: function() {
        console.log('Redo move');
    },
    canMove: function(team) {
        return true; // For now, allow all moves
    },
    updateSelectability: function() {
        // Enable selectability for current team
        const currentTeam = this.whoseTurn();
        this.setSelectability(0, currentTeam === 0);
        this.setSelectability(1, currentTeam === 1);
    },
    moveStatus: function() {
        return `Turn ${this.currTurn()}: ${this.whoseTurnViewed() === 0 ? 'White' : 'Black'} to move`;
    }
};

// Game state
const gameState = {
    currentW: 0,  // Show white pieces (W=0,1) by default
    currentY: 0,  // Show bottom boards
    boardOpacity: 0.8,
    showGrid: true,
    highlightMoves: true,
    showCoords: false,
    animatePieces: true,
    showAllBoards: false,
    selectedPiece: null,  // Currently selected piece mesh
    selectedPieceData: null,  // Piece data (from gameBoard.pieces)
    possibleMoves: null  // Array of possible moves for selected piece
};

// Selection system
const selectionSystem = {
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    hoveredPiece: null,
    selectedPiece: null,
    
    // Colors
    HOVER_COLOR: 0x00B9FF,  // Blue for hover
    SELECT_COLOR: 0x00B9FF,  // Blue for selection
    
    // Highlight a piece
    highlight: function(mesh, color) {
        if (!mesh || !mesh.material) return;
        
        // Store original color if not already stored
        if (!mesh.material.originalColor) {
            mesh.material.originalColor = mesh.material.color.getHex();
        }
        
        // Set new color
        mesh.material.color.setHex(color);
    },
    
    // Unhighlight a piece
    unhighlight: function(mesh) {
        if (!mesh || !mesh.material || !mesh.material.originalColor) return;
        
        mesh.material.color.setHex(mesh.material.originalColor);
    }
};

/* ============================================
   INITIALIZATION
   ============================================ */

function init() {
    console.log('🎮 Initializing 4D Chess...');
    
    // Suppress browser extension errors (common Chrome extension issue)
    window.addEventListener('error', (e) => {
        if (e.message && e.message.includes('message channel closed')) {
            e.preventDefault();
            return false;
        }
    }, true);
    
    // Get canvas and loading screen
    canvas = document.getElementById('game-canvas');
    loadingScreen = document.getElementById('loading-screen');
    
    // Setup Three.js
    setupThreeJS();
    
    // Setup UI event listeners
    setupUIEvents();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Initialize game (wait for models to load first)
    initializeGame();
    
    // Setup mouse interaction for piece selection
    setupPieceSelection();
    
    // Tutorial will initialize after models are loaded (see initializeGame)
    
    // Start animation loop
    animate();
    
    console.log('✅ Initialization complete!');
}

/* ============================================
   MOUSE INTERACTION SETUP
   ============================================ */

function setupPieceSelection() {
    if (!canvas) return;
    
    // Update mouse position
    canvas.addEventListener('mousemove', function(event) {
        // Calculate mouse position in normalized device coordinates (-1 to +1)
        const rect = canvas.getBoundingClientRect();
        selectionSystem.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        selectionSystem.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    });
    
    // Handle clicks
    canvas.addEventListener('click', function(event) {
        // Check if clicking on a possible move location
        if (selectionSystem.selectedPiece && gameState.possibleMoves) {
            const pieces = gameBoard.graphics.possibleMovesContainer.children.filter(p => p.canRayCast);
            if (pieces.length > 0) {
                selectionSystem.raycaster.setFromCamera(selectionSystem.mouse, camera);
                const intersects = selectionSystem.raycaster.intersectObjects(pieces);
                
                if (intersects.length > 0) {
                    // Clicked on a possible move - execute move
                    const targetMesh = intersects[0].object;
                    const targetWorldPos = targetMesh.position;
                    const targetCoords = gameBoard.graphics.worldCoordinates(targetWorldPos);
                    
                    // Find this move in possibleMoves
                    const move = gameState.possibleMoves.find(m => 
                        m.x === targetCoords.x && 
                        m.y === targetCoords.y && 
                        m.z === targetCoords.z && 
                        m.w === targetCoords.w
                    );
                    
                    if (move) {
                        // Get source coordinates
                        const sourceCoords = gameBoard.graphics.worldCoordinates(selectionSystem.selectedPiece.position);
                        
                        // Execute move
                        executeMove(
                            sourceCoords.x, sourceCoords.y, sourceCoords.z, sourceCoords.w,
                            targetCoords.x, targetCoords.y, targetCoords.z, targetCoords.w
                        );
                        return;
                    }
                }
            }
        }
        
        // Regular piece selection
        if (!gameBoard || !gameBoard.graphics) return;
        
        const pieces = gameBoard.graphics.piecesContainer.children.filter(p => p.canRayCast);
        if (pieces.length === 0) return;
        
        selectionSystem.raycaster.setFromCamera(selectionSystem.mouse, camera);
        const intersects = selectionSystem.raycaster.intersectObjects(pieces);
        
        if (intersects.length > 0) {
            const clickedPiece = intersects[0].object;
            
            // If clicking the same piece, deselect it
            if (selectionSystem.selectedPiece === clickedPiece) {
                deselectPiece();
            } else {
                selectPiece(clickedPiece);
            }
        } else {
            // Clicked on empty space, deselect
            deselectPiece();
        }
    });
    
    console.log('✅ Piece selection system initialized');
}

function executeMove(x0, y0, z0, w0, x1, y1, z1, w1) {
    console.log(`🎯 Executing move: (${x0},${y0},${z0},${w0}) → (${x1},${y1},${z1},${w1})`);
    
    // TODO: Validate move and update game state
    // For now, just log and deselect
    deselectPiece();
}

/* ============================================
   THREE.JS SETUP
   ============================================ */

function setupThreeJS() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27); // Dark blue background
    scene.fog = new THREE.Fog(0x0a0e27, 1000, 3000);
    
    // Create camera
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(60, aspect, 1, 10000);
    
    // Initial camera position (will be adjusted after board is created)
    camera.position.set(0, 1500, 0);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: false
    });
    renderer.setSize(window.innerWidth - 560, window.innerHeight - 60); // Minus panels width
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Add orbit controls (CAD-style)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);  // Will be updated after board is created
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = true;  // Enable vertical panning (like CAD)
    controls.minDistance = 200;
    controls.maxDistance = 5000;
    controls.maxPolarAngle = Math.PI; // Allow full rotation
    
    // Mouse button configuration (CAD-style)
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,    // Left mouse: rotate
        MIDDLE: THREE.MOUSE.DOLLY,   // Middle mouse (wheel): zoom
        RIGHT: THREE.MOUSE.PAN       // Right mouse: pan (move horizontally & vertically)
    };
    
    // Adjust speeds for better control
    controls.panSpeed = 1.0;         // Pan speed
    controls.rotateSpeed = 1.0;      // Rotation speed
    controls.zoomSpeed = 1.2;        // Zoom speed
    
    // Enable zoom to cursor behavior (zoom towards mouse pointer)
    if (controls.hasOwnProperty('zoomToCursor')) {
        controls.zoomToCursor = true;
    }
    
    // Add lights
    setupLights();
    
    // Add grid helper (position will be adjusted after board is created)
    const gridHelper = new THREE.GridHelper(4000, 80, 0x444464, 0x1e2746);
    gridHelper.position.set(0, 0, 0);
    scene.add(gridHelper);
    
    // Store grid helper reference for later positioning
    window.gridHelper = gridHelper;
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    
    console.log('✅ Three.js setup complete');
}

function setupLights() {
    // Stronger ambient light for even illumination of matte materials
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);
    
    // Softer main directional light to reduce harsh reflections
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.45);
    mainLight.position.set(500, 1000, 500);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 100;
    mainLight.shadow.camera.far = 2000;
    mainLight.shadow.camera.left = -1000;
    mainLight.shadow.camera.right = 1000;
    mainLight.shadow.camera.top = 1000;
    mainLight.shadow.camera.bottom = -1000;
    scene.add(mainLight);
    
    // Softer secondary light (no blue tint for cleaner colors)
    const secondaryLight = new THREE.DirectionalLight(0xffffff, 0.2);
    secondaryLight.position.set(-500, 500, -500);
    scene.add(secondaryLight);
    
    // Fill light from below to reduce shadows
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.15);
    fillLight.position.set(0, -500, 0);
    scene.add(fillLight);
}

/* ============================================
   GAME INITIALIZATION
   ============================================ */

function initializeGame() {
    updateLoadingText('Loading chess piece models...');
    
    // Load 3D models (.obj files)
    Models.loadModels()
        .then(() => {
            updateLoadingText('Creating 4D game board...');
            console.log('🎮 Creating game board...');
            
            // Create game board (n=8 for 8x8x8x8 = 4096 positions)
            gameBoard = new GameBoard(8, BoardGraphics);
            
            // Wait a bit for board to render
            setTimeout(() => {
                updateLoadingText('Placing 256 chess pieces...');
                console.log('♟️ Placing pieces...');
                
                // Initialize starting positions (256 pieces: 128 white + 128 black)
                gameBoard.initializeStartingPositions();
                
                setTimeout(() => {
                    updateLoadingText('Initializing game manager...');
                    
                    // Create move manager
                    moveManager = new MoveManager(gameBoard, 0, LocalMode);
                    
                    // Position camera based on actual board center (like the example game does!)
                    const boardCenter = gameBoard.graphics.getCenter();
                    console.log('📐 Board center calculated:', {
                        x: boardCenter.x,
                        y: boardCenter.y,
                        z: boardCenter.z
                    });
                    
                    const newCameraPos = {
                        x: 800,
                        y: 600,
                        z: boardCenter.z + 800
                    };
                    
                    console.log('📷 Setting camera to:', newCameraPos);
                    console.log('🎯 Setting camera target to:', {
                        x: boardCenter.x,
                        y: boardCenter.y,
                        z: boardCenter.z
                    });
                    
                    camera.position.set(newCameraPos.x, newCameraPos.y, newCameraPos.z);
                    controls.target.set(boardCenter.x, boardCenter.y, boardCenter.z);
                    controls.update();
                    
                    console.log('✅ Camera updated. Current position:', {
                        x: camera.position.x,
                        y: camera.position.y,
                        z: camera.position.z
                    });
                    console.log('✅ Camera target:', {
                        x: controls.target.x,
                        y: controls.target.y,
                        z: controls.target.z
                    });
                    
                    // Position grid helper under board center
                    if (window.gridHelper) {
                        window.gridHelper.position.set(boardCenter.x, 0, boardCenter.z);
                    }
                    
                    setTimeout(() => {
                        updateLoadingText('Ready!');
                        
                        // Hide loading screen
                        setTimeout(() => {
                            loadingScreen.style.display = 'none';
                            console.log('✅ 4D Chess is ready to play!');
                            console.log('📊 Total pieces: 256 (128 white + 128 black)');
                            
                            // Initialize tutorial system now that models are loaded
                            if (typeof initTutorial === 'function') {
                                initTutorial();
                            }
                            console.log('📐 Board size: 8×8×8×8 = 4,096 positions');
                            
                            // Debug scene structure
                            console.log('🔍 Scene children:', scene.children.map(c => c.name || c.type));
                            if (gameBoard && gameBoard.graphics) {
                                console.log('🔍 Board graphics mesh children:', {
                                    boardContainer: gameBoard.graphics.boardContainer ? gameBoard.graphics.boardContainer.children.length : 'none',
                                    piecesContainer: gameBoard.graphics.piecesContainer ? gameBoard.graphics.piecesContainer.children.length : 'none',
                                    meshInScene: scene.children.includes(gameBoard.graphics.mesh)
                                });
                            }
                            
                            // Update UI
                            updateStatus('Game ready', 1, 'White', 'No check');
                        }, 500);
                    }, 500);
                }, 1000);
            }, 1000);
        })
        .catch((error) => {
            console.error('❌ Error loading models:', error);
            updateLoadingText('Error loading models. Check console for details.');
        });
}

function updateLoadingText(text) {
    const loadingText = document.getElementById('loading-text');
    if (loadingText) {
        loadingText.textContent = text;
    }
}

/* ============================================
   UI EVENT HANDLERS
   ============================================ */

function setupUIEvents() {
    // New Game button
    document.getElementById('new-game-btn').addEventListener('click', () => {
        if (confirm('Start a new game? Current game will be lost.')) {
            resetGame();
        }
    });
    
    document.getElementById('new-game-modal-btn').addEventListener('click', () => {
        resetGame();
        document.getElementById('game-over-modal').style.display = 'none';
    });
    
    // Undo/Redo buttons
    document.getElementById('undo-btn').addEventListener('click', undoMove);
    document.getElementById('redo-btn').addEventListener('click', redoMove);
    
    
    // Opacity slider
    const opacitySlider = document.getElementById('opacity-slider');
    opacitySlider.addEventListener('input', (e) => {
        gameState.boardOpacity = parseInt(e.target.value) / 100;
        document.getElementById('opacity-value').textContent = e.target.value + '%';
        updateBoardOpacity();
    });
    
    // View options checkboxes (removed from UI, but keep functionality for keyboard shortcuts)
    const showGridCheckbox = document.getElementById('show-grid');
    if (showGridCheckbox) {
        showGridCheckbox.addEventListener('change', (e) => {
            gameState.showGrid = e.target.checked;
            toggleGrid(gameState.showGrid);
        });
    }
    
    const highlightMovesCheckbox = document.getElementById('highlight-moves');
    if (highlightMovesCheckbox) {
        highlightMovesCheckbox.addEventListener('change', (e) => {
            gameState.highlightMoves = e.target.checked;
        });
    }
    
    const showCoordsCheckbox = document.getElementById('show-coords');
    if (showCoordsCheckbox) {
        showCoordsCheckbox.addEventListener('change', (e) => {
            gameState.showCoords = e.target.checked;
            toggleCoordinates(gameState.showCoords);
        });
    }
    
    const animatePiecesCheckbox = document.getElementById('animate-pieces');
    if (animatePiecesCheckbox) {
        animatePiecesCheckbox.addEventListener('change', (e) => {
            gameState.animatePieces = e.target.checked;
        });
    }
    
    const showAllBoardsCheckbox = document.getElementById('show-all-boards');
    if (showAllBoardsCheckbox) {
        showAllBoardsCheckbox.addEventListener('change', (e) => {
            gameState.showAllBoards = e.target.checked;
            updateBoardVisibility();
        });
    }
    
    // Camera controls
    document.getElementById('reset-camera').addEventListener('click', resetCamera);
    document.getElementById('top-view').addEventListener('click', setTopView);
    document.getElementById('side-view').addEventListener('click', setSideView);
    
    console.log('✅ UI events setup complete');
}

/* ============================================
   KEYBOARD SHORTCUTS
   ============================================ */

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Navigation
        if (e.key === 'w' || e.key === 'W') {
            if (gameState.currentW < 7) {
                gameState.currentW++;
                document.getElementById('w-slider').value = gameState.currentW;
                updateAxisDisplay('w', gameState.currentW);
                updateBoardVisibility();
            }
        } else if (e.key === 's' || e.key === 'S') {
            if (gameState.currentW > 0) {
                gameState.currentW--;
                document.getElementById('w-slider').value = gameState.currentW;
                updateAxisDisplay('w', gameState.currentW);
                updateBoardVisibility();
            }
        } else if (e.key === 'q' || e.key === 'Q') {
            if (gameState.currentY < 7) {
                gameState.currentY++;
                document.getElementById('y-slider').value = gameState.currentY;
                updateAxisDisplay('y', gameState.currentY);
                updateBoardVisibility();
            }
        } else if (e.key === 'e' || e.key === 'E') {
            if (gameState.currentY > 0) {
                gameState.currentY--;
                document.getElementById('y-slider').value = gameState.currentY;
                updateAxisDisplay('y', gameState.currentY);
                updateBoardVisibility();
            }
        }
        
        // Camera
        else if (e.key === 'r' || e.key === 'R') {
            resetCamera();
        }
        
        // Game actions
        else if (e.key === 'Escape') {
            deselectPiece();
        } else if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            undoMove();
        } else if (e.ctrlKey && e.key === 'y') {
            e.preventDefault();
            redoMove();
        }
        
        // View toggles
        else if (e.key === 'g' || e.key === 'G') {
            gameState.showGrid = !gameState.showGrid;
            const showGridCheckbox = document.getElementById('show-grid');
            if (showGridCheckbox) showGridCheckbox.checked = gameState.showGrid;
            toggleGrid(gameState.showGrid);
        } else if (e.key === 'h' || e.key === 'H') {
            gameState.highlightMoves = !gameState.highlightMoves;
            const highlightMovesCheckbox = document.getElementById('highlight-moves');
            if (highlightMovesCheckbox) highlightMovesCheckbox.checked = gameState.highlightMoves;
        } else if (e.key === 'c' || e.key === 'C') {
            gameState.showCoords = !gameState.showCoords;
            const showCoordsCheckbox = document.getElementById('show-coords');
            if (showCoordsCheckbox) showCoordsCheckbox.checked = gameState.showCoords;
            toggleCoordinates(gameState.showCoords);
        }
    });
    
    console.log('✅ Keyboard shortcuts setup complete');
}

/* ============================================
   GAME FUNCTIONS
   ============================================ */

function resetGame() {
    console.log('🔄 Resetting game...');
    // TODO: Reset game board
    // TODO: Reset move history
    // TODO: Reset UI
    updateStatus('Game reset', 1, 'White', 'No check');
    addMoveToHistory('Game reset');
}

function undoMove() {
    console.log('↶ Undo move');
    // TODO: Implement undo
}

function redoMove() {
    console.log('↷ Redo move');
    // TODO: Implement redo
}

function saveGame() {
    console.log('💾 Saving game...');
    // TODO: Implement save
    alert('Save feature coming soon!');
}

function loadGame() {
    console.log('📂 Loading game...');
    // TODO: Implement load
    alert('Load feature coming soon!');
}

function deselectPiece() {
    console.log('Deselecting piece...');
    // TODO: Implement deselect
    document.getElementById('selected-piece-info').style.display = 'none';
}

/* ============================================
   UI UPDATE FUNCTIONS
   ============================================ */

function updateAxisDisplay(axis, value) {
    document.getElementById(`${axis}-value`).textContent = `${value}/7`;
}

function updateBoardVisibility() {
    console.log(`Viewing W=${gameState.currentW}, Y=${gameState.currentY}`);
    // TODO: Update board visibility based on current W and Y
}

function updateBoardOpacity() {
    console.log(`Board opacity: ${gameState.boardOpacity}`);
    
    if (!gameBoard || !gameBoard.graphics || !gameBoard.graphics.boardContainer) {
        return;
    }
    
    // Update all board squares
    gameBoard.graphics.boardContainer.traverse((object) => {
        if (object instanceof THREE.Mesh && object.material) {
            object.material.opacity = gameState.boardOpacity;
            object.material.transparent = gameState.boardOpacity < 1.0;
            object.material.needsUpdate = true;
        }
    });
}

function toggleGrid(show) {
    scene.traverse((object) => {
        if (object instanceof THREE.GridHelper) {
            object.visible = show;
        }
    });
}

function toggleCoordinates(show) {
    console.log(`Coordinates ${show ? 'shown' : 'hidden'}`);
    // TODO: Toggle coordinate labels
}

function resetCamera() {
    if (gameBoard && gameBoard.graphics) {
        const center = gameBoard.graphics.getCenter();
        camera.position.set(800, 600, center.z + 800);
        controls.target.set(center.x, center.y, center.z);
        controls.update();
    }
}

function setTopView() {
    if (gameBoard && gameBoard.graphics) {
        const center = gameBoard.graphics.getCenter();
        camera.position.set(center.x, 3000, center.z);
        controls.target.set(center.x, center.y, center.z);
        controls.update();
    }
}

function setSideView() {
    if (gameBoard && gameBoard.graphics) {
        const center = gameBoard.graphics.getCenter();
        camera.position.set(center.x + 2000, center.y + 500, center.z);
        controls.target.set(center.x, center.y, center.z);
        controls.update();
    }
}

function updateStatus(message, turn, player, checkStatus) {
    document.getElementById('turn-number').textContent = turn;
    document.getElementById('current-player').textContent = player;
    document.getElementById('check-status').textContent = checkStatus;
    
    // Update turn indicator
    const turnIcon = document.getElementById('turn-icon');
    const turnText = document.getElementById('turn-text');
    turnIcon.textContent = player === 'White' ? '♔' : '♚';
    turnText.textContent = `${player} to move`;
    
    // Update check indicator
    const checkIndicator = document.getElementById('check-indicator');
    if (checkStatus !== 'No check') {
        checkIndicator.style.display = 'flex';
    } else {
        checkIndicator.style.display = 'none';
    }
}

function addMoveToHistory(move) {
    const historyDiv = document.getElementById('move-history');
    const moveItem = document.createElement('div');
    moveItem.className = 'move-item';
    moveItem.textContent = move;
    historyDiv.appendChild(moveItem);
    
    // Auto-scroll to bottom
    historyDiv.scrollTop = historyDiv.scrollHeight;
}

function updatePieceCount(white, black) {
    document.getElementById('white-count').textContent = white;
    document.getElementById('black-count').textContent = black;
}

/* ============================================
   2D GIZMO VISUALIZATION
   ============================================ */

function update2DGizmo() {
    const canvas = document.getElementById('axes-gizmo-canvas');
    if (!canvas || !camera) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const axisLength = 60;
    const arrowSize = 14; // Larger arrows for better visibility
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get camera's local axes in world space (these represent how camera sees the world)
    const cameraRight = new THREE.Vector3(1, 0, 0);
    cameraRight.applyQuaternion(camera.quaternion);
    
    const cameraUp = new THREE.Vector3(0, 1, 0);
    cameraUp.applyQuaternion(camera.quaternion);
    
    const cameraForward = new THREE.Vector3(0, 0, -1);
    cameraForward.applyQuaternion(camera.quaternion);
    
    // Project world axes onto camera's view plane
    // World X axis (red) - projects along camera's right vector
    const worldX = new THREE.Vector3(1, 0, 0);
    const worldXScreenX = worldX.dot(cameraRight) * axisLength;
    const worldXScreenY = -worldX.dot(cameraUp) * axisLength;
    drawAxisWithArrow(ctx, centerX, centerY, worldXScreenX, worldXScreenY, '#ff0000', 'X', arrowSize);
    
    // World Y axis (green) - projects along camera's up vector  
    const worldY = new THREE.Vector3(0, 1, 0);
    const worldYScreenX = worldY.dot(cameraRight) * axisLength;
    const worldYScreenY = -worldY.dot(cameraUp) * axisLength;
    drawAxisWithArrow(ctx, centerX, centerY, worldYScreenX, worldYScreenY, '#00ff00', 'Y', arrowSize);
    
    // World Z axis (blue) - projects along camera's forward vector
    const worldZ = new THREE.Vector3(0, 0, 1);
    const worldZScreenX = worldZ.dot(cameraRight) * axisLength;
    const worldZScreenY = -worldZ.dot(cameraUp) * axisLength;
    drawAxisWithArrow(ctx, centerX, centerY, worldZScreenX, worldZScreenY, '#0000ff', 'Z', arrowSize);
    
    // W Axis (Cyan) - 4th dimension shown as diamond/square indicator
    const wPosX = centerX + (worldXScreenX + worldYScreenX + worldZScreenX) * 0.25;
    const wPosY = centerY + (worldXScreenY + worldYScreenY + worldZScreenY) * 0.25;
    const wSize = 10;
    
    // Draw diamond shape (rotated square) for W axis
    ctx.strokeStyle = '#00ffff';
    ctx.fillStyle = '#00ffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(wPosX, wPosY - wSize); // Top
    ctx.lineTo(wPosX + wSize, wPosY); // Right
    ctx.lineTo(wPosX, wPosY + wSize); // Bottom
    ctx.lineTo(wPosX - wSize, wPosY); // Left
    ctx.closePath();
    ctx.fill();
    
    // Outline for visibility
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // W label with shadow
    const labelX = wPosX;
    const labelY = wPosY - wSize - 14;
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Text shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillText('W', labelX + 1, labelY + 1);
    
    // Text
    ctx.fillStyle = '#00ffff';
    ctx.fillText('W', labelX, labelY);
}

function drawAxisWithArrow(ctx, x1, y1, dx, dy, color, label, arrowSize) {
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length < 0.1) return; // Skip if axis is too short
    
    const unitX = dx / length;
    const unitY = dy / length;
    const tipX = x1 + dx;
    const tipY = y1 + dy;
    
    // Draw axis line with thicker stroke
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();
    
    // Draw arrowhead (larger and more visible)
    const arrowAngle = Math.PI / 5; // 36 degrees for wider arrow
    const arrowLength = arrowSize;
    
    // Calculate arrow points
    const angle = Math.atan2(dy, dx);
    const arrowX1 = tipX - arrowLength * Math.cos(angle - arrowAngle);
    const arrowY1 = tipY - arrowLength * Math.sin(angle - arrowAngle);
    const arrowX2 = tipX - arrowLength * Math.cos(angle + arrowAngle);
    const arrowY2 = tipY - arrowLength * Math.sin(angle + arrowAngle);
    
    // Draw filled arrowhead with outline for visibility
    ctx.fillStyle = color;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(arrowX1, arrowY1);
    ctx.lineTo(arrowX2, arrowY2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke(); // Outline for better visibility
    
    // Draw label with shadow for readability
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const labelOffset = 22;
    const labelX = tipX + unitX * labelOffset;
    const labelY = tipY + unitY * labelOffset;
    
    // Text shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillText(label, labelX + 1, labelY + 1);
    
    // Text
    ctx.fillStyle = color;
    ctx.fillText(label, labelX, labelY);
}

/* ============================================
   ANIMATION LOOP
   ============================================ */

function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Update raycasting for piece selection (hover)
    updatePieceHover();
    
    // Update 2D gizmo visualization
    update2DGizmo();
    
    // TODO: Update game animations
    
    // Render scene
    renderer.render(scene, camera);
}

/* ============================================
   PIECE SELECTION SYSTEM
   ============================================ */

function updatePieceHover() {
    if (!gameBoard || !gameBoard.graphics) return;
    
    // Only update hover if no piece is selected
    if (selectionSystem.selectedPiece) return;
    
    // Get all selectable pieces
    const pieces = gameBoard.graphics.piecesContainer.children.filter(p => p.canRayCast);
    
    if (pieces.length === 0) return;
    
    // Update raycasting
    selectionSystem.raycaster.setFromCamera(selectionSystem.mouse, camera);
    const intersects = selectionSystem.raycaster.intersectObjects(pieces);
    
    // Get closest intersection
    const closest = intersects.length > 0 ? intersects[0].object : null;
    
    // Update hover highlight
    if (closest !== selectionSystem.hoveredPiece) {
        // Unhighlight previous hover
        if (selectionSystem.hoveredPiece) {
            selectionSystem.unhighlight(selectionSystem.hoveredPiece);
        }
        
        // Highlight new hover
        selectionSystem.hoveredPiece = closest;
        if (selectionSystem.hoveredPiece && selectionSystem.hoveredPiece.selectable !== false) {
            selectionSystem.highlight(selectionSystem.hoveredPiece, selectionSystem.HOVER_COLOR);
        }
    }
}

function selectPiece(mesh) {
    if (!mesh || !gameBoard) return;
    
    // Deselect previous piece
    if (selectionSystem.selectedPiece && selectionSystem.selectedPiece !== mesh) {
        selectionSystem.unhighlight(selectionSystem.selectedPiece);
        gameBoard.graphics.hidePossibleMoves();
    }
    
    // Get piece data from board coordinates
    const worldPos = mesh.position;
    const boardCoords = gameBoard.graphics.worldCoordinates(worldPos);
    const piece = gameBoard.pieces[boardCoords.x][boardCoords.y][boardCoords.z][boardCoords.w];
    
    if (!piece || !piece.type) {
        // Empty square clicked, deselect
        if (selectionSystem.selectedPiece) {
            selectionSystem.unhighlight(selectionSystem.selectedPiece);
            selectionSystem.selectedPiece = null;
            gameState.selectedPiece = null;
            gameState.selectedPieceData = null;
            gameState.possibleMoves = null;
            gameBoard.graphics.hidePossibleMoves();
        }
        return;
    }
    
    // Check if piece is selectable
    if (mesh.selectable === false) {
        return; // Cannot select this piece
    }
    
    // Select the piece
    selectionSystem.selectedPiece = mesh;
    selectionSystem.highlight(mesh, selectionSystem.SELECT_COLOR);
    
    // Update game state
    gameState.selectedPiece = mesh;
    gameState.selectedPieceData = piece;
    
    // Get possible moves
    const possibleMoves = piece.getPossibleMoves(
        gameBoard.pieces,
        boardCoords.x,
        boardCoords.y,
        boardCoords.z,
        boardCoords.w
    );
    
    gameState.possibleMoves = possibleMoves;
    
    // Show possible moves (with canRayCast=true so they can be clicked)
    if (possibleMoves && possibleMoves.length > 0) {
        gameBoard.graphics.showPossibleMoves(possibleMoves, piece, {}, true);
    } else {
        gameBoard.graphics.hidePossibleMoves();
    }
    
    console.log(`✅ Selected ${piece.type} at (${boardCoords.x},${boardCoords.y},${boardCoords.z},${boardCoords.w}), ${possibleMoves.length} possible moves`);
}

function deselectPiece() {
    if (selectionSystem.selectedPiece) {
        selectionSystem.unhighlight(selectionSystem.selectedPiece);
        selectionSystem.selectedPiece = null;
        gameState.selectedPiece = null;
        gameState.selectedPieceData = null;
        gameState.possibleMoves = null;
        gameBoard.graphics.hidePossibleMoves();
    }
}

/* ============================================
   WINDOW RESIZE HANDLER
   ============================================ */

function onWindowResize() {
    const width = window.innerWidth - 560; // Minus panels
    const height = window.innerHeight - 60; // Minus header
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
}

/* ============================================
   START THE GAME
   ============================================ */

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

