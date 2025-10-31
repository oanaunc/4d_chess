/* ============================================
   COMPREHENSIVE 4D CHESS TUTORIAL SYSTEM
   ============================================ */

// Tutorial pages content
const comprehensiveTutorialPages = [
    {
        title: "Welcome to 4D Chess",
        content: `
            <h2>Welcome to 4D Chess!</h2>
            <p>Welcome to the extraordinary world of <strong>Four-Dimensional Chess</strong>! This isn't just chess with extra dimensions—it's a completely new strategic experience that will challenge your spatial thinking and tactical abilities.</p>
            
            <h3>What Makes This Different?</h3>
            <p>Unlike traditional 2D chess (8×8 = 64 squares), our game is played on a <strong>4D hypercube</strong>:</p>
            <ul>
                <li><strong>8×8×8×8 = 4,096 positions</strong> - That's 64 times more possibilities!</li>
                <li><strong>448 pieces per player</strong> - You control an entire army across multiple dimensions</li>
                <li><strong>4D movement</strong> - Pieces can move along four independent axes</li>
                <li><strong>Strategic depth</strong> - Protect multiple kings while attacking across parallel universes</li>
            </ul>
            
            <p>This tutorial will guide you through everything you need to know: the mathematics behind 4D space, how pieces move, understanding the interface, and how we visualize a 4D game in our 3D world.</p>
        `
    },
    {
        title: "The Mathematics of 4D Space",
        content: `
            <h2>The Mathematics of 4D Space</h2>
            <p>Understanding 4D chess requires understanding how <strong>four-dimensional space</strong> works mathematically.</p>
            
            <h3>Coordinate System</h3>
            <p>Every position on our board is defined by four coordinates:</p>
            <ul>
                <li><strong>X-axis (0-7):</strong> Left-Right movement on each board</li>
                <li><strong>Y-axis (0-7):</strong> Vertical layers - different "heights" of boards</li>
                <li><strong>Z-axis (0-7):</strong> Forward-Backward on each board (like ranks in 2D chess)</li>
                <li><strong>W-axis (0-7):</strong> The 4th dimension - parallel "universes" or board sets</li>
            </ul>
            
            <p>A piece's position is written as <code>(x, y, z, w)</code>, for example:</p>
            <ul>
                <li><code>(3, 0, 4, 2)</code> means: X=3, Y=0, Z=4, W=2</li>
                <li>This represents a square on board layer 0, in universe 2, at coordinates (3,4)</li>
            </ul>
            
            <h3>The Hypercube</h3>
            <p>Our game board is a <strong>tesseract</strong> (4D hypercube). Just as a cube has:</p>
            <ul>
                <li>1D: A line (2 points)</li>
                <li>2D: A square (4 points)</li>
                <li>3D: A cube (8 points)</li>
                <li>4D: A tesseract (16 points)</li>
            </ul>
            
            <p>Our 8×8×8×8 hypercube contains <strong>4,096 vertices</strong>, each representing a potential square where a piece can be placed.</p>
            
            <h3>Distance in 4D</h3>
            <p>The distance between two positions <code>(x₁, y₁, z₁, w₁)</code> and <code>(x₂, y₂, z₂, w₂)</code> is calculated using the 4D Euclidean distance formula:</p>
            <p style="text-align: center; font-family: 'Courier New', monospace; background: var(--bg-tertiary); padding: 10px; border-radius: 4px;">
                distance = √[(x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)² + (w₂-w₁)²]
            </p>
            <p>This is crucial for understanding piece movements, especially for pieces like the Bishop that move diagonally!</p>
        `
    },
    {
        title: "Piece Movements in 4D",
        content: `
            <h2>Piece Movements in 4D</h2>
            <p>Each chess piece's movement pattern is extended from 2D chess to work in 4D space. Here's how they move:</p>
            
            <h3>Rook - Linear Movement</h3>
            <p>The Rook moves in straight lines along <strong>any single axis</strong> (X, Y, Z, or W).</p>
            <ul>
                <li><strong>8 directions:</strong> Forward/backward on each of the 4 axes</li>
                <li><strong>Example:</strong> From (3,2,3,1), can move to any square where only ONE coordinate changes: (7,2,3,1) along X, or (3,2,3,5) along W</li>
                <li><strong>Unlimited range</strong> until blocked by another piece</li>
            </ul>
            
            <h3>Bishop - Diagonal Movement</h3>
            <p>The Bishop moves diagonally in <strong>any 2D plane</strong> formed by two axes. With 4 axes, there are <strong>6 possible planes</strong>:</p>
            <ul>
                <li>XY, XZ, XW, YZ, YW, ZW</li>
                <li><strong>24 total directions:</strong> 4 diagonal directions per plane</li>
                <li><strong>Example:</strong> From (3,3,2,1) in the XY plane, can move to (5,5,2,1), (1,1,2,1), etc.</li>
            </ul>
            
            <h3>Knight - L-Shape Movement</h3>
            <p>The Knight moves in an L-shape: <strong>2 steps on one axis, 1 step on another</strong>.</p>
            <ul>
                <li><strong>48 possible moves:</strong> 6 axis pairs × 2 ways × 4 direction combinations</li>
                <li>Only piece that can "jump over" other pieces</li>
                <li><strong>Example:</strong> From (3,3,2,1), can move to (5,4,2,1) [2X+1Y] or (3,3,2,3) [2W+1Z]</li>
            </ul>
            
            <h3>Queen - Combined Power</h3>
            <p>The Queen combines Rook + Bishop movements - the most powerful piece!</p>
            <ul>
                <li><strong>32 total directions:</strong> 8 linear (like Rook) + 24 diagonal (like Bishop)</li>
                <li>Unlimited range in all directions</li>
            </ul>
            
            <h3>King - One Step Anywhere</h3>
            <p>The King can move exactly <strong>1 step in any direction</strong>.</p>
            <ul>
                <li><strong>80 possible adjacent positions:</strong> 3⁴ - 1 = 80 (all combinations of ±1 on each axis, excluding the origin)</li>
                <li>Includes: linear (8), 2D diagonal (24), 3D diagonal (32), and 4D diagonal (16)</li>
                <li><strong>Critical:</strong> Cannot move into check. Losing any king ends the game!</li>
            </ul>
            
            <h3>Pawn - Forward Movement</h3>
            <p>Pawns move forward on the Z and Y axes, with special capture rules.</p>
            <ul>
                <li>1 square forward, or 2 squares on first move (on both Z and Y)</li>
                <li>Diagonal captures in XZ, XY, and YZ planes</li>
                <li>Promotes to Queen when reaching the end</li>
            </ul>
        `
    },
    {
        title: "Understanding the User Interface",
        content: `
            <h2>Understanding the User Interface</h2>
            <p>Our interface is designed to help you navigate the complex 4D space. Let's break down what you see:</p>
            
            <h3>Header Bar</h3>
            <ul>
                <li><strong>Game Mode Selector:</strong> Choose Two Players, vs Bot, or Watch Bots play</li>
                <li><strong>Turn Indicator:</strong> Shows whose turn it is (White/Black) with a king icon</li>
                <li><strong>Check Indicator:</strong> Appears when a player is in check</li>
                <li><strong>Tutorial & Feedback Buttons:</strong> Access help and share your thoughts</li>
            </ul>
            
            <h3>Left Panel - Control Panel</h3>
            <ul>
                <li><strong>Game Status:</strong> Current turn number, active player, check status</li>
                <li><strong>Selected Piece Info:</strong> When you click a piece, see its position (X,Y,Z,W) and all possible moves</li>
                <li><strong>Actions:</strong> New Game, Undo, Redo buttons</li>
                <li><strong>Statistics:</strong> Piece counts for both teams, game timer</li>
                <li><strong>Move History:</strong> Complete log of all moves made</li>
                <li><strong>Camera Controls:</strong> Reset view, top view, side view</li>
                <li><strong>Mouse/Keyboard Help:</strong> Quick reference for controls</li>
            </ul>
            
            <h3>Center View - The 3D Visualization</h3>
            <p>This is where the magic happens! You see a <strong>3D projection of the 4D space</strong>:</p>
            <ul>
                <li>Multiple chess boards arranged in 3D space</li>
                <li>Each board represents a different "slice" of the 4D hypercube</li>
                <li>You can rotate, zoom, and pan to explore different angles</li>
                <li>Click pieces to select them and see their possible moves highlighted</li>
            </ul>
            
            <h3>Right Panel - Navigation Panel</h3>
            <ul>
                <li><strong>4D Navigation Gizmo:</strong> Visual indicator showing the current orientation of X, Y, Z, W axes</li>
                <li><strong>Board Opacity Slider:</strong> Adjust transparency to see through boards</li>
                <li><strong>Piece Tutorial:</strong> Interactive guide to each piece type with 3D models</li>
            </ul>
            
            <h3>Interactions</h3>
            <ul>
                <li><strong>Click a piece:</strong> Select it and see all legal moves (highlighted in green)</li>
                <li><strong>Click a highlighted square:</strong> Execute the move</li>
                <li><strong>Click empty space:</strong> Deselect current piece</li>
                <li><strong>Mouse controls:</strong> Left-click drag to rotate, Right-click drag to pan, Scroll to zoom</li>
                <li><strong>Keyboard shortcuts:</strong> R to reset camera, ESC to deselect, etc.</li>
            </ul>
        `
    },
    {
        title: "Why Multiple Chess Boards?",
        content: `
            <h2>Why Multiple Chess Boards?</h2>
            <p>You might be wondering: <strong>"Why do I see so many chess boards?"</strong> The answer lies in how we visualize 4D space.</p>
            
            <h3>The Challenge of 4D Visualization</h3>
            <p>We humans live in and perceive 3D space. A true 4D object cannot be directly visualized—it must be <strong>projected</strong> or <strong>sliced</strong> into lower dimensions.</p>
            <p>Just as a 3D cube can be represented as multiple 2D slices (like MRI scans), we represent the 4D hypercube as multiple 3D "slices".</p>
            
            <h3>The Slicing Method</h3>
            <p>To visualize our 4D board, we use a technique called <strong>"slicing"</strong>:</p>
            <ul>
                <li>We fix one coordinate (usually W or Y) to a specific value</li>
                <li>This creates a 3D "slice" that we can display</li>
                <li>Each slice contains multiple 2D boards arranged in 3D space</li>
            </ul>
            
            <h3>How Boards Are Arranged</h3>
            <p>The boards you see represent different parts of the 4D hypercube:</p>
            <ul>
                <li><strong>W-axis (4th dimension):</strong> Different "universes" or board sets</li>
                <li><strong>Y-axis (height):</strong> Different vertical layers within each universe</li>
                <li><strong>X and Z:</strong> The traditional chess board coordinates on each board</li>
            </ul>
            
            <p>For example, all boards at W=0 represent one "universe", while W=7 represents another parallel universe. Pieces can move between these universes along the W-axis!</p>
            
            <h3>Why This Matters</h3>
            <ul>
                <li><strong>Territory:</strong> Each player controls multiple boards across the W and Y dimensions</li>
                <li><strong>Strategy:</strong> You can attack from one universe (W=0) while defending in another (W=7)</li>
                <li><strong>Multiple Kings:</strong> With 28 kings per player, you must protect them across different boards</li>
                <li><strong>Spatial Awareness:</strong> Understanding board relationships is key to winning</li>
            </ul>
            
            <h3>Board Relationships</h3>
            <p>Boards that are adjacent in W or Y space are "close" in 4D terms. A piece can move from one board to an adjacent board by moving along the W or Y axis. This creates a complex network of connections that makes 4D chess incredibly strategic!</p>
        `
    },
    {
        title: "How Pieces Are Displayed",
        content: `
            <h2>How Pieces Are Displayed</h2>
            <p>Understanding how pieces appear in our 3D visualization is crucial for playing effectively.</p>
            
            <h3>Position Mapping</h3>
            <p>Each piece has a 4D position <code>(x, y, z, w)</code>, which gets mapped to a 3D world position using the formula:</p>
            <ul>
                <li><strong>X coordinate:</strong> Maps directly to world X (horizontal on each board)</li>
                <li><strong>Y coordinate:</strong> Maps to world Y (vertical stacking of boards)</li>
                <li><strong>Z coordinate:</strong> Maps to world Z (depth on each board)</li>
                <li><strong>W coordinate:</strong> Maps to world Z offset (separating different board universes)</li>
            </ul>
            
            <h3>Visual Layering</h3>
            <p>Pieces appear on boards based on their Y and W coordinates:</p>
            <ul>
                <li><strong>Y determines vertical layer:</strong> Y=0 is the bottom, Y=7 is the top</li>
                <li><strong>W determines universe:</strong> Different W values create separate board sets in depth</li>
                <li>Pieces at the same (Y, W) appear on the same visible board</li>
            </ul>
            
            <h3>Why Some Pieces Look "Stacked"</h3>
            <p>When multiple pieces appear at the same X, Z coordinates on different Y or W levels, they may look stacked. This is because:</p>
            <ul>
                <li>They're at different Y levels (different vertical layers)</li>
                <li>Or they're at different W levels (different universes)</li>
                <li>They're actually in different positions in 4D space!</li>
            </ul>
            
            <h3>Piece Selection</h3>
            <p>When you click on a piece:</p>
            <ul>
                <li>The piece is highlighted in blue</li>
                <li>All legal moves are shown as green/red indicators</li>
                <li>The piece's 4D coordinates are displayed in the left panel</li>
                <li>You can see exactly which board (Y, W) the piece is on</li>
            </ul>
            
            <h3>Understanding Movement Visualization</h3>
            <p>When you select a piece, move indicators show where it can go:</p>
            <ul>
                <li><strong>Green indicators:</strong> Regular moves</li>
                <li><strong>Red indicators:</strong> Capture moves (enemy pieces)</li>
                <li>Moves that go to different Y or W levels may appear to "jump" between boards</li>
                <li>This is normal! In 4D space, pieces can move across dimensions</li>
            </ul>
            
            <h3>Multiple Pieces of Same Type</h3>
            <p>With 448 pieces per player, you'll see many pieces of the same type. To distinguish them:</p>
            <ul>
                <li>Check the 4D coordinates in the left panel when selected</li>
                <li>Look at which board (Y, W) they're on</li>
                <li>Their context (surrounding pieces) helps identify them</li>
            </ul>
        `
    },
    {
        title: "4D to 2D/3D Projection",
        content: `
            <h2>4D to 2D/3D Projection Explained</h2>
            <p>The most fascinating aspect of this game is how we display a 4D space on your 2D screen through a 3D rendering. Let's dive into the projection mathematics!</p>
            
            <h3>The Projection Pipeline</h3>
            <p>To display 4D chess, we use a multi-stage projection:</p>
            <ol>
                <li><strong>4D → 3D Slicing:</strong> Fix one dimension to create a 3D slice</li>
                <li><strong>3D → 2D Rendering:</strong> Use Three.js perspective projection to create a 2D image</li>
                <li><strong>2D Display:</strong> Your monitor shows the final image</li>
            </ol>
            
            <h3>World Position Calculation</h3>
            <p>For a piece at 4D position <code>(x, y, z, w)</code>, we calculate its 3D world position using:</p>
            <p style="text-align: center; font-family: 'Courier New', monospace; background: var(--bg-tertiary); padding: 10px; border-radius: 4px; margin: 15px 0;">
                worldX = x × squareSize<br>
                worldY = y × verticalSpacing<br>
                worldZ = -(z × squareSize + w × horizontalOffset)
            </p>
            
            <p>Where:</p>
            <ul>
                <li><strong>squareSize:</strong> Size of each chess square (e.g., 50 units)</li>
                <li><strong>verticalSpacing:</strong> Distance between Y layers (e.g., 175 units)</li>
                <li><strong>horizontalOffset:</strong> Distance between W universes (e.g., 450 units)</li>
            </ul>
            
            <h3>Why This Mapping?</h3>
            <p>This specific mapping creates an intuitive visualization:</p>
            <ul>
                <li><strong>X and Z form each board:</strong> Traditional 2D chess layout</li>
                <li><strong>Y stacks boards vertically:</strong> Higher Y = higher in 3D space</li>
                <li><strong>W separates universes:</strong> Different W values are offset in depth (Z)</li>
            </ul>
            
            <h3>The Slicing Strategy</h3>
            <p>Since we can't show all 4,096 positions at once, we use intelligent slicing:</p>
            <ul>
                <li>We can fix W or Y to show specific "slices" of the hypercube</li>
                <li>Multiple slices can be displayed simultaneously as different board sets</li>
                <li>The opacity slider lets you see through boards to understand spatial relationships</li>
            </ul>
            
            <h3>Perspective Projection</h3>
            <p>Finally, Three.js uses a perspective camera to project the 3D scene to your 2D screen:</p>
            <ul>
                <li><strong>Field of View:</strong> 60° - determines how much you see</li>
                <li><strong>Near/Far Planes:</strong> Clipping boundaries for what's visible</li>
                <li><strong>Camera Position:</strong> Where you're "looking from" in 3D space</li>
                <li><strong>Target:</strong> What you're looking at (usually the board center)</li>
            </ul>
            
            <h3>Why It Works</h3>
            <p>This projection system works because:</p>
            <ul>
                <li>Each 4D coordinate maps uniquely to a 3D position</li>
                <li>Distances in 4D are preserved proportionally in 3D</li>
                <li>Adjacent 4D positions appear close in 3D space</li>
                <li>You can navigate with mouse controls to explore different views</li>
            </ul>
            
            <h3>Understanding the View</h3>
            <p>When you rotate the view:</p>
            <ul>
                <li>You're rotating the 3D camera around the scene</li>
                <li>This reveals different aspects of the 4D projection</li>
                <li>The axes gizmo in the right panel shows your current viewing orientation</li>
                <li>This helps you understand which direction corresponds to which 4D axis</li>
            </ul>
            
            <p><strong>Remember:</strong> You're always seeing a projection! The "real" game exists in 4D space, which we can only visualize through these mathematical transformations.</p>
        `
    },
    {
        title: "Tips & Strategy",
        content: `
            <h2>Tips & Strategy for 4D Chess</h2>
            <p>Now that you understand the mechanics, here are some strategic tips to help you master 4D chess!</p>
            
            <h3>Multi-Dimensional Thinking</h3>
            <ul>
                <li><strong>Think in 4D:</strong> Don't just plan on one board—consider movements across W and Y axes</li>
                <li><strong>Layer Defense:</strong> Use different Y and W layers to protect your pieces</li>
                <li><strong>Parallel Attacks:</strong> Attack in one universe (W) while defending in another</li>
            </ul>
            
            <h3>King Safety</h3>
            <ul>
                <li><strong>Multiple Kings:</strong> With 28 kings per player, losing ANY king loses the game</li>
                <li><strong>Spread Them Out:</strong> Don't keep all kings in one area—distribute them across different (Y, W) coordinates</li>
                <li><strong>Escape Routes:</strong> Always ensure kings have escape paths in all 4 dimensions</li>
            </ul>
            
            <h3>Piece Coordination</h3>
            <ul>
                <li><strong>Queens are Powerful:</strong> With 32 movement directions, queens can control massive areas</li>
                <li><strong>Rooks Control Lines:</strong> Perfect for controlling entire axes across multiple boards</li>
                <li><strong>Bishops Control Diagonals:</strong> Can attack across planes, great for multi-dimensional attacks</li>
                <li><strong>Knights Can Jump:</strong> Use them to access hard-to-reach positions</li>
            </ul>
            
            <h3>Board Awareness</h3>
            <ul>
                <li><strong>Check All Layers:</strong> Threats can come from any Y level or W universe</li>
                <li><strong>Use the Gizmo:</strong> The axes indicator helps you understand spatial relationships</li>
                <li><strong>Opacity Control:</strong> Lower opacity to see through boards and plan multi-dimensional attacks</li>
            </ul>
            
            <h3>Opening Strategy</h3>
            <ul>
                <li><strong>Control the Center:</strong> In 4D, "center" means multiple dimensions—control key (Y, W) coordinates</li>
                <li><strong>Develop Pieces:</strong> Get your pieces active across multiple boards early</li>
                <li><strong>Connect Rooks:</strong> In 4D, rooks can connect across W and Y axes!</li>
            </ul>
            
            <h3>Time Management</h3>
            <ul>
                <li><strong>Don't Rush:</strong> With 4,096 positions, take time to consider all options</li>
                <li><strong>Use Selection:</strong> Click pieces to see all legal moves—it helps prevent mistakes</li>
                <li><strong>Check the Move List:</strong> Review move history to understand opponent's strategy</li>
            </ul>
            
            <h3>Advanced Tactics</h3>
            <ul>
                <li><strong>Forking:</strong> Attack multiple pieces across different dimensions simultaneously</li>
                <li><strong>Pinning:</strong> Use pieces to pin enemy pieces along 4D lines</li>
                <li><strong>Discovered Attacks:</strong> Moving one piece can reveal attacks from another across dimensions</li>
                <li><strong>W Dimension Tactics:</strong> Use the W-axis to create parallel threats</li>
            </ul>
            
            <h3>Common Mistakes to Avoid</h3>
            <ul>
                <li>Focusing only on one board—remember the 4D nature!</li>
                <li>Ignoring pieces on different Y or W levels</li>
                <li>Not protecting all 28 kings</li>
                <li>Moving into check without realizing (especially check from different dimensions)</li>
                <li>Forgetting that some pieces can move between universes (W-axis)</li>
            </ul>
            
            <p><strong>Have fun exploring 4D chess!</strong> This is a unique game that combines mathematical beauty with strategic depth. The more you play, the better your spatial intuition will become.</p>
        `
    }
];

// Comprehensive Tutorial state
let comprehensiveTutorialState = {
    currentPage: 0,
    totalPages: comprehensiveTutorialPages.length
};

/* ============================================
   TUTORIAL INITIALIZATION
   ============================================ */

function initComprehensiveTutorial() {
    const tutorialBtn = document.getElementById('tutorial-btn');
    const feedbackBtn = document.getElementById('feedback-btn');
    const tutorialModal = document.getElementById('tutorial-modal');
    const tutorialClose = document.getElementById('tutorial-close');
    const tutorialNavLeft = document.getElementById('tutorial-nav-left');
    const tutorialNavRight = document.getElementById('tutorial-nav-right');
    const feedbackModal = document.getElementById('feedback-modal');
    const feedbackCancel = document.getElementById('feedback-cancel');
    const feedbackSubmit = document.getElementById('feedback-submit');
    
    if (!tutorialBtn || !tutorialModal) {
        console.warn('Tutorial elements not found');
        return;
    }
    
    // Open tutorial
    tutorialBtn.addEventListener('click', () => {
        comprehensiveTutorialState.currentPage = 0;
        updateTutorialDisplay();
        tutorialModal.style.display = 'flex';
    });
    
    // Close tutorial
    tutorialClose.addEventListener('click', () => {
        tutorialModal.style.display = 'none';
    });
    
    // Close on background click
    tutorialModal.addEventListener('click', (e) => {
        if (e.target === tutorialModal) {
            tutorialModal.style.display = 'none';
        }
    });
    
    // Navigation
    tutorialNavLeft.addEventListener('click', () => {
        if (comprehensiveTutorialState.currentPage > 0) {
            comprehensiveTutorialState.currentPage--;
            updateTutorialDisplay();
        }
    });
    
    tutorialNavRight.addEventListener('click', () => {
        if (comprehensiveTutorialState.currentPage < comprehensiveTutorialState.totalPages - 1) {
            comprehensiveTutorialState.currentPage++;
            updateTutorialDisplay();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (tutorialModal.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                tutorialNavLeft.click();
            } else if (e.key === 'ArrowRight') {
                tutorialNavRight.click();
            } else if (e.key === 'Escape') {
                tutorialModal.style.display = 'none';
            }
        }
    });
    
    // Feedback modal
    if (feedbackBtn) {
        feedbackBtn.addEventListener('click', () => {
            feedbackModal.style.display = 'flex';
        });
    }
    
    if (feedbackCancel) {
        feedbackCancel.addEventListener('click', () => {
            feedbackModal.style.display = 'none';
            document.getElementById('feedback-text').value = '';
        });
    }
    
    if (feedbackSubmit) {
        feedbackSubmit.addEventListener('click', () => {
            const feedbackText = document.getElementById('feedback-text').value;
            if (feedbackText.trim()) {
                // In a real app, you would send this to a server
                console.log('Feedback submitted:', feedbackText);
                alert('Thank you for your feedback! We appreciate your input.');
                feedbackModal.style.display = 'none';
                document.getElementById('feedback-text').value = '';
            } else {
                alert('Please enter some feedback before submitting.');
            }
        });
    }
    
    // Close feedback modal on background click
    if (feedbackModal) {
        feedbackModal.addEventListener('click', (e) => {
            if (e.target === feedbackModal) {
                feedbackModal.style.display = 'none';
                document.getElementById('feedback-text').value = '';
            }
        });
    }
    
    // Initial display
    updateTutorialDisplay();
    
    console.log('✅ Comprehensive tutorial system initialized');
}

function updateTutorialDisplay() {
    const tutorialContent = document.getElementById('tutorial-content');
    const currentPageEl = document.getElementById('tutorial-current-page');
    const totalPagesEl = document.getElementById('tutorial-total-pages');
    const navLeft = document.getElementById('tutorial-nav-left');
    const navRight = document.getElementById('tutorial-nav-right');
    
    if (!tutorialContent) return;
    
    // Update page numbers
    if (currentPageEl) {
        currentPageEl.textContent = comprehensiveTutorialState.currentPage + 1;
    }
    if (totalPagesEl) {
        totalPagesEl.textContent = comprehensiveTutorialState.totalPages;
    }
    
    // Update navigation buttons
    if (navLeft) {
        navLeft.disabled = comprehensiveTutorialState.currentPage === 0;
    }
    if (navRight) {
        navRight.disabled = comprehensiveTutorialState.currentPage === comprehensiveTutorialState.totalPages - 1;
    }
    
    // Clear and populate content
    tutorialContent.innerHTML = '';
    
    const page = comprehensiveTutorialPages[comprehensiveTutorialState.currentPage];
    if (page) {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'tutorial-page active';
        pageDiv.innerHTML = page.content;
        tutorialContent.appendChild(pageDiv);
    }
}

// Initialize when DOM is ready
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initComprehensiveTutorial);
    } else {
        initComprehensiveTutorial();
    }
}

