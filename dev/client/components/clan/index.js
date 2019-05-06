export default class {
    constructor(conteiner, btnClass, infoClass) {
        this.box = conteiner;
        this.btnClass = btnClass;
        this.infoClass = infoClass;
        this.fps = 50;
        this.time = 400;
        this.applyButton = this.box.querySelector('.clan_apply');
    }
    _enterEventHandler(event) {
        if(event.keyCode === 13) {
            this._activeHandler(event);
        }
    }
    _showInfoAnimation(target, fps = 50, time = 400) {
        let frame = 1000 / fps;
        let steps = Math.round(time / frame);
        let value = 180 / steps;
        var deg = 0;
        let title = target.querySelector(`.${this.btnClass}`);
        let info = target.querySelector(`.${this.infoClass}`);
        
        var render = () => {
            var id = requestAnimationFrame(render);
            deg += value;
            target.style.transform = `rotateX(${deg}deg)`;
            steps--;
            if (Math.round(deg) === 90) {
                title.style.opacity = 0;
                info.classList.remove('visually-hidden');
            }
            if (steps <= 0) {
                target.removeAttribute('style');
                cancelAnimationFrame(id);
                target.querySelector('.clan_info_close').addEventListener('click', this._closeInfoHandler);
            }
        }
        render();
    }
    _closeInfoHandler(event) {
        event.preventDefault();
        this._closeInfoAnimation(event.target.closest('.clan'));
        this.applyButton.removeEventListener('click', this.applyHandler);
    }
    _closeInfoAnimation(target, fps = 50, time = 400) {
        let frame = 1000 / fps;
        let steps = Math.round(time / frame);
        let value = 180 / steps;
        var deg = 180;
        let title = target.querySelector(`.${this.btnClass}`);
        let info = target.querySelector(`.${this.infoClass}`);
        
        var render = () => {
            var id = requestAnimationFrame(render);
            deg -= value;
            target.style.transform = `rotateX(${deg}deg)`;
            steps--;
            if (Math.round(deg) === 90) {
                title.removeAttribute('style');
                info.classList.add('visually-hidden');
            }
            if (steps <= 0) {
                target.removeAttribute('style');
                cancelAnimationFrame(id);
                target.querySelector('.clan_info_close').removeEventListener('click', this._closeInfoHandler);
            }
        }
        render();
    }
    _removeActiveClassHandler(event) {
        event.preventDefault();
        if(event.animationName === 'clan-info-active') {
            let target = event.target;
            target.classList.remove(`${this.btnClass}--active`);
            target.blur();
            
            this._showInfoAnimation(target.parentElement);
            
            document.removeEventListener('animationend', this._removeActiveClassHandler);
        }
    }
    _activeHandler(event) {
        event.preventDefault();
        let target = event.target.closest(`.${this.btnClass}`);
        if(!target) {
            return;
        }
        target.classList.add(`${this.btnClass}--active`);
        document.addEventListener('animationend', this._removeActiveClassHandler);
        this.applyButton.addEventListener('click', this.applyHandler);
        //target.addEventListener('keyup', this._removeActiveClassHandler);
    }
    applyHandler(event) {
        const clanName = event.target.name;
        import('../../react-components/modal.jsx').then(({default: module}) => {
            module(clanName, Array.from(document.querySelectorAll('.clan_apply')), 'apply-form.jsx');
        });
        this.applyButton.removeEventListener('click', this.applyHandler);
    }
    init() {
        this.applyHandler = this.applyHandler.bind(this);
        this._activeHandler = this._activeHandler.bind(this);
        this._showInfo = this._showInfoAnimation.bind(this);
        this._enterEventHandler = this._enterEventHandler.bind(this);
        this._closeInfoHandler = this._closeInfoHandler.bind(this);
        this._removeActiveClassHandler = this._removeActiveClassHandler.bind(this);
        this.box.addEventListener('mousedown', this._activeHandler);
        this.box.addEventListener('keydown', this._enterEventHandler);
    }
}