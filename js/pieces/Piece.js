/* ============================================
   BASE PIECE CLASS FOR 4D CHESS
   ============================================ */

class Piece {
    constructor(team = null) {
        this.type = null;      // 'pawn', 'rook', 'bishop', 'knight', 'queen', 'king'
        this.team = team;      // 0 (white) or 1 (black)
        this.mesh = null;      // Three.js mesh
        this.hasMoved = false;
        this.position = {x: 0, y: 0, z: 0, w: 0};
        this.descendant = null; // For pawn promotion
    }
    
    /**
     * Get all possible moves for this piece from a given position
     * Override in subclasses
     */
    getPossibleMoves(board, x, y, z, w) {
        return [];
    }
    
    /**
     * Check if a specific move is valid
     */
    isValidMove(board, x0, y0, z0, w0, x1, y1, z1, w1) {
        const moves = this.getPossibleMoves(board, x0, y0, z0, w0);
        return moves.some(m => 
            m.x === x1 && m.y === y1 && m.z === z1 && m.w === w1
        );
    }
    
    /**
     * Set the Three.js mesh for this piece
     */
    setMesh(mesh) {
        this.mesh = mesh;
    }
    
    /**
     * Update piece state after a move
     */
    update(board, x0, y0, z0, w0, x1, y1, z1, w1) {
        this.hasMoved = true;
        this.position = {x: x1, y: y1, z: z1, w: w1};
        return {justMoved: true};
    }
    
    /**
     * Serialize piece for save/load
     */
    package() {
        return {
            type: this.type,
            team: this.team,
            hasMoved: this.hasMoved,
            position: this.position
        };
    }
    
    /**
     * Check if a position is within board bounds
     */
    static inBounds(x, y, z, w, n = 8) {
        return x >= 0 && x < n && y >= 0 && y < n && z >= 0 && z < n && w >= 0 && w < n;
    }
    
    /**
     * Check if a square is empty
     */
    static isEmpty(board, x, y, z, w) {
        return !board[x][y][z][w].type;
    }
    
    /**
     * Check if a square is occupied by an enemy piece
     */
    static isEnemy(board, x, y, z, w, team) {
        const piece = board[x][y][z][w];
        return piece.type && piece.team !== team;
    }
    
    /**
     * Check if a square is occupied by a friendly piece
     */
    static isFriendly(board, x, y, z, w, team) {
        const piece = board[x][y][z][w];
        return piece.type && piece.team === team;
    }
    
    /**
     * Add a move to the list if valid
     */
    addMoveIfValid(moves, board, x, y, z, w, team, possibleCapture = false) {
        if (Piece.inBounds(x, y, z, w)) {
            if (Piece.isEmpty(board, x, y, z, w)) {
                moves.push({x, y, z, w, possibleCapture: false});
                return true; // Can continue in this direction
            } else if (Piece.isEnemy(board, x, y, z, w, team)) {
                moves.push({x, y, z, w, possibleCapture: true});
                return false; // Blocked by enemy (but can capture)
            } else {
                return false; // Blocked by friendly piece
            }
        }
        return false; // Out of bounds
    }
    
    /**
     * Check if this team is in check
     * (Override this in a more sophisticated way for full game logic)
     */
    static inCheck(board, team) {
        // Find all kings for this team
        const kings = [];
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                for (let z = 0; z < 8; z++) {
                    for (let w = 0; w < 8; w++) {
                        const piece = board[x][y][z][w];
                        if (piece.type === 'king' && piece.team === team) {
                            kings.push({x, y, z, w});
                        }
                    }
                }
            }
        }
        
        // Check if any king is under attack
        const attackers = [];
        for (const king of kings) {
            // Check all enemy pieces to see if they can attack this king
            for (let x = 0; x < 8; x++) {
                for (let y = 0; y < 8; y++) {
                    for (let z = 0; z < 8; z++) {
                        for (let w = 0; w < 8; w++) {
                            const piece = board[x][y][z][w];
                            if (piece.type && piece.team !== team) {
                                const moves = piece.getPossibleMoves(board, x, y, z, w);
                                if (moves.some(m => m.x === king.x && m.y === king.y && m.z === king.z && m.w === king.w)) {
                                    attackers.push({piece, from: {x, y, z, w}, target: king});
                                }
                            }
                        }
                    }
                }
            }
        }
        
        return attackers;
    }
    
    /**
     * Check if this team is in checkmate
     */
    static inCheckmate(board, team) {
        if (Piece.inCheck(board, team).length === 0) {
            return false; // Not in check, so not checkmate
        }
        
        // Check if any move can get out of check
        // (Simplified - in real implementation, would need to validate moves)
        return false; // TODO: Implement full checkmate detection
    }
    
    /**
     * Check if this team is in stalemate
     */
    static inStalemate(board, team) {
        // TODO: Implement stalemate detection
        return false;
    }
    
    /**
     * Map piece type strings to constructors
     * Using getter to avoid circular dependency
     */
    static get typeToConstructor() {
        return {
            'pawn': window.Pawn,
            'rook': window.Rook,
            'bishop': window.Bishop,
            'knight': window.Knight,
            'queen': window.Queen,
            'king': window.King
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Piece;
}

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.Piece = Piece;
    console.log('✅ Piece class defined globally');
}

