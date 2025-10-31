/*

    Board Scale: 3 --> 300 x 300
    Piece Scale: 9
    Vertical Increment: 600 / (n=6) = 100
    Horizontal Increment: 450, but Space between boards: 150

*/

// Helper function to rotate objects
function rotateObject(object, x, y, z) {
    object.rotation.x = x * Math.PI / 180;
    object.rotation.y = y * Math.PI / 180;
    object.rotation.z = z * Math.PI / 180;
}

// Helper function to create empty piece (compatible with Piece class)
function createEmptyPiece() {
    return {
        type: null,
        team: null,
        mesh: null,
        hasMoved: false,
        position: {x: 0, y: 0, z: 0, w: 0},
        getPossibleMoves: function() { return []; }
    };
}



GameBoard.prototype = {
    
    initPieces: function(){
        //
        // Logic
        //
        
        // Instantiate empty pieces (4D array)
        const range = n => [...Array(n)].map((_, i) => i);
        const rangeIn = dims => {
          if (!dims.length) {
              return createEmptyPiece();
          }
          return range(dims[0]).map(_ => rangeIn(dims.slice(1)));
        };
        
        const pieces = rangeIn([this.n, this.n, this.n, this.n])
        
        //
        // Graphics
        //
		return pieces;
    },
    
	// GameBoard.move should only be called from MoveManager. All move data received from server should pass through MoveManager.
    move: function(x0, y0, z0, w0, x1, y1, z1, w1){
		this.graphics.hidePossibleMoves(); // TODO: replace with pointer deselection
		const metaData = {}
		
		const targetPiece = this.pieces[x1][y1][z1][w1];
		if(targetPiece.type){
			Object.assign(metaData, {capturedPiece: targetPiece});
		}
        const piece = this.pieces[x0][y0][z0][w0];
		
		this.graphics.moveMesh(piece, x1, y1, z1, w1);
        
		this.pieces[x0][y0][z0][w0] = createEmptyPiece(); // Remove game object from board
		this.removePiece(x1, y1, z1, w1); // Immediately remove target game object and sprite (do nothing if square is empty)
        this.pieces[x1][y1][z1][w1] = piece; // Replace object in target square with moved piece
        Object.assign(metaData, piece.update(this.pieces, x0, y0, z0, w0, x1, y1, z1, w1));
		
		if(piece.type === 'pawn' && this.isOnPromotionSquare(x1, y1, z1, w1)){
			// Normal capture logic and animation is still executed,
			// but here we replace the pawn's game object with a Queen game object
			// Notice that we do not use GameObject.removePiece() method because
			// it will also remove its mesh, which we only want once the animation
			// finishes
			
			// The following 2 lines were causing bugs when spamming redo after a pawn promotion. Error was that the queen's mesh is undefined. The queen's .mesh property was not being set until the animation was complete. The fix was to create the mesh and set the queen's .mesh property immediately in the promotion logic, and only make it appear (add it to piecesContainer) when the animation is finished.
//			queen = new Queen(piece.team);
//			this.pieces[x1][y1][z1][w1] = queen;
			let queen = this.spawnPiece(Queen, piece.team, x1, y1, z1, w1, false);
			piece.descendant = queen;
			
			Object.assign(metaData, {promotion: true, newPiece: queen, oldPiece: piece});
		}
		
        return metaData;
    },
	
	undo: function(move){
		this.graphics.hidePossibleMoves(); // TODO: replace with pointer deselection
		const pieceInOriginalLoc = this.pieces[move.x0][move.y0][move.z0][move.w0];
		if(pieceInOriginalLoc.type){
			console.error('Unknown error. A piece is already located in original location')
		}
		const originalPiece = move.metaData.promotion ? move.metaData.oldPiece : this.pieces[move.x1][move.y1][move.z1][move.w1];
		this.pieces[move.x0][move.y0][move.z0][move.w0] = originalPiece;
		
		const capturedPiece = move.metaData.capturedPiece || createEmptyPiece();
		if(move.metaData.promotion){
			this.graphics.respawnMesh(originalPiece, move.x1, move.y1, move.z1, move.w1);
			this.removePiece(move.x1, move.y1, move.z1, move.w1); // TODO: THIS IS SCARY. If bugs occur separate the graphics component of removePiece into a new method. The current implementaiton might cause errors...
		}
		this.pieces[move.x1][move.y1][move.z1][move.w1] = capturedPiece;
		
		if (move.metaData.capturedPiece) {
			this.graphics.respawnMesh(capturedPiece, move.x1, move.y1, move.z1, move.w1); 
		}
		if (move.metaData.justMoved) {
			originalPiece.hasMoved = false;
		}
		this.graphics.moveMesh(originalPiece, move.x0, move.y0, move.z0, move.w0);
	},
	
	inCheck: function(team) {
		let attackers = Piece.inCheck(this.pieces, team);
		return attackers.length > 0;
	},
	
	winCondition: function() {
		if (Piece.inCheckmate(this.pieces, 0)) {
			return 1;
		} else if (Piece.inCheckmate(this.pieces, 1)) {
			return 0;
		} else if (Piece.inStalemate(this.pieces, 0) || Piece.inStalemate(this.pieces, 1)){
			return 2;
		} else {
			return -1;
		}
	},
	
	applyToAll: function(f){
		for(let x = 0; x < this.pieces.length; x++){
			for(let y = 0; y < this.pieces[0].length; y++){
				for(let z = 0; z < this.pieces[0][0].length; z++){
					for(let w = 0; w < this.pieces[0][0][0].length; w++){
						const piece = this.pieces[x][y][z][w]
						f(piece)
					}
				}
			}
		}
	},
	
	applyToPieces: function(f){
		function onlyPieces(piece){
			if(piece.type)
				f(piece)
		}
		this.applyToAll(onlyPieces)
	},
	
	applyToTeam: function(f, team){
		function onlyTeam(piece){
			if(piece.team === team){
				f(piece)
			}
		}
		this.applyToPieces(onlyTeam)
	},
    
	
	
    isOnPromotionSquare: function(x, y, z, w){
		const piece = this.pieces[x][y][z][w]
		const promotionLoc = piece.team > 0 ? 0 : this.n - 1
		return z === promotionLoc && w === promotionLoc
    },
    
    spawnPiece: function(PieceConstructor, team, x, y, z, w, addToContainer=true){
        const piece = new PieceConstructor(team)
        this.pieces[x][y][z][w] = piece
		this.graphics.setMesh(piece, x, y, z, w, addToContainer);
        
        // Debug: Log first piece
        if (x === 0 && y === 0 && z === 0 && w === 4) {
            console.log('🔍 First white piece spawned:', {
                type: piece.type,
                team: piece.team,
                position: {x, y, z, w},
                hasMesh: !!piece.mesh,
                meshPosition: piece.mesh ? piece.mesh.position : null
            });
        }
        
		return piece;
    },
	
	removePiece: function(x, y, z, w){
		const piece = this.pieces[x][y][z][w]
		this.graphics.removeMesh(piece);
		this.pieces[x][y][z][w] = createEmptyPiece();
	},
    
    inBounds: function(x, y, z, w) {
        return x >= 0 && x < this.n && y >= 0 && y < this.n && z >=0 && z < this.n && w >=0 && w < this.n;
    },
	
	package: function() {
		const x = this.pieces;
		const pieces = x.map(y => 
			y.map(z => 
				z.map(w => 
					w.map(piece => piece.package())
				)
			)
		);
		return pieces;
	},
	
	loadPieces: function(piecesArr) {
		this.graphics.abandon(); // remove all meshes from scene
		const Graphics = (this.graphics instanceof BoardGraphics) ? BoardGraphics : EmptyBoardGraphics;
		this.graphics = new Graphics(this) // create new graphics
		
		this.pieces = this.initPieces();
		for (let x = 0; x < this.n; x++) {
			for (let y = 0; y < this.n; y++) {
				for(let z = 0; z < this.n; z++) {
					for(let w = 0; w < this.n; w++) {
						const read = piecesArr[x][y][z][w];
						if (read.type) {
							const PieceConstructor = Piece.typeToConstructor[read.type];
							let piece = this.spawnPiece(PieceConstructor, read.team, x, y, z, w);
							Object.assign(piece, read);
						}
						
					}
				}
			}
		}
	},
    
    initializeStartingPositions: function(){
        /*
         * Initialize all 256 pieces for 8x8x8x8 4D chess
         * 
         * BLACK (Team 1): W = 0,1,2,3 (left side) - 128 pieces
         * WHITE (Team 0): W = 4,5,6,7 (right side) - 128 pieces
         * 
         * Each team has 4 complete boards (32 pieces per board)
         */
        
        // Place BLACK pieces (W = 0,1,2,3)
        for (let w = 0; w <= 3; w++) {
            this.placeTeamPieces(1, w, 0); // team 1 (black), y=0 (base layer)
        }
        
        // Place WHITE pieces (W = 4,5,6,7)
        for (let w = 4; w <= 7; w++) {
            this.placeTeamPieces(0, w, 0); // team 0 (white), y=0 (base layer)
        }
        
        console.log('✅ Placed 256 pieces: 128 White + 128 Black');
        console.log(`📦 Pieces container has ${this.graphics.piecesContainer.children.length} meshes`);
        
        // Verify some pieces
        let whitePieces = 0, blackPieces = 0;
        this.applyToAll(piece => {
            if (piece.type && piece.mesh) {
                if (piece.team === 0) whitePieces++;
                else if (piece.team === 1) blackPieces++;
            }
        });
        console.log(`🔍 Verification: ${whitePieces} white pieces, ${blackPieces} black pieces with meshes`);
        
        // Debug first piece details
        if (this.graphics.piecesContainer.children.length > 0) {
            const firstMesh = this.graphics.piecesContainer.children[0];
            
            // Calculate piece height
            const bbox = new THREE.Box3().setFromObject(firstMesh);
            const pieceHeight = bbox.max.y - bbox.min.y;
            const pieceBottom = bbox.min.y;
            const pieceTop = bbox.max.y;
            
            console.log('🔬 First mesh details:', {
                position: {x: firstMesh.position.x, y: firstMesh.position.y, z: firstMesh.position.z},
                scale: {x: firstMesh.scale.x, y: firstMesh.scale.y, z: firstMesh.scale.z},
                height: pieceHeight,
                bottom: pieceBottom,
                top: pieceTop,
                visible: firstMesh.visible,
                material: {
                    color: '#' + firstMesh.material.color.getHexString(),
                    opacity: firstMesh.material.opacity,
                    transparent: firstMesh.material.transparent
                },
                geometry: {
                    vertices: firstMesh.geometry.attributes.position.count
                }
            });
            
            // Log square center for first piece position (0,0,0,4)
            const firstSquareCenter = this.graphics.boardCoordinates(0, 0, 0, 4);
            console.log('📍 First square (0,0,0,4) center:', {
                x: firstSquareCenter.x,
                y: firstSquareCenter.y,
                z: firstSquareCenter.z
            });
            
            console.log('🎯 Camera looking at pieces from:', {
                cameraPos: {x: camera.position.x, y: camera.position.y, z: camera.position.z},
                cameraTarget: {x: controls.target.x, y: controls.target.y, z: controls.target.z},
                piecePos: {x: firstMesh.position.x, y: firstMesh.position.y, z: firstMesh.position.z}
            });
        }
    },
    
    placeTeamPieces: function(team, w, y){
        /*
         * Place all pieces for one team on a single 8x8 board at position (w, y)
         * 
         * team: 0 (white) or 1 (black)
         * w: W-axis position (0-7)
         * y: Y-axis position (0-7)
         */
        
        const backRank = (team === 0) ? 0 : 7;  // Z position for major pieces
        const pawnRank = (team === 0) ? 1 : 6;  // Z position for pawns
        
        // Back rank: Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook
        this.spawnPiece(window.Rook, team, 0, y, backRank, w);
        this.spawnPiece(window.Knight, team, 1, y, backRank, w);
        this.spawnPiece(window.Bishop, team, 2, y, backRank, w);
        this.spawnPiece(window.Queen, team, 3, y, backRank, w);
        this.spawnPiece(window.King, team, 4, y, backRank, w);
        this.spawnPiece(window.Bishop, team, 5, y, backRank, w);
        this.spawnPiece(window.Knight, team, 6, y, backRank, w);
        this.spawnPiece(window.Rook, team, 7, y, backRank, w);
        
        // Pawns row
        for (let x = 0; x < 8; x++) {
            this.spawnPiece(window.Pawn, team, x, y, pawnRank, w);
        }
    },
    
    test: function(x, y, z, w){
        
        if(x == null) x = getRandomInteger(0, this.n)
        if(y == null) y = getRandomInteger(0, this.n)
        if(z == null) z = getRandomInteger(0, this.n)
        if(w == null) w = getRandomInteger(0, this.n)
		
        this.spawnPiece(Rook, 0, 0, 0, 0, 0)
        this.spawnPiece(Knight, 0, 1, 0, 0, 0)
        this.spawnPiece(Knight, 0, 2, 0, 0, 0)
        this.spawnPiece(Rook, 0, 3, 0, 0, 0)
        this.spawnPiece(Bishop, 0, 0, 1, 0, 0)
        this.spawnPiece(Pawn, 0, 1, 1, 0, 0)
        this.spawnPiece(Pawn, 0, 2, 1, 0, 0)
        this.spawnPiece(Bishop, 0, 3, 1, 0, 0)
        this.spawnPiece(Bishop, 0, 0, 2, 0, 0)
        this.spawnPiece(Queen, 0, 1, 2, 0, 0)
        this.spawnPiece(King, 0, 2, 2, 0, 0)
        this.spawnPiece(Bishop, 0, 3, 2, 0, 0)
        this.spawnPiece(Rook, 0, 0, 3, 0, 0)
        this.spawnPiece(Knight, 0, 1, 3, 0, 0)
        this.spawnPiece(Knight, 0, 2, 3, 0, 0)
        this.spawnPiece(Rook, 0, 3, 3, 0, 0)
        
        this.spawnPiece(Pawn, 0, 0, 0, 1, 0)
        this.spawnPiece(Pawn, 0, 1, 0, 1, 0)
        this.spawnPiece(Pawn, 0, 2, 0, 1, 0)
        this.spawnPiece(Pawn, 0, 3, 0, 1, 0)
        this.spawnPiece(Pawn, 0, 0, 1, 1, 0)
        this.spawnPiece(Pawn, 0, 1, 1, 1, 0)
        this.spawnPiece(Pawn, 0, 2, 1, 1, 0)
        this.spawnPiece(Pawn, 0, 3, 1, 1, 0)
        this.spawnPiece(Pawn, 0, 0, 2, 1, 0)
        this.spawnPiece(Pawn, 0, 1, 2, 1, 0)
        this.spawnPiece(Pawn, 0, 2, 2, 1, 0)
        this.spawnPiece(Pawn, 0, 3, 2, 1, 0)
        this.spawnPiece(Pawn, 0, 0, 3, 1, 0)
        this.spawnPiece(Pawn, 0, 1, 3, 1, 0)
        this.spawnPiece(Pawn, 0, 2, 3, 1, 0)
        this.spawnPiece(Pawn, 0, 3, 3, 1, 0)
        
        this.spawnPiece(Pawn, 0, 0, 0, 0, 1)
        this.spawnPiece(Pawn, 0, 1, 0, 0, 1)
        this.spawnPiece(Pawn, 0, 2, 0, 0, 1)
        this.spawnPiece(Pawn, 0, 3, 0, 0, 1)
        this.spawnPiece(Pawn, 0, 0, 1, 0, 1)
        this.spawnPiece(Pawn, 0, 1, 1, 0, 1)
        this.spawnPiece(Pawn, 0, 2, 1, 0, 1)
        this.spawnPiece(Pawn, 0, 3, 1, 0, 1)
        this.spawnPiece(Pawn, 0, 0, 2, 0, 1)
        this.spawnPiece(Pawn, 0, 1, 2, 0, 1)
        this.spawnPiece(Pawn, 0, 2, 2, 0, 1)
        this.spawnPiece(Pawn, 0, 3, 2, 0, 1)
        this.spawnPiece(Pawn, 0, 0, 3, 0, 1)
        this.spawnPiece(Pawn, 0, 1, 3, 0, 1)
        this.spawnPiece(Pawn, 0, 2, 3, 0, 1)
        this.spawnPiece(Pawn, 0, 3, 3, 0, 1)
        
        this.spawnPiece(Pawn, 0, 0, 0, 1, 1)
        this.spawnPiece(Pawn, 0, 1, 0, 1, 1)
        this.spawnPiece(Pawn, 0, 2, 0, 1, 1)
        this.spawnPiece(Pawn, 0, 3, 0, 1, 1)
        this.spawnPiece(Pawn, 0, 0, 1, 1, 1)
        this.spawnPiece(Pawn, 0, 1, 1, 1, 1)
        this.spawnPiece(Pawn, 0, 2, 1, 1, 1)
        this.spawnPiece(Pawn, 0, 3, 1, 1, 1)
        this.spawnPiece(Pawn, 0, 0, 2, 1, 1)
        this.spawnPiece(Pawn, 0, 1, 2, 1, 1)
        this.spawnPiece(Pawn, 0, 2, 2, 1, 1)
        this.spawnPiece(Pawn, 0, 3, 2, 1, 1)
        this.spawnPiece(Pawn, 0, 0, 3, 1, 1)
        this.spawnPiece(Pawn, 0, 1, 3, 1, 1)
        this.spawnPiece(Pawn, 0, 2, 3, 1, 1)
        this.spawnPiece(Pawn, 0, 3, 3, 1, 1)
        
        const l = this.n - 1 // Back row (black)
        const m = l - 1 // Front Row (black)
        
        this.spawnPiece(Rook, 1, 0, 0, l, l)
        this.spawnPiece(Knight, 1, 1, 0, l, l)
        this.spawnPiece(Knight, 1, 2, 0, l, l)
        this.spawnPiece(Rook, 1, 3, 0, l, l)
        this.spawnPiece(Bishop, 1, 0, 1, l, l)
        this.spawnPiece(Pawn, 1, 1, 1, l, l)
        this.spawnPiece(Pawn, 1, 2, 1, l, l)
        this.spawnPiece(Bishop, 1, 3, 1, l, l)
        this.spawnPiece(Bishop, 1, 0, 2, l, l)
        this.spawnPiece(Queen, 1, 1, 2, l, l)
        this.spawnPiece(King, 1, 2, 2, l, l)
        this.spawnPiece(Bishop, 1, 3, 2, l, l)
        this.spawnPiece(Rook, 1, 0, 3, l, l)
        this.spawnPiece(Knight, 1, 1, 3, l, l)
        this.spawnPiece(Knight, 1, 2, 3, l, l)
        this.spawnPiece(Rook, 1, 3, 3, l, l)
        
        this.spawnPiece(Pawn, 1, 0, 0, m, l)
        this.spawnPiece(Pawn, 1, 1, 0, m, l)
        this.spawnPiece(Pawn, 1, 2, 0, m, l)
        this.spawnPiece(Pawn, 1, 3, 0, m, l)
        this.spawnPiece(Pawn, 1, 0, 1, m, l)
        this.spawnPiece(Pawn, 1, 1, 1, m, l)
        this.spawnPiece(Pawn, 1, 2, 1, m, l)
        this.spawnPiece(Pawn, 1, 3, 1, m, l)
        this.spawnPiece(Pawn, 1, 0, 2, m, l)
        this.spawnPiece(Pawn, 1, 1, 2, m, l)
        this.spawnPiece(Pawn, 1, 2, 2, m, l)
        this.spawnPiece(Pawn, 1, 3, 2, m, l)
        this.spawnPiece(Pawn, 1, 0, 3, m, l)
        this.spawnPiece(Pawn, 1, 1, 3, m, l)
        this.spawnPiece(Pawn, 1, 2, 3, m, l)
        this.spawnPiece(Pawn, 1, 3, 3, m, l)
        
        this.spawnPiece(Pawn, 1, 0, 0, l, m)
        this.spawnPiece(Pawn, 1, 1, 0, l, m)
        this.spawnPiece(Pawn, 1, 2, 0, l, m)
        this.spawnPiece(Pawn, 1, 3, 0, l, m)
        this.spawnPiece(Pawn, 1, 0, 1, l, m)
        this.spawnPiece(Pawn, 1, 1, 1, l, m)
        this.spawnPiece(Pawn, 1, 2, 1, l, m)
        this.spawnPiece(Pawn, 1, 3, 1, l, m)
        this.spawnPiece(Pawn, 1, 0, 2, l, m)
        this.spawnPiece(Pawn, 1, 1, 2, l, m)
        this.spawnPiece(Pawn, 1, 2, 2, l, m)
        this.spawnPiece(Pawn, 1, 3, 2, l, m)
        this.spawnPiece(Pawn, 1, 0, 3, l, m)
        this.spawnPiece(Pawn, 1, 1, 3, l, m)
        this.spawnPiece(Pawn, 1, 2, 3, l, m)
        this.spawnPiece(Pawn, 1, 3, 3, l, m)
        
        this.spawnPiece(Pawn, 1, 0, 0, m, m)
        this.spawnPiece(Pawn, 1, 1, 0, m, m)
        this.spawnPiece(Pawn, 1, 2, 0, m, m)
        this.spawnPiece(Pawn, 1, 3, 0, m, m)
        this.spawnPiece(Pawn, 1, 0, 1, m, m)
        this.spawnPiece(Pawn, 1, 1, 1, m, m)
        this.spawnPiece(Pawn, 1, 2, 1, m, m)
        this.spawnPiece(Pawn, 1, 3, 1, m, m)
        this.spawnPiece(Pawn, 1, 0, 2, m, m)
        this.spawnPiece(Pawn, 1, 1, 2, m, m)
        this.spawnPiece(Pawn, 1, 2, 2, m, m)
        this.spawnPiece(Pawn, 1, 3, 2, m, m)
        this.spawnPiece(Pawn, 1, 0, 3, m, m)
        this.spawnPiece(Pawn, 1, 1, 3, m, m)
        this.spawnPiece(Pawn, 1, 2, 3, m, m)
        this.spawnPiece(Pawn, 1, 3, 3, m, m)
        
    }
    
}


EmptyBoardGraphics.prototype = {
	
	getBoundingBox: function() {},
	
	getCenter: function(){},
	
	boardCoordinates: function(x, y, z, w){},
	
	worldCoordinates: function(pos){},
	
	showPossibleMoves: function(locations, piece, materialScheme={}, canRayCast){},
    
    showPossibleMoves2: function(x, y, z, w, materialScheme){},
    
    hidePossibleMoves: function(objectName='possibleMoves'){},
	
	moveMesh: function(piece, x1, y1, z1, w1){},
	
	createMesh: function(typeString, team, x, y, z, w, addToContainer=true){},
	
	setMesh: function(piece, x, y, z, w, addToContainer=true){},
	
	removeMesh: function(piece){},
	
	respawnMesh: function(piece){},
	
	setSelectability: function(piece, canMove) {},
	
	addToPiecesContainer: function(mesh) {},
	
	abandon: function() {}
	
}





BoardGraphics.prototype = {
	
	getBoundingBox: function() {
		const offset = this.boardSize / 2;
		const originOffset = new THREE.Vector3(offset, 0, -offset);
		const logicalLocalOrigin = originOffset.clone().multiplyScalar(-1);
		const globalLLO = logicalLocalOrigin.clone().add(this.mesh.position);
		
		const globalBottomLeft = logicalLocalOrigin.clone().add(this.mesh.position);
		const halfDiagonal = this.getCenter().sub(globalLLO);
		const extraHeight = new THREE.Vector3(0, this.verticalIncrement, 0);
		const globalTopRight = this.getCenter().clone().add(halfDiagonal).clone().add(extraHeight);
		
		const extraSpace = new THREE.Vector3(this.squareSize * 0, 0, -this.squareSize)
		
		return {
			bottomLeft: globalBottomLeft.sub(extraSpace),
			topRight: globalTopRight.add(extraSpace)
		};
	},
	
	getCenter: function(){
		const numHalfBoards = (this.n - 1) / 2;
		const localZ = -(this.boardSize + this.horizontalGap) * numHalfBoards;
		const localY = this.verticalIncrement * numHalfBoards;
		const localCenter = new THREE.Vector3(0, localY, localZ);
		return localCenter.add(this.mesh.position);
	},
	
	boardCoordinates: function(x, y, z, w){
        
        // Get world coordinates from board coordinates
        // NOTE: Returns position in world space (relative to piecesContainer since pieces are added there)
        
        const zero = new THREE.Vector3((0.5 * this.squareSize) - (0.5 * this.squareSize * this.n), 0, (0.5 * this.squareSize * this.n) - (0.5 * this.squareSize))
        
        const xShift = x * this.squareSize
        const yShift = y * this.verticalIncrement + this.EPSILON
        const zShift = -(z * this.squareSize + w * this.horizontalIncrement)
        const translation = new THREE.Vector3(xShift, yShift, zShift)
        
        // Don't add container positions since pieces/boards are in separate containers at same origin
        return zero.add(translation)
        
    },
	
	worldCoordinates: function(pos){
        
        // Get board coordinates from world coordinates
        const zero = new THREE.Vector3((0.5 * this.squareSize) - (0.5 * this.squareSize * this.n), 0, (0.5 * this.squareSize * this.n) - (0.5 * this.squareSize))
        pos = pos.clone().sub(zero)  // Don't subtract container position
        
        let x = Math.floor(pos.x / this.squareSize)
        let y = Math.floor(pos.y / this.verticalIncrement)
        let numGaps = Math.floor(-pos.z / this.horizontalIncrement)
        let z = Math.floor((-pos.z - (numGaps * this.horizontalIncrement)) / this.squareSize)
        let w = numGaps
        
        return new THREE.Vector4(x, y, z, w)
    },
	
	showPossibleMoves: function(locations, piece, materialScheme={}, canRayCast){
		materialScheme = Object.assign({
			0: {
				moveMaterial: Models.materials.green,
				attackMaterial: Models.materials.red
			},
			1: {
				moveMaterial: Models.materials.green,
				attackMaterial: Models.materials.red
			},
		}, materialScheme)
		
        this.hidePossibleMoves();
		
        locations.forEach(pos => {
			
			coordinates = this.boardCoordinates(pos.x, pos.y, pos.z, pos.w)
			let material;
			let shadowPiece;
			if(pos.possibleCapture){
				const attackedPiece = this.gameBoard.pieces[pos.x][pos.y][pos.z][pos.w]
				material = materialScheme[piece.team].attackMaterial;
				shadowPiece = Models.createMesh(attackedPiece.type, material, coordinates.x, coordinates.y, coordinates.z, 1, canRayCast)
				if(attackedPiece.team === 0){
					rotateObject(shadowPiece, 0, 180, 0)
				}
			} else {
				let material = materialScheme[piece.team].moveMaterial;
				shadowPiece = Models.createMesh(piece.type, material, coordinates.x, coordinates.y, coordinates.z, 1, canRayCast)
			}
				
			this.possibleMovesContainer.add(shadowPiece)
            
            			
        });
        
    },
    
    showPossibleMoves2: function(x, y, z, w, materialScheme){
      
        const locations = this.pieces[x][y][z][w].getPossibleMoves(this.pieces, x, y, z, w)
        
        this.showPossibleMoves(locations, piece, materialScheme, true)
        
    },
    
    hidePossibleMoves: function(objectName='possibleMoves'){
        while(this.possibleMovesContainer.children.length){
			const mesh = this.possibleMovesContainer.children[0]
			Selector.unhighlight(mesh)
            this.possibleMovesContainer.remove(mesh);
        }
    },
	
	moveMesh: function(piece, x1, y1, z1, w1){
		const currentMeshCoords = piece.mesh.position
        const newMeshCoords = this.boardCoordinates(x1, y1, z1, w1)
        
        const frames = 12
        const interpolatedCoords = Animation.linearInterpolate(currentMeshCoords, newMeshCoords, frames)
        Animation.addToQueue(animationQueue, piece.mesh, interpolatedCoords)
        piece.mesh.canRayCast = false // temporarily disable piece's ability to be found in rayCast
        
        animationQueue[animationQueue.length - 1].onAnimate = function(){
            piece.mesh.canRayCast = true // re-enable piece's ability to be found in rayCast
            if(piece.type === 'pawn' && this.isOnPromotionSquare(x1, y1, z1, w1)){
				// Normal capture logic and animation is still executed,
				// but here we remove the pawn's sprite and spawn in a queen
				// Notice that we do not use GameObject.removePiece() method because
				// it will also remove its game object, which is logic that should 
				// be separate from graphics
				this.graphics.removeMesh(piece)
				this.graphics.addToPiecesContainer(piece.descendant.mesh); // Only add mesh to scene when animation is finished
//				this.graphics.piecesContainer.add(queen.mesh); 
            }
        }.bind(this.gameBoard)
	},
	
	createMesh: function(typeString, team, x, y, z, w, addToContainer=true){ 
		
		// Create mesh (without game object), add it to the scene, and return the mesh
		const worldPos = this.boardCoordinates(x, y, z, w)
		const material = team === 0 ? Models.materials.white : Models.materials.black
		
		
		const mesh = Models.createMesh(typeString, material, worldPos.x, worldPos.y, worldPos.z)
		
		if (!mesh) {
			console.error(`❌ Models.createMesh returned null for ${typeString}`);
			return null;
		}
		
		if(team === 0) rotateObject(mesh, 0, 180, 0)
		
		if(addToContainer){
			this.piecesContainer.add(mesh)
		}
		
		return mesh
		
	},
	
	setMesh: function(piece, x, y, z, w, addToContainer=true){
		const mesh = this.createMesh(piece.type, piece.team, x, y, z, w, addToContainer);
        if (mesh) {
            piece.setMesh(mesh);
        } else {
            console.error(`❌ Failed to create mesh for ${piece.type} at (${x},${y},${z},${w})`);
        }
	},
	
	removeMesh: function(piece){
		this.piecesContainer.remove(piece.mesh);
	},
	
	respawnMesh: function(piece, x, y, z, w){
		if (piece.mesh) {
			this.piecesContainer.add(piece.mesh);
		} else {
			piece.mesh = this.createMesh(piece.type, piece.team, x, y, z, w, true);
		}
		
	},
	
	setSelectability: function(piece, canMove) {
		piece.mesh.selectable = canMove;
	},
	
	addToPiecesContainer: function(mesh) {
		this.piecesContainer.add(mesh); 
	},
	
	abandon: function() {
		scene.remove(this.mesh)
	}
	
}


function GameBoard(n=8, Graphics=BoardGraphics){
	
    this.n = n;
    
	this.graphics = new Graphics(this);
    this.pieces = this.initPieces();
    
    // Initialize starting positions for 4D chess (256 pieces)
    // Call this manually when ready: this.initializeStartingPositions();
	
	this.setSelectability = function(team, canMove){
		// Enable/Disable piece rayCasting (block user interaction)
		this.applyToTeam(function(piece){
			this.graphics.setSelectability(piece, canMove);
//			piece.mesh.selectable = canMove
		}.bind(this), team)
	};
}

function BoardGraphics(gameBoard) {
//	EmptyBoardGraphics.call(this, gameBoard);
	this.gameBoard = gameBoard;
	this.n = gameBoard.n;
	this.squareSize = 50
	this.boardSize = this.squareSize * this.n;
    this.verticalIncrement = 100 * 1.75
    this.horizontalGap = this.squareSize * 1.6
    this.horizontalIncrement = this.n * this.squareSize + this.horizontalGap
    this.globalLength = this.horizontalIncrement * (this.n - 1)
    this.globalHeight = this.verticalIncrement * this.n
	this.boardHeight = 5;
    this.EPSILON = 1  // Small offset to place pieces just above board surface
	
	this.mesh = new THREE.Object3D();
	this.boardContainer = new THREE.Object3D();
    this.piecesContainer = new THREE.Object3D();
    this.possibleMovesContainer = new THREE.Object3D();
	this.boardContainer.name = 'boardContainer';
	this.piecesContainer.name = 'piecesContaier';
	this.possibleMovesContainer.name = 'possibleMovesContainer';
	this.mesh.add(this.boardContainer)
	this.mesh.add(this.piecesContainer)
	this.mesh.add(this.possibleMovesContainer)
	scene.add(this.mesh);
	
	// Log container positions
	console.log('🎨 Container positions:', {
		mesh: this.mesh.position,
		boardContainer: this.boardContainer.position,
		piecesContainer: this.piecesContainer.position
	});
	
	let bottom = 0;
	let left = 0;
	for (let w = 0; w < this.n; w++){
		for(let i = 0; i < this.n; i++){
			let checker = BoardGraphics.checkerboard3d(this.n, this.n * this.squareSize, z=i, w, opacity=0.8, this.boardHeight) // Construct 2D checkerboard planes
			checker.position.set(0, bottom + i*this.verticalIncrement, left - w*this.horizontalIncrement)
			rotateObject(checker, -90, 0, 0)
			this.boardContainer.add(checker)
			
			// Log first board (y=0, w=0) square positions
			if (i === 0 && w === 0) {
				console.log('📐 First board (y=0, w=0) created at:', {
					boardPosition: checker.position,
					boardHeight: this.boardHeight,
					topSurface: checker.position.y + this.boardHeight/2
				});
			}
		}
	}
	
}

BoardGraphics.checkerboard = function(segments=8, boardSize=100, z=0, w=0, opacity=0.5){
    
    const squareSize = boardSize / segments;
    let boardContainer = new THREE.Group();
    
    // Create individual squares in a checkerboard pattern
    for(let x = 0; x < segments; x++){
        for(let y = 0; y < segments; y++){
            // Determine color based on checkerboard pattern
            const isLight = (x + y + z + w) % 2 === 0;
            const color = isLight ? 0xccccfc : 0x444464;
            
            // Create a plane for this square
            const geometry = new THREE.PlaneGeometry(squareSize, squareSize);
            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: opacity,
                side: THREE.DoubleSide
            });
            
            const square = new THREE.Mesh(geometry, material);
            
            // Position the square
            const offsetX = (x - segments/2 + 0.5) * squareSize;
            const offsetY = (y - segments/2 + 0.5) * squareSize;
            square.position.set(offsetX, offsetY, 0);
            
            boardContainer.add(square);
        }
    }
    
    return boardContainer;
}

BoardGraphics.checkerboard3d = function(segments=8, boardSize=100, z=0, w=0, opacity=0.5, boardHeight=5){
	
	const BOARD_HEIGHT = boardHeight;
	const squareSize = boardSize / segments;
	
	// Create a container for all board squares
	let boardContainer = new THREE.Group();
	
	// Create individual squares in a checkerboard pattern
	for(let x = 0; x < segments; x++){
		for(let y = 0; y < segments; y++){
			// Determine color based on checkerboard pattern
			const isLight = (x + y + z + w) % 2 === 0;
			const color = isLight ? 0xccccfc : 0x444464;
			
			// Create a box for this square
			const geometry = new THREE.BoxGeometry(squareSize, squareSize, BOARD_HEIGHT);
			const material = new THREE.MeshPhongMaterial({
				color: color,
				transparent: true,
				opacity: opacity,
				side: THREE.DoubleSide
			});
			
			const square = new THREE.Mesh(geometry, material);
			
			// Position the square
			const offsetX = (x - segments/2 + 0.5) * squareSize;
			const offsetY = (y - segments/2 + 0.5) * squareSize;
			square.position.set(offsetX, offsetY, -BOARD_HEIGHT/2);
			
			boardContainer.add(square);
		}
	}
	
	return boardContainer;
}

function EmptyBoardGraphics(gameBoard) {

}

