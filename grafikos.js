


function setupLight(scene) {
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    var ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
}







    var R = 10, r;
	var o = 0.005, h=0.05;
	//var o = 0.2, h=0.1;
	var hh=h;
	var offset = THREE.Vector3(10,10,10);

	var x, y, z;    







function adjustSeam(face1, face2) {
    const dif = 0.5;
    if (Math.abs(face1.x - face2.x) > dif) {
        const faceToAdjust = face1.x > face2.x ? face1 : face2;
        faceToAdjust.x = 0;
    }
}

function getX(vertex) {
    const f = Math.atan2(vertex.x, vertex.z );
    return f / (2 * Math.PI) + 0.5;
}

function getY(vertex) {

    const f = Math.atan2(vertex.x, vertex.z);
    const p = Math.atan2(vertex.y, ((vertex.x / Math.sin(f)) - R/4));
	
    return p / Math.PI + 0.5;
	
}


function makeFace(geometryFace, face, facesCount, vertices, faces3d, faces2d, hullGeometry){
	
	for (var i = 0; i < facesCount; i++) {
        geometryFace = faces3d[i];
        const vertex1 = vertices[geometryFace.a];
        const vertex2 = vertices[geometryFace.b];
        const vertex3 = vertices[geometryFace.c];

        upperLayerFace = faces2d[i];

        upperLayerFace[0].x = getX(vertex1);
        upperLayerFace[0].y = getY(vertex1);

        upperLayerFace[1].x = getX(vertex2);
        upperLayerFace[1].y = getY(vertex2);

        upperLayerFace[2].x = getX(vertex3);
        upperLayerFace[2].y = getY(vertex3);

        adjustSeam(upperLayerFace[0], upperLayerFace[1]);
        adjustSeam(upperLayerFace[1], upperLayerFace[2]);
        adjustSeam(upperLayerFace[2], upperLayerFace[0]);
    }
	
	
}

function getPoints(scene) {
     x = 0;
     y = 0;
     z = 0;
    var points = [];
         
			/*points.push(new THREE.Vector3(0 , 0-1 ,0 ));
            for (var i = 0; i <= 2; i+= h - Math.abs(h * (i-1) ) + hh) 
            {
                if (R * R - (R*i - R) * (R*i - R) > 0)
                    r = Math.sqrt(R * R - (R*i - R) * (R*i - R)) ;
                else
                    r=0;

                for (var a =0; a<=1-o  ; a+=o)
                {
                    x = Math.cos(a * 2 * Math.PI) * r;
                    y = Math.sin(a * 2 * Math.PI) * r;
                    points.push(new THREE.Vector3(x , i * R ,y ));
                    if (r== 0) {break;}
                    
                }
            }
			points.push(new THREE.Vector3(0 , 2*R+1 ,0 ));*/
			var thresh = 1;
			
			for (var e = 0; e< 3000; e)
			{
				x = Math.random() * R*2 - R;
				y = Math.random() * R*2 - R; //2 * Math.sqrt(R*R - x*x) - Math.sqrt(R*R - x*x);
				z = Math.random() * R*2 - R; //2*Math.sqrt(R*R - x*x - y*y) - Math.sqrt(R*R - x*x - y*y);
				
				if ( Math.sqrt(x*x+y*y+z*z) <= R) 
				//if(Math.abs((x*x +y*y+z*z) - R*R) < thresh) 
				{
					e++;
					points.push(new THREE.Vector3(x , z ,y ));
				}
			}
			

    const hullGeometry = new THREE.ConvexGeometry(points);
    const faces2d = hullGeometry.faceVertexUvs[0];
    const faces3d = hullGeometry.faces;
    const vertices = hullGeometry.vertices;
	const facesCount = faces2d.length;
    var face;
    var geometryFace;
    
	
	makeFace(geometryFace, face, facesCount, vertices, faces3d, faces2d, hullGeometry);
	
	
	
	
	 spGroup = new THREE.Object3D();
            var material = new THREE.MeshPhongMaterial({color: 0xff0000, transparent: false});
           

            points.forEach(function (point) {

                var spGeom = new THREE.SphereGeometry(1);
                var spMesh = new THREE.Mesh(spGeom, material);
                spMesh.position = point;
                //spGroup.add(spMesh);
            });
            // add the points as a group to the scene
            scene.add(spGroup);
	

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = '';
    loader.load(
        "https://i.imgur.com/KOgaj60.png", //https://i.imgur.com/KOgaj60.png //https://i.imgur.com/o2mlePv.png
        function (texture) {

			//texture.wrapS = THREE.RepeatWrapping;
           // texture.wrapT = THREE.RepeatWrapping;
			//texture.repeat.set( 1, 2 );
             var meshMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF, transparent: true, opacity: 1});
            meshMaterial.map = texture;

  var wireFrameMat = new THREE.MeshBasicMaterial();
            wireFrameMat.wireframe = true;
            wireFrameMat.color = 0xFF0000;

            const mesh = THREE.SceneUtils.createMultiMaterialObject(hullGeometry, [meshMaterial]);

            scene.add(mesh);
        });
}


function createRenderer() {
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xFFFFFF, 1.0); // background color
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    return renderer;
}

$(function () {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = createRenderer();
	renderer.setClearColorHex( 0xff00ff, 1 );

    setupLight(scene);
    getPoints(scene);


    camera.position.x = 0;
    camera.position.y = 50;
    camera.position.z = 10;
    camera.lookAt(scene.position);

    // add the output of the renderer to the html element
    $("#WebGL-output").append(renderer.domElement);
    var controls = new THREE.TrackballControls(camera, renderer.domElement);
    render();

    function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
        controls.update();
    }
});