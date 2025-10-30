/* ============================================
   QUEEN - 4D CHESS PIECE
   ============================================ */

class Queen extends Piece {
    constructor(team) {
        super(team);
        this.type = 'queen';
    }
    
    /**
     * Get possible moves for queen in 4D
     * 
     * Queen combines Rook + Bishop movements:
     * - Linear (Rook): 8 directions
     * - Diagonal (Bishop): 24 directions
     * 
     * Total: 32 directions
     */
    getPossibleMoves(board, x, y, z, w) {
        const moves = [];
        
        // Define all 32 queen directions (rook + bishop)
        const directions = [
            // Rook-like: Linear movements on single axes (8 directions)
            {dx: 1, dy: 0, dz: 0, dw: 0},
            {dx: -1, dy: 0, dz: 0, dw: 0},
            {dx: 0, dy: 1, dz: 0, dw: 0},
            {dx: 0, dy: -1, dz: 0, dw: 0},
            {dx: 0, dy: 0, dz: 1, dw: 0},
            {dx: 0, dy: 0, dz: -1, dw: 0},
            {dx: 0, dy: 0, dz: 0, dw: 1},
            {dx: 0, dy: 0, dz: 0, dw: -1},
            
            // Bishop-like: Diagonal movements in 2D planes (24 directions)
            // XY plane
            {dx: 1, dy: 1, dz: 0, dw: 0},
            {dx: 1, dy: -1, dz: 0, dw: 0},
            {dx: -1, dy: 1, dz: 0, dw: 0},
            {dx: -1, dy: -1, dz: 0, dw: 0},
            
            // XZ plane
            {dx: 1, dy: 0, dz: 1, dw: 0},
            {dx: 1, dy: 0, dz: -1, dw: 0},
            {dx: -1, dy: 0, dz: 1, dw: 0},
            {dx: -1, dy: 0, dz: -1, dw: 0},
            
            // XW plane
            {dx: 1, dy: 0, dz: 0, dw: 1},
            {dx: 1, dy: 0, dz: 0, dw: -1},
            {dx: -1, dy: 0, dz: 0, dw: 1},
            {dx: -1, dy: 0, dz: 0, dw: -1},
            
            // YZ plane
            {dx: 0, dy: 1, dz: 1, dw: 0},
            {dx: 0, dy: 1, dz: -1, dw: 0},
            {dx: 0, dy: -1, dz: 1, dw: 0},
            {dx: 0, dy: -1, dz: -1, dw: 0},
            
            // YW plane
            {dx: 0, dy: 1, dz: 0, dw: 1},
            {dx: 0, dy: 1, dz: 0, dw: -1},
            {dx: 0, dy: -1, dz: 0, dw: 1},
            {dx: 0, dy: -1, dz: 0, dw: -1},
            
            // ZW plane
            {dx: 0, dy: 0, dz: 1, dw: 1},
            {dx: 0, dy: 0, dz: 1, dw: -1},
            {dx: 0, dy: 0, dz: -1, dw: 1},
            {dx: 0, dy: 0, dz: -1, dw: -1}
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
    module.exports = Queen;
}

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.Queen = Queen;
    console.log('✅ Queen class defined globally');
}

