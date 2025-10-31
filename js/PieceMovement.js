/* ============================================
   PIECE MOVEMENT HANDLER
   ============================================
   Handles piece movement execution, validation, and UI updates
*/

const PieceMovement = {
    
    /**
     * Execute a move from source to destination
     * @param {GameBoard} gameBoard - The game board instance
     * @param {number} x0, y0, z0, w0 - Source coordinates
     * @param {number} x1, y1, z1, w1 - Destination coordinates
     * @param {function} onMoveComplete - Callback after move completes
     * @param {number} currentTeam - Optional: current player's team (0=white, 1=black)
     * @returns {boolean} - True if move was successful
     */
    executeMove: function(gameBoard, x0, y0, z0, w0, x1, y1, z1, w1, onMoveComplete, currentTeam = null) {
        if (!gameBoard) {
            console.error('❌ PieceMovement: No gameBoard provided');
            return false;
        }
        
        // Validate move is within bounds
        if (!this.isValidCoordinates(x0, y0, z0, w0, gameBoard.n) || 
            !this.isValidCoordinates(x1, y1, z1, w1, gameBoard.n)) {
            console.error('❌ PieceMovement: Invalid coordinates');
            return false;
        }
        
        // Get source piece
        const sourcePiece = gameBoard.pieces[x0][y0][z0][w0];
        if (!sourcePiece || !sourcePiece.type) {
            console.error('❌ PieceMovement: No piece at source position');
            return false;
        }
        
        // Validate turn (if currentTeam is provided)
        if (currentTeam !== null && sourcePiece.team !== currentTeam) {
            console.error(`❌ PieceMovement: Not your turn (piece is team ${sourcePiece.team}, current team is ${currentTeam})`);
            return false;
        }
        
        // Validate move is in possible moves
        const possibleMoves = sourcePiece.getPossibleMoves(gameBoard.pieces, x0, y0, z0, w0);
        const isValidMove = possibleMoves.some(move => 
            move.x === x1 && move.y === y1 && move.z === z1 && move.w === w1
        );
        
        if (!isValidMove) {
            console.error('❌ PieceMovement: Move not in possible moves list');
            return false;
        }
        
        // Check if target square has a piece (capture)
        const targetPiece = gameBoard.pieces[x1][y1][z1][w1];
        const isCapture = targetPiece && targetPiece.type;
        
        if (isCapture && targetPiece.team === sourcePiece.team) {
            console.error('❌ PieceMovement: Cannot capture own piece');
            return false;
        }
        
        // Execute the move using GameBoard.move()
        // This will handle: board state update, mesh animation, captures, etc.
        try {
            const metadata = gameBoard.move(x0, y0, z0, w0, x1, y1, z1, w1);
            
            // Call completion callback
            if (onMoveComplete) {
                onMoveComplete(metadata);
            }
            
            console.log(`✅ Move executed: (${x0},${y0},${z0},${w0}) → (${x1},${y1},${z1},${w1})${isCapture ? ' [CAPTURE]' : ''}`);
            
            return true;
        } catch (error) {
            console.error('❌ PieceMovement: Error executing move:', error);
            return false;
        }
    },
    
    /**
     * Validate coordinates are within board bounds
     */
    isValidCoordinates: function(x, y, z, w, n) {
        return x >= 0 && x < n && 
               y >= 0 && y < n && 
               z >= 0 && z < n && 
               w >= 0 && w < n;
    },
    
    /**
     * Check if a move is legal for a piece
     */
    isLegalMove: function(gameBoard, piece, x0, y0, z0, w0, x1, y1, z1, w1) {
        if (!piece || !piece.type) {
            return false;
        }
        
        const possibleMoves = piece.getPossibleMoves(gameBoard.pieces, x0, y0, z0, w0);
        return possibleMoves.some(move => 
            move.x === x1 && move.y === y1 && move.z === z1 && move.w === w1
        );
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.PieceMovement = PieceMovement;
    console.log('✅ PieceMovement component loaded');
}

