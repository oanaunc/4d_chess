/* ============================================
   KNIGHT - 4D CHESS PIECE
   ============================================ */

class Knight extends Piece {
    constructor(team) {
        super(team);
        this.type = 'knight';
    }
    
    /**
     * Get possible moves for knight in 4D
     * 
     * Knight moves in an "L" shape: 2 steps on one axis, 1 step on another
     * 
     * In 4D, we have 4 axes, so:
     * - Pick 2 axes (6 combinations: XY, XZ, XW, YZ, YW, ZW)
     * - For each combination, 2 steps on one, 1 on the other (2 ways)
     * - For each, ± directions (4 combinations each)
     * 
     * Total: 48 possible knight moves in 4D
     */
    getPossibleMoves(board, x, y, z, w) {
        const moves = [];
        
        // Define all 48 knight moves in 4D
        const knightMoves = [
            // X-Y combinations (8 moves)
            {dx: 2, dy: 1, dz: 0, dw: 0},
            {dx: 2, dy: -1, dz: 0, dw: 0},
            {dx: -2, dy: 1, dz: 0, dw: 0},
            {dx: -2, dy: -1, dz: 0, dw: 0},
            {dx: 1, dy: 2, dz: 0, dw: 0},
            {dx: 1, dy: -2, dz: 0, dw: 0},
            {dx: -1, dy: 2, dz: 0, dw: 0},
            {dx: -1, dy: -2, dz: 0, dw: 0},
            
            // X-Z combinations (8 moves)
            {dx: 2, dy: 0, dz: 1, dw: 0},
            {dx: 2, dy: 0, dz: -1, dw: 0},
            {dx: -2, dy: 0, dz: 1, dw: 0},
            {dx: -2, dy: 0, dz: -1, dw: 0},
            {dx: 1, dy: 0, dz: 2, dw: 0},
            {dx: 1, dy: 0, dz: -2, dw: 0},
            {dx: -1, dy: 0, dz: 2, dw: 0},
            {dx: -1, dy: 0, dz: -2, dw: 0},
            
            // X-W combinations (8 moves)
            {dx: 2, dy: 0, dz: 0, dw: 1},
            {dx: 2, dy: 0, dz: 0, dw: -1},
            {dx: -2, dy: 0, dz: 0, dw: 1},
            {dx: -2, dy: 0, dz: 0, dw: -1},
            {dx: 1, dy: 0, dz: 0, dw: 2},
            {dx: 1, dy: 0, dz: 0, dw: -2},
            {dx: -1, dy: 0, dz: 0, dw: 2},
            {dx: -1, dy: 0, dz: 0, dw: -2},
            
            // Y-Z combinations (8 moves)
            {dx: 0, dy: 2, dz: 1, dw: 0},
            {dx: 0, dy: 2, dz: -1, dw: 0},
            {dx: 0, dy: -2, dz: 1, dw: 0},
            {dx: 0, dy: -2, dz: -1, dw: 0},
            {dx: 0, dy: 1, dz: 2, dw: 0},
            {dx: 0, dy: 1, dz: -2, dw: 0},
            {dx: 0, dy: -1, dz: 2, dw: 0},
            {dx: 0, dy: -1, dz: -2, dw: 0},
            
            // Y-W combinations (8 moves)
            {dx: 0, dy: 2, dz: 0, dw: 1},
            {dx: 0, dy: 2, dz: 0, dw: -1},
            {dx: 0, dy: -2, dz: 0, dw: 1},
            {dx: 0, dy: -2, dz: 0, dw: -1},
            {dx: 0, dy: 1, dz: 0, dw: 2},
            {dx: 0, dy: 1, dz: 0, dw: -2},
            {dx: 0, dy: -1, dz: 0, dw: 2},
            {dx: 0, dy: -1, dz: 0, dw: -2},
            
            // Z-W combinations (8 moves)
            {dx: 0, dy: 0, dz: 2, dw: 1},
            {dx: 0, dy: 0, dz: 2, dw: -1},
            {dx: 0, dy: 0, dz: -2, dw: 1},
            {dx: 0, dy: 0, dz: -2, dw: -1},
            {dx: 0, dy: 0, dz: 1, dw: 2},
            {dx: 0, dy: 0, dz: 1, dw: -2},
            {dx: 0, dy: 0, dz: -1, dw: 2},
            {dx: 0, dy: 0, dz: -1, dw: -2}
        ];
        
        // Check each knight move
        for (const move of knightMoves) {
            const newX = x + move.dx;
            const newY = y + move.dy;
            const newZ = z + move.dz;
            const newW = w + move.dw;
            
            if (Piece.inBounds(newX, newY, newZ, newW)) {
                if (Piece.isEmpty(board, newX, newY, newZ, newW)) {
                    moves.push({x: newX, y: newY, z: newZ, w: newW, possibleCapture: false});
                } else if (Piece.isEnemy(board, newX, newY, newZ, newW, this.team)) {
                    moves.push({x: newX, y: newY, z: newZ, w: newW, possibleCapture: true});
                }
            }
        }
        
        return moves;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Knight;
}

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.Knight = Knight;
    console.log('✅ Knight class defined globally');
}

