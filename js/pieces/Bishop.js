/* ============================================
   BISHOP - 4D CHESS PIECE
   ============================================ */

class Bishop extends Piece {
    constructor(team) {
        super(team);
        this.type = 'bishop';
    }
    
    /**
     * Get possible moves for bishop in 4D
     * 
     * Bishop moves diagonally in any 2D plane formed by 2 axes:
     * - XY plane (4 directions)
     * - XZ plane (4 directions)
     * - XW plane (4 directions)
     * - YZ plane (4 directions)
     * - YW plane (4 directions)
     * - ZW plane (4 directions)
     * 
     * Total: 24 diagonal directions
     */
    getPossibleMoves(board, x, y, z, w) {
        const moves = [];
        
        // Define all 24 diagonal directions in 4D
        const directions = [
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
    module.exports = Bishop;
}

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.Bishop = Bishop;
    console.log('✅ Bishop class defined globally');
}

