/* ============================================
   KING - 4D CHESS PIECE
   ============================================ */

class King extends Piece {
    constructor(team) {
        super(team);
        this.type = 'king';
    }
    
    /**
     * Get possible moves for king in 4D
     * 
     * King can move 1 step in ANY direction:
     * - Linear (like Rook, distance 1): 8 directions
     * - Diagonal in 2D planes (like Bishop, distance 1): 24 directions
     * - Diagonal in 3D spaces: 32 directions
     * - Diagonal in 4D space: 16 directions
     * 
     * Total: 80 possible adjacent positions in 4D
     * 
     * However, for simplicity, we'll enumerate all combinations of (±1, ±1, ±1, ±1)
     * where at least one coordinate changes.
     */
    getPossibleMoves(board, x, y, z, w) {
        const moves = [];
        
        // Generate all combinations of ±1, 0 for each axis
        // (excluding 0,0,0,0 since king must move)
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dz = -1; dz <= 1; dz++) {
                    for (let dw = -1; dw <= 1; dw++) {
                        // Skip if not moving at all
                        if (dx === 0 && dy === 0 && dz === 0 && dw === 0) {
                            continue;
                        }
                        
                        const newX = x + dx;
                        const newY = y + dy;
                        const newZ = z + dz;
                        const newW = w + dw;
                        
                        if (Piece.inBounds(newX, newY, newZ, newW)) {
                            if (Piece.isEmpty(board, newX, newY, newZ, newW)) {
                                moves.push({x: newX, y: newY, z: newZ, w: newW, possibleCapture: false});
                            } else if (Piece.isEnemy(board, newX, newY, newZ, newW, this.team)) {
                                moves.push({x: newX, y: newY, z: newZ, w: newW, possibleCapture: true});
                            }
                        }
                    }
                }
            }
        }
        
        return moves;
    }
    
    /**
     * Override update to track if king has moved (for castling)
     */
    update(board, x0, y0, z0, w0, x1, y1, z1, w1) {
        const result = super.update(board, x0, y0, z0, w0, x1, y1, z1, w1);
        
        // Track that king has moved (important for castling)
        this.hasMoved = true;
        
        return result;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = King;
}

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.King = King;
    console.log('✅ King class defined globally');
}

