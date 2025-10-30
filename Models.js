const Models = {
    
    SCALE_FACTOR: 5,  // Made much larger to see the pieces
    
    materials: {
        black: {
            color: 0x818181,
            reflectivity: 0.1,
            shininess: 20,
            flatShading: false,
            transparent: false,
            opacity: 1.0
        },
    
        white: {
            color: 0xFCF6E3,
            reflectivity: 10,
            shininess: 25,
            flatShading: false,
            transparent: false,
            opacity: 1.0

        },
    
        red: {
            color: 0xFF0000,
            reflectivity: 10,
            shininess: 25,
            flatShading: false,
            transparent: true,
            opacity: 0.6
        },
        
        green: {
            color: 0x90EE90,
            reflectivity: 10,
            shininess: 25,
            flatShading: false,
            transparent: true,
            opacity: 0.6
        },
        
        darkGreen: {
            color: 0x006400,
            reflectivity: 10,
            shininess: 25,
            flatShading: false,
            transparent: true,
            opacity: 0.6,
        },
		
		lightGreen: {
            color: 0x42f5aa,
            reflectivity: 10,
            shininess: 25,
            flatShading: false,
            transparent: true,
            opacity: 0.6,
        },
        
        orange: {
            color: 0xFFA500,
            reflectivity: 10,
            shininess: 25,
            flatShading: false,
            transparent: true,
            opacity: 0.4
        },
        
        blue: {
            color: 0x00B9FF,
            reflectivity: 10,
            shininess: 25,
            flatShading: false,
            transparent: true,
            opacity: 0.4
        },
        
//        black: new THREE.MeshPhongMaterial({
//            color: 0x110C11,
//            reflectivity: 0.1,
//            shininess: 20,
//            shading: THREE.SmoothShading,
//            transparent: true,
//            opacity: 1.0
//        }),
//    
//        white: new THREE.MeshPhongMaterial({
//            color: 0xFCF6E3,
//            reflectivity: 10,
//            shininess: 25,
//            shading: THREE.SmoothShading,
//            transparent: true,
//            opacity: 1.0
//
//        }),
//    
//        red: new THREE.MeshPhongMaterial({
//            color: 0xFF0000,
//            reflectivity: 10,
//            shininess: 25,
//            shading: THREE.SmoothShading,
//            transparent: true,
//            opacity: 0.4,
////            alphaTest: 0.5
//        })
        
    },
    
    directory: 'models/',
    
    pieceData: [
        {
            name: 'pawn',
            fileName: 'Pawn.obj',
            rotation: new THREE.Vector3(0, 0, 0)
        }, {
            name: 'rook',
            fileName: 'Rook.obj',
            rotation: new THREE.Vector3(0, 0, 0)
        }, {
            name: 'bishop',
            fileName: 'Bishop.obj',
            rotation: new THREE.Vector3(0, 0, 0)
        }, {
            name: 'knight',
            fileName: 'Knight.obj',
            rotation: new THREE.Vector3(0, 0, 0)
        }, {
            name: 'queen',
            fileName: 'Queen.obj',
            rotation: new THREE.Vector3(0, 0, 0)
        }, {
            name: 'king',
            fileName: 'King.obj',
            rotation: new THREE.Vector3(0, 0, 0)
        }
    ],
    
    createMesh: function(piece, material, x=0, y=0, z=0, scale=1, canRayCast=true){
        
//        const manager = new THREE.LoadingManager();
//        const loader = new THREE.JSONLoader(manager);
//        const path = Models.directory + Models[piece].fileName;
//        
//        loader.load(path, function(geometry, materials) {
//            var mesh = new THREE.Mesh(geometry, material);
//            mesh.position.set(3, 0, 21);
//            mesh.rotation.set(Models[piece].rotation.x, Models[piece].rotation.y, Models[piece].rotation.z);
//            mesh.castShadow = true;
//            mesh.receiveShadow = true;
//
//            mesh.scale.set(4, 4, 4)
//            scene.add(mesh)
//        });
        
        const pieceData = Models.pieceData[Models.pieceIndices[piece]]
        const geometry = Models.geometries[piece]
        let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial(material))
//        let mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial(material))
        mesh.position.set(0, 0, 0);
        mesh.rotation.set(pieceData.rotation.x, pieceData.rotation.y, pieceData.rotation.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

		mesh.scale.set(Models.SCALE_FACTOR, Models.SCALE_FACTOR, Models.SCALE_FACTOR)
		const height = new THREE.Box3().setFromObject(mesh).max.y;
//		const dHeight = height * (scale - 1)
		
		mesh.scale.multiplyScalar(scale)
		mesh.position.set(x, y, z)
		
		
		
        
        mesh.canRayCast = canRayCast;
        
        return mesh
        
        
    },
    
    geometries: {},
    loadedObjects: {},
    pieceIndices: {},
    
    loadModels: function(){
		return new Promise(function(resolve, reject) {
			// Loads all chess models (.obj files) then calls init when finished
			const manager = new THREE.LoadingManager();
			manager.onLoad = function() {
                console.log('✅ All models loaded successfully!');
                resolve();
            };
            manager.onError = function(url) {
                console.error('❌ Error loading:', url);
                reject(url);
            };
            manager.onProgress = function(url, loaded, total) {
                const percent = Math.round((loaded / total) * 100);
                console.log(`Loading models: ${percent}% (${loaded}/${total})`);
            };
            
			const loader = new THREE.OBJLoader(manager);

			let index = 0;
			Models.pieceData.forEach(piece => {
				const path = Models.directory + piece.fileName;
                
				loader.load(
                    path,
                    function(object) {
                        // Successfully loaded
                        Models.loadedObjects[piece.name] = object;
                        
                        // Extract geometry from first mesh in the object
                        object.traverse(function(child) {
                            if (child instanceof THREE.Mesh) {
                                if (!Models.geometries[piece.name]) {
                                    Models.geometries[piece.name] = child.geometry;
                                }
                            }
                        });
                        
                        console.log(`✅ Loaded: ${piece.name}`);
                    },
                    function(xhr) {
                        // Progress
                        if (xhr.lengthComputable) {
                            const percentComplete = xhr.loaded / xhr.total * 100;
                            console.log(`${piece.name}: ${Math.round(percentComplete)}%`);
                        }
                    },
                    function(error) {
                        // Error
                        console.error(`❌ Error loading ${piece.name}:`, error);
                    }
                );

				Models.pieceIndices[piece.name] = index++;
			});
		});
    }
    
}