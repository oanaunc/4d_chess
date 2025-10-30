/* ============================================
   ROOK - 4D CHESS PIECE
   ============================================ */

class Rook extends Piece {
    constructor(team) {
        super(team);
        this.type = 'rook';
    }
    
    /**
     * Get possible moves for rook in 4D
     * 
     * Rook can move linearly on any of the 4 axes:
     * - X-axis (horizontal)
     * - Y-axis (vertical layers)
     * - Z-axis (depth)
     * - W-axis (4D dimension)
     * 
     * Total: 8 directions (4 axes × 2 directions each)
     */
    getPossibleMoves(board, x, y, z, w) {
        const moves = [];
        
        // Define all 8 linear directions in 4D
        const directions = [
            {dx: 1, dy: 0, dz: 0, dw: 0},   // +X
            {dx: -1, dy: 0, dz: 0, dw: 0},  // -X
            {dx: 0, dy: 1, dz: 0, dw: 0},   // +Y
            {dx: 0, dy: -1, dz: 0, dw: 0},  // -Y
            {dx: 0, dy: 0, dz: 1, dw: 0},   // +Z
            {dx: 0, dy: 0, dz: -1, dw: 0},  // -Z
            {dx: 0, dy: 0, dz: 0, dw: 1},   // +W
            {dx: 0, dy: 0, dz: 0, dw: -1}   // -W
        ];
        
        // For each direction, move as far as possible
        for (const dir of directions) {
            let distance = 1;
            while (true) {
                const newX = x + (dir.dx * distance);
                const newY = y + (dir.dy * distance);
                const newZ = z + (dir.dz * distance);
                const newW = w + (dir.dw * distance);
                
                const canContinue = this.addMoveIfValid(moves, board, newX, newY, newZ, newW, this.team);
                
                if (!canContinue) break;
                distance++;
            }
        }
        
        return moves;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Rook;
}

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.Rook = Rook;
    console.log('✅ Rook class defined globally');
}

