export default class {
	constructor() {
		this.DOMElement = document.querySelector('.preloader');
		this.paths = this.DOMElement.querySelectorAll('path');
		this.button = this.DOMElement.querySelector('.submit');
	}
	animation(settings) {
		const {path, duration, delay, origin, transform, fill, stroke} = settings
		path.style.transitionDuration = duration;
		path.style.transitionDelay = delay;
		path.style.transformOrigin = origin;
		path.style.transform = transform;
		path.style.fill = fill;
		path.style.stroke = stroke;
	}
	startHandler() {
		this.paths.forEach((path, i) => {
			this.animation({
				path: path,
				duration: '1000ms',
				delay: `${i * 50}ms`,
				origin: `50%`,
				transform: `scale(0) translateX(${100 + i * 20}px)`,
				fill: '#777',
				stroke: '#555'
			});
		});
	}
	loopHandler(event) {
		console.log(1)
		if(event.propertyName === 'stroke') {
		  const value = event.target.style.stroke;
		  if(value !== 'rgb(85, 85, 85)') {
			this.paths.forEach((path, i) => {
				this.animation({
					path: path,
					duration: '1000ms',
					delay: `${i * 50}ms`,
					origin: `50%`,
					transform: `scale(0) translateX(${100 + i * 20}px)`,
					fill: '#777',
					stroke: '#555'
				});
			});
		  } else {
			  this.paths.forEach((path) => {
				this.animation({
					path: path,
					duration: 0,
					delay: 0,
					origin: `50%`,
					transform: `scale(1) translateX(0)`,
					fill: '#273439',
					stroke: '#273439'
				});
			  });
		  }
		}
	  }
	  stop(handler) {
		this.paths[this.paths.length - 1].removeEventListener('transitionend', this.loop);
		this.paths.forEach((path) => {
			this.animation({
				path: path,
				duration: 0,
				delay: 0,
				origin: `50%`,
				transform: `scale(1) translateX(0)`,
				fill: '#273439',
				stroke: '#273439'
			});
		});
		this.button.addEventListener('click', () => {
			this.DOMElement.remove();
			handler();
		});
		this.button.style.backgroundColor = '#273439';
		this.button.style.opacity = '1';
	  }
	init() {
		this.loop = this.loopHandler.bind(this);
		this.start = this.startHandler.bind(this);
		window.addEventListener('load', this.start);
		this.paths[this.paths.length - 1].addEventListener('transitionend', this.loop);
	}
}