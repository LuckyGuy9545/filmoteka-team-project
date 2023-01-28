import { ApiTheMovie } from './fetch-class';
import * as basicLightBox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';
import { Notify } from 'notiflix';
import modalWatchedMarkup from '../templates/modal-watched-library.hbs';
import { getWatchedList } from './watched-library-temp';
const apiTheMovies = new ApiTheMovie();
import { onOpenWatchLibrary } from './render-favorites-movie';
const WATCHED_KEY = 'watched-key';

//== реалізація відкриття модалки по кліку на картку
export async function watchedModalOpenOnCardClick(event) {
  if (event.target === event.currentTarget) {
    return;
  }

  const currentId = event.target.closest('.movie-card__item').dataset.id;
  apiTheMovies.setMovieId(currentId);
  apiTheMovies.fetchById(currentId).then(onOpenCard);
}
//== відкриття модалки
function onOpenCard(respModal) {
  const markUp = modalWatchedMarkup(respModal);
  const instance = basicLightBox.create(markUp);
  instance.show();
  document.body.classList.add('stop-fon');

  //== видалення з бібліотеки по клавіші а також з локального
  const modalWatchedLibrBtn = document.querySelector('.modal-btn__watched');
  modalWatchedLibrBtn.textContent = 'remove from watched';
  modalWatchedLibrBtn.addEventListener('click', callback);
  function callback(e) {
    let data = getWatchedList();
    const currentIdBtnWatch = e.target.dataset.id;
    if (data.find(film => film.id === Number(currentIdBtnWatch))) {
      let data = getWatchedList();
      data = data.filter(film => film.id !== Number(currentIdBtnWatch));
      localStorage.setItem(WATCHED_KEY, JSON.stringify(data));
      Notify.warning('Фильм Удалён из библиотеки');
      instance.close();
    }
    onOpenWatchLibrary();

    //== закриття бекдропа ESC
    window.addEventListener('keydown', onKeydownEsc);
    function onKeydownEsc(event) {
      if (event.code === 'Escape') {
        instance.close();
        document.body.classList.remove('stop-fon');
      }
    }

    //  закрытие модального окна по клику бекдропа
    const basic = document.querySelector('.basicLightbox');
    basic.addEventListener('click', onOffHidden);

    function onOffHidden() {
      document.body.classList.remove('stop-fon');
    }
  }
}
