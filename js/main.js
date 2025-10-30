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
    currentW: 2,
    currentY: 0,
    boardOpacity: 0.4,
    showGrid: true,
    highlightMoves: true,
    showCoords: false,
    animatePieces: true,
    showAllBoards: false
};

/* ============================================
   INITIALIZATION
   ============================================ */

function init() {
    console.log('🎮 Initializing 4D Chess...');
    
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
    
    // Start animation loop
    animate();
    
    console.log('✅ Initialization complete!');
}

/* ============================================
   THREE.JS SETUP
   ============================================ */

function setupThreeJS() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    scene.fog = new THREE.Fog(0x0a0e27, 1000, 3000);
    
    // Create camera
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(60, aspect, 1, 5000);
    camera.position.set(800, 600, 800);
    camera.lookAt(0, 0, 0);
    
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
    
    // Add orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 200;
    controls.maxDistance = 2000;
    controls.maxPolarAngle = Math.PI / 2;
    
    // Add lights
    setupLights();
    
    // Add grid helper
    const gridHelper = new THREE.GridHelper(2000, 40, 0x444464, 0x1e2746);
    gridHelper.position.y = -10;
    scene.add(gridHelper);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    
    console.log('✅ Three.js setup complete');
}

function setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    // Main directional light
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.6);
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
    
    // Secondary light
    const secondaryLight = new THREE.DirectionalLight(0x00d4ff, 0.3);
    secondaryLight.position.set(-500, 500, -500);
    scene.add(secondaryLight);
    
    // Point lights for accent
    const pointLight1 = new THREE.PointLight(0x00d4ff, 0.5, 1000);
    pointLight1.position.set(0, 500, 0);
    scene.add(pointLight1);
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
                    
                    setTimeout(() => {
                        updateLoadingText('Ready!');
                        
                        // Hide loading screen
                        setTimeout(() => {
                            loadingScreen.style.display = 'none';
                            console.log('✅ 4D Chess is ready to play!');
                            console.log('📊 Total pieces: 256 (128 white + 128 black)');
                            console.log('📐 Board size: 8×8×8×8 = 4,096 positions');
                            
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
    
    // Save/Load buttons
    document.getElementById('save-btn').addEventListener('click', saveGame);
    document.getElementById('load-btn').addEventListener('click', loadGame);
    
    // W-axis controls
    const wSlider = document.getElementById('w-slider');
    wSlider.addEventListener('input', (e) => {
        gameState.currentW = parseInt(e.target.value);
        updateAxisDisplay('w', gameState.currentW);
        updateBoardVisibility();
    });
    
    document.getElementById('w-minus').addEventListener('click', () => {
        if (gameState.currentW > 0) {
            gameState.currentW--;
            wSlider.value = gameState.currentW;
            updateAxisDisplay('w', gameState.currentW);
            updateBoardVisibility();
        }
    });
    
    document.getElementById('w-plus').addEventListener('click', () => {
        if (gameState.currentW < 7) {
            gameState.currentW++;
            wSlider.value = gameState.currentW;
            updateAxisDisplay('w', gameState.currentW);
            updateBoardVisibility();
        }
    });
    
    // Y-axis controls
    const ySlider = document.getElementById('y-slider');
    ySlider.addEventListener('input', (e) => {
        gameState.currentY = parseInt(e.target.value);
        updateAxisDisplay('y', gameState.currentY);
        updateBoardVisibility();
    });
    
    document.getElementById('y-minus').addEventListener('click', () => {
        if (gameState.currentY > 0) {
            gameState.currentY--;
            ySlider.value = gameState.currentY;
            updateAxisDisplay('y', gameState.currentY);
            updateBoardVisibility();
        }
    });
    
    document.getElementById('y-plus').addEventListener('click', () => {
        if (gameState.currentY < 7) {
            gameState.currentY++;
            ySlider.value = gameState.currentY;
            updateAxisDisplay('y', gameState.currentY);
            updateBoardVisibility();
        }
    });
    
    // Opacity slider
    const opacitySlider = document.getElementById('opacity-slider');
    opacitySlider.addEventListener('input', (e) => {
        gameState.boardOpacity = parseInt(e.target.value) / 100;
        document.getElementById('opacity-value').textContent = e.target.value + '%';
        updateBoardOpacity();
    });
    
    // View options checkboxes
    document.getElementById('show-grid').addEventListener('change', (e) => {
        gameState.showGrid = e.target.checked;
        toggleGrid(gameState.showGrid);
    });
    
    document.getElementById('highlight-moves').addEventListener('change', (e) => {
        gameState.highlightMoves = e.target.checked;
    });
    
    document.getElementById('show-coords').addEventListener('change', (e) => {
        gameState.showCoords = e.target.checked;
        toggleCoordinates(gameState.showCoords);
    });
    
    document.getElementById('animate-pieces').addEventListener('change', (e) => {
        gameState.animatePieces = e.target.checked;
    });
    
    document.getElementById('show-all-boards').addEventListener('change', (e) => {
        gameState.showAllBoards = e.target.checked;
        updateBoardVisibility();
    });
    
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
            document.getElementById('show-grid').checked = gameState.showGrid;
            toggleGrid(gameState.showGrid);
        } else if (e.key === 'h' || e.key === 'H') {
            gameState.highlightMoves = !gameState.highlightMoves;
            document.getElementById('highlight-moves').checked = gameState.highlightMoves;
        } else if (e.key === 'c' || e.key === 'C') {
            gameState.showCoords = !gameState.showCoords;
            document.getElementById('show-coords').checked = gameState.showCoords;
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
    // TODO: Update board material opacity
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
    camera.position.set(800, 600, 800);
    camera.lookAt(0, 0, 0);
    controls.target.set(0, 0, 0);
    controls.update();
}

function setTopView() {
    camera.position.set(0, 1200, 0);
    camera.lookAt(0, 0, 0);
    controls.target.set(0, 0, 0);
    controls.update();
}

function setSideView() {
    camera.position.set(1200, 400, 0);
    camera.lookAt(0, 0, 0);
    controls.target.set(0, 0, 0);
    controls.update();
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
   ANIMATION LOOP
   ============================================ */

function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // TODO: Update game animations
    
    // Render scene
    renderer.render(scene, camera);
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

