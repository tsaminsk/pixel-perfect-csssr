window.onload = function() {
    const textarea = document.querySelector('.js-textarea');
    const clone_textarea = document.querySelector('.js-clone-textarea');
    
    if (textarea) {
        getClientParams();
        textarea.addEventListener('keyup', getClientParams);
    }

    //- функция передает данные в блок клон текстареа, определяет высоту и задает ее текстареа
    function getClientParams() {
        let context = textarea.value.replace(/\n/g, '<br />');
        clone_textarea.innerHTML = context;
        textarea.style.height = (clone_textarea.offsetHeight + 60) + 'px';
    }

    const slider = document.querySelector('.js-slider-hide');
    const sliderArrowPrev = document.querySelector('.js-slider-arrow-prev');
    const sliderArrowNext = document.querySelector('.js-slider-arrow-next');
    const paginationItems = document.querySelectorAll('.js-slider-pagination');

    if (slider) {
        window.setInterval(function () {
            slide(1);
        }, 4000);
    
        sliderArrowPrev.addEventListener('click', () => {
            slide(-1);
        });
    
        sliderArrowNext.addEventListener('click', () => {
            slide(1);
        });

        for (let i = 0; i < paginationItems.length; i++) {
            paginationItems[i].addEventListener('click', () => {
                moveSlideTo(i + 1);
            })
        }
    }

    // переход к слайду номер num
    function moveSlideTo(num) {
        let { url } = hideImage();

        setTimeout(() => {
            showImage(num, url);
        }, 500);
    }

    // листаем слайдер вперед/назад (+1 или -1)
    function slide(delta) {
        let {num, url} = hideImage();

        setTimeout( () => {
            num = num + delta > 3 ? 1 : ( num + delta < 1 ? 3 : (num + delta) );

            showImage(num, url);
        }, 500);
    }

    // функция скрыть изображение - все просто, удаляем класс видимый, навешиваем невидимый, определяем номер следующей картинки
    function hideImage() {
        slider.classList.remove('slider__hide-img--visible');
        slider.classList.add('slider__hide-img--hidden');
        let url = slider.getAttribute('src');
        let num = parseInt(String(url).substr(-5, 1));
        paginationItems[num - 1].classList.remove('is-active');

        return {num, url};
    }

    // функция показать картинку - создаем путь, подменяя номер картинки
    function showImage(num, url) {
        let value = url.substring(0, url.length - 5) + num + '.jpg';
        slider.setAttribute('src', value);
        slider.classList.remove('slider__hide-img--hidden');
        slider.classList.add('slider__hide-img--visible');
        paginationFix(num - 1);
        // paginationItems[num - 1].classList.add('is-active');
    }

    // при быстром переборе остаются лишние is-active, избавляемся перебором
    function paginationFix(j) {
        for (let i = 0; i < paginationItems.length; i++) {
            i === j ? paginationItems[i].classList.add('is-active') : paginationItems[i].classList.remove('is-active');
        }
    }
}
