
import Prelude from './components/prelude';
import Clan from './components/clan';
import Preloader from './components/preloader';

const preloader = new Preloader();
preloader.init();
/* document.onclick = function() {
  preloader.stop(() => {
    console.log('ups')
  })
} */
let clanBox = document.querySelector('main');


let prelude = new Prelude('Freedom | on | L2Arcana');
prelude.init(preloader.stop.bind(preloader));


let clan = new Clan(clanBox, 'clan_name', 'clan_info');
clan.init();
