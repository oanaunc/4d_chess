/* ============================================
   PAWN - 4D CHESS PIECE
   ============================================ */

class Pawn extends Piece {
    constructor(team) {
        super(team);
        this.type = 'pawn';
    }
    
    /**
     * Get possible moves for pawn in 4D
     * 
     * Pawns can:
     * 1. Move forward on Z-axis (normal chess)
     * 2. Move forward on Y-axis (4D extension)
     * 3. Capture diagonally in XZ, XY, YZ planes
     * 4. Double move on first move
     */
    getPossibleMoves(board, x, y, z, w) {
        const moves = [];
        const direction = this.team === 0 ? 1 : -1; // White moves +Z, Black moves -Z
        
        // Forward move on Z-axis (normal)
        const newZ = z + direction;
        if (Piece.inBounds(x, y, newZ, w) && Piece.isEmpty(board, x, y, newZ, w)) {
            moves.push({x, y, z: newZ, w, possibleCapture: false});
            
            // Double move on first move
            if (!this.hasMoved) {
                const doubleZ = z + (2 * direction);
                if (Piece.inBounds(x, y, doubleZ, w) && Piece.isEmpty(board, x, y, doubleZ, w)) {
                    moves.push({x, y, z: doubleZ, w, possibleCapture: false});
                }
            }
        }
        
        // Forward move on Y-axis (4D extension)
        const newY = y + 1;
        if (Piece.inBounds(x, newY, z, w) && Piece.isEmpty(board, x, newY, z, w)) {
            moves.push({x, y: newY, z, w, possibleCapture: false});
            
            // Double move on first move
            if (!this.hasMoved && Piece.inBounds(x, y + 2, z, w) && Piece.isEmpty(board, x, y + 2, z, w)) {
                moves.push({x, y: y + 2, z, w, possibleCapture: false});
            }
        }
        
        // Diagonal captures in XZ plane
        for (const dx of [-1, 1]) {
            const captureX = x + dx;
            const captureZ = z + direction;
            if (Piece.inBounds(captureX, y, captureZ, w) && Piece.isEnemy(board, captureX, y, captureZ, w, this.team)) {
                moves.push({x: captureX, y, z: captureZ, w, possibleCapture: true});
            }
        }
        
        // Diagonal captures in XY plane
        for (const dx of [-1, 1]) {
            const captureX = x + dx;
            const captureY = y + 1;
            if (Piece.inBounds(captureX, captureY, z, w) && Piece.isEnemy(board, captureX, captureY, z, w, this.team)) {
                moves.push({x: captureX, y: captureY, z, w, possibleCapture: true});
            }
        }
        
        // Diagonal captures in YZ plane
        const captureY = y + 1;
        const captureZ = z + direction;
        if (Piece.inBounds(x, captureY, captureZ, w) && Piece.isEnemy(board, x, captureY, captureZ, w, this.team)) {
            moves.push({x, y: captureY, z: captureZ, w, possibleCapture: true});
        }
        
        return moves;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Pawn;
}

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.Pawn = Pawn;
    console.log('✅ Pawn class defined globally');
}

