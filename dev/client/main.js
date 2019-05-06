
import Prelude from './components/prelude';
import Clan from './components/clan';
import Preloader from './components/preloader';

const preloader = new Preloader();
let clans = document.querySelectorAll('.clan');
let prelude = new Prelude('Destiny | on | L2Arcana');
//let clan = new Clan(clanBox, 'clan_name', 'clan_info');
function init() {
	preloader.startHandler();
	prelude.init(preloader.reversHandler.bind(preloader));

	clans.forEach(item => {
		const clan = new Clan(item, 'clan_name', 'clan_info');
		clan.init();
	});
}

window.addEventListener('load', init);
