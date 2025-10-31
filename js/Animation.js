/* ============================================
   ANIMATION SYSTEM
   ============================================
   Handles piece movement animations and interpolation
*/

// Global animation queue
let animationQueue = [];

/**
 * Animation class for piece movement
 * @param {THREE.Mesh} mesh - The mesh to animate
 * @param {THREE.Vector3} coords - Target coordinates
 */
function Animation(mesh, coords) {
    this.mesh = mesh;
    this.coords = coords;
    this.onAnimate = function() {};
    this.execute = function() {
        if (this.mesh && this.mesh.position) {
            this.mesh.position.set(this.coords.x, this.coords.y, this.coords.z);
        }
    };
}

/**
 * Linear interpolation between two Vector3 positions
 * @param {THREE.Vector3} a - Start position
 * @param {THREE.Vector3} b - End position
 * @param {number} segments - Number of interpolation segments (default: 8)
 * @param {Array<boolean>} inclusivity - [includeStart, includeEnd] (default: [false, true])
 * @returns {Array<THREE.Vector3>} Array of interpolated positions
 */
Animation.linearInterpolate = function(a, b, segments = 8, inclusivity = [false, true]) {
    let positions = [];
    let scalar = 1 / segments;
    let interval = b.clone().sub(a);
    
    if (inclusivity[0]) {
        positions.push(a.clone());
    }
    
    for (let i = 1; i < segments + +inclusivity[1]; i++) {
        positions.push(a.clone().add(interval.clone().multiplyScalar(scalar * i)));
    }
    
    return positions;
};

/**
 * Add animation sequence to queue
 * @param {Array} queue - Animation queue array
 * @param {THREE.Mesh} mesh - Mesh to animate
 * @param {Array<THREE.Vector3>} positions - Array of target positions
 */
Animation.addToQueue = function(queue, mesh, positions) {
    positions.forEach(pos => {
        queue.push(new Animation(mesh, pos));
    });
};

/**
 * Process animation queue (call this in animate loop)
 * Processes one animation frame per call
 */
Animation.processQueue = function() {
    if (animationQueue.length > 0) {
        animationQueue[0].onAnimate();
        animationQueue[0].execute();
        animationQueue.shift();
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.Animation = Animation;
    window.animationQueue = animationQueue;
    console.log('✅ Animation system loaded');
}

