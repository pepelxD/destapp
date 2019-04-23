import * as THREE from 'three';
export default class {
	constructor(text) {
		this.text = text.split(' | ');
		this.textsGeo = [];
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
		this.renderer = new THREE.WebGLRenderer({antialias: true});

		this.morphs = [];
		this.morphIndex = 0; // возможно придется перенести в конструктор

		this.speed = 4; // единиц в секунду
		this.longestDist = 0;
		this.fullTime = this.longestDist / this.speed; // продолжительность анимации определяется по самой длинной дистанции, так как скорость постоянная
		

		this.clock = new THREE.Clock();
		this.delta = 0;
		this.globalTime = 0;
		this.clampedDirLength = new THREE.Vector3();
		this.currentDuration = 0;
	}

	/**
	 *
	 *
	 * @param {TREE loader} loader
	 * @param {string} resursPath
	 * @returns promise
	 */
	_resurseLoader(loader, resursePath) {
		return new Promise((resolve, reject) => {
			loader.load(resursePath, 
			(resurse) => {
				resolve(resurse);
			},
			(xhr) => {
				console.log( (xhr.loaded / xhr.total * 100) + '% loaded' + resursePath );
			},
			(err) => {
				console.log( 'An error happened' );
				reject(err);
			});
		});
	}
	resizeHandler() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}
	removeCanvas(event) {
		if(event.animationName === 'change-opacity') {
			this.renderer.domElement.remove();
			window.removeEventListener('animationend', this.removeCanvas);
			window.removeEventListener( 'resize', this.resizeHandler);
		}
	}
	_ptInTriangle(p, p0, p1, p2) {
		// credits: http://jsfiddle.net/PerroAZUL/zdaY8/1/
		let A = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
		let sign = A < 0 ? -1 : 1;
		let s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
		let t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;

		return s > 0 && t > 0 && (s + t) < 2 * A * sign;
	}
	_isPointInside(point, geometry) {
		let a = new THREE.Vector3();
		let b = new THREE.Vector3();
		let c = new THREE.Vector3();
		let face = new THREE.Face3();
		let retVal = false;
		for (let i = 0; i < geometry.faces.length; i++) {
			face = geometry.faces[i];
			a = geometry.vertices[face.a];
			b = geometry.vertices[face.b];
			c = geometry.vertices[face.c];
			if (this._ptInTriangle(point, a, b, c)) {
				retVal = true;
				break;
			}
		}
		return retVal;
	}
	_setRandomPoint(geometry) {
		const point = new THREE.Vector3(
			THREE.Math.randFloat(geometry.boundingBox.min.x, geometry.boundingBox.max.x),
			THREE.Math.randFloat(geometry.boundingBox.min.y, geometry.boundingBox.max.y),
			THREE.Math.randFloat(geometry.boundingBox.min.z, geometry.boundingBox.max.z)
		);
		if (this._isPointInside(point, geometry)) {
			geometry.vertices.push(point);
		} else {
			this._setRandomPoint(geometry);
		}
	}
	_fillWithPoints(geometry, pointNumber) {
		geometry.computeBoundingBox();
		for (var i = geometry.vertices.length; i < pointNumber; i++) {
			this._setRandomPoint(geometry);
		}
	}
	createText(text, font) {
		const textGeo = new THREE.TextGeometry(text, {
			font: font,
			size: 4,
			height: 1,
			curveSegments: 10,
			bevelEnabled: false,
			bevelSize: 20,
			bevelThickness: 50
		});
		textGeo.computeVertexNormals();
		textGeo.center();
		this._fillWithPoints(textGeo, 15000);
		return textGeo;
	}
	_bridge(geos, cb) {
		const createMorph = (geomStart, geomEnd, speed, colorStart, colorEnd) => {
			let duration = 0;
			let tempDist = new THREE.Vector3(); 
			let vertices = [];
			let longestDist = 0;
			vertices = geomStart.vertices.map((v, i) => {
				let nv = null;
				if(v.init) {
					nv = v.init.clone();
				} else {
					nv = v.clone();
				}
				
				tempDist.copy(geomEnd.vertices[i]).sub(nv);
				let dist = tempDist.length();
				longestDist = Math.max(dist, longestDist);
				let dir = new THREE.Vector3().copy(tempDist).normalize();
				
				nv.dir = dir;
				nv.dist = dist;
				return nv;
				
			  }
			);
			
			duration = longestDist / speed;
			this.morphs.push({
				speed: speed,
				duration: duration,
				vertices: vertices,
				colorStart: colorStart,
				colorEnd: colorEnd
			  }
			);
		}
		let length = geos.length;
		for(let i = 0; i < length; i++) {
			if(i === length - 1) {
				createMorph(geos[i], geos[0], 4.5, new THREE.Color(0x00ffff), new THREE.Color(0xffff00));
				cb();
				return;
			}
			createMorph(geos[i], geos[i + 1], 3.5, new THREE.Color(0x00ffff), new THREE.Color(0xffff00));
		}
	}
	animate() {
		const animationId = requestAnimationFrame(this.animate.bind(this));
			
		if (this.globalTime >= this.fullTime) { // если текущая продолжительность больше или равна заданной, то останавливаем цикл прорисовки или делаем что-то другое
			//cancelAnimationFrame(animationId);
			/* this.textsGeo[0].vertices.forEach(vertex => {
				vertex.copy(vertex.init).addScaledVector(vertex.dir, 5 + Math.cos(Date.now() * 0.001) * 5);
			}); */
			//globalTime = 0;
			this.currentDuration += this.clock.getDelta();
			this.textsGeo[0].vertices.forEach((v, i) => {
				let morph = this.morphs[this.morphIndex];
				let morphV = morph.vertices[i];
				this.clampedDirLength		// reusable vector
					.copy(morphV.dir) // set its value as a normalized direction from the array
					.multiplyScalar(this.currentDuration * morph.speed)	// multiply it with the time, passed since the beginning of the current morph, and speed (the result is the distance, a scalar value)
					.clampLength(0, morphV.dist); // magic is here: we clamp the length of the vector, thus it won't exceed the limit						
				v.copy(morphV).add(this.clampedDirLength); // add the vector to the initial coordinates of a point
				//geom.colors[i].copy(morph.colorStart).lerp(morph.colorEnd, clampedDirLength.length() / morphV.dist);
			});
			this.textsGeo[0].verticesNeedUpdate = true;
			this.textsGeo[0].colorsNeedUpdate = true;

			if (this.currentDuration >= this.morphs[this.morphIndex].duration + 0.5 && this.morphIndex === this.morphs.length - 1) {
				setTimeout(() => {
					this.sound.stop();
				}, 1600);
				console.log(this.morphIndex, 'end animation');
				cancelAnimationFrame(animationId);
				this.renderer.domElement.classList.add('extinction');
			}
			
			if (this.currentDuration >= this.morphs[this.morphIndex].duration + 0.5){
				this.morphIndex = (this.morphIndex + 1) % this.textsGeo.length;
				this.currentDuration = 0;
			}
			
			


		} else {
			this.delta = this.clock.getDelta();
			this.globalTime += this.delta;
			this.textsGeo[0].vertices.forEach(v => {
				this.clampedDirLength.copy(v.dir).multiplyScalar(this.globalTime * this.speed).clampLength(0, v.dist); // clamp the length!
				v.copy(v.random).add(this.clampedDirLength);
			});
			this.textsGeo[0].verticesNeedUpdate = true;
		}
		

		this.renderer.render(this.scene, this.camera);
	}
	init(cb) {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(0x000000);
		this.camera.position.set(0, 10, 20);
		this.camera.lookAt(this.scene.position);
		let light = new THREE.DirectionalLight(0xffffff, 2);
		light.position.set( 0, 0, 1 ).normalize();
		this.scene.add(light);

		//==========
		const audioListener = new THREE.AudioListener();
		this.camera.add(audioListener);
		this.sound = new THREE.Audio(audioListener); // sound запускает проигрывание
		this.scene.add(this.sound);
		var audiLloader = new THREE.AudioLoader();
		var fontLoader = new THREE.FontLoader();
		Promise.all([
			this._resurseLoader(audiLloader, '../static/intro_sound.mp3'),
			this._resurseLoader(fontLoader, '../static/optimer_bold.typeface.json'),
		]).then((values) => {
			this.text.forEach(item => {
				this.textsGeo.push(this.createText(item, values[1]));
			});
			const textPoints = new THREE.Points(this.textsGeo[0], new THREE.PointsMaterial({
				color: 0xf00008,
				size: 0.1
			}));
			let tempDist = new THREE.Vector3();
			this.textsGeo[0].vertices.forEach(vertex => {
				vertex.init = vertex.clone();
				vertex.random = new THREE.Vector3(THREE.Math.randFloatSpread(50), THREE.Math.randFloatSpread(50), THREE.Math.randFloatSpread(25));
				vertex.dir = new THREE.Vector3().copy(vertex.init).sub(vertex.random).normalize();
				vertex.dist = tempDist.copy(vertex.init).sub(vertex.random).length();
				vertex.copy(vertex.random);
				this.longestDist = Math.max(this.longestDist, vertex.dist);
			});
			this.fullTime = this.longestDist / this.speed;
			const _this = this;
			this._bridge(this.textsGeo, () => {
				console.log('геометрии построены');
				this.scene.add(textPoints);
				cb(function() {
					_this.renderer.render(_this.scene, _this.camera); // будет запускаться render
					_this.sound.setBuffer(values[0]);
					_this.sound.play();
					_this.animate();
				});
			})
		});
		this.resizeHandler = this.resizeHandler.bind(this);
		this.removeCanvas = this.removeCanvas.bind(this);
		window.addEventListener( 'resize', this.resizeHandler, false );
		window.addEventListener('animationend', this.removeCanvas);
		this.renderer.domElement.classList.add('prelude');
		document.body.appendChild(this.renderer.domElement);
	}
	

}