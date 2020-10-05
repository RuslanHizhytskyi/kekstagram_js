'use strict';

//
// get-info.js

(function() {
    function onError(mess) {
        console.error(mess);
    };

    function onSuccess(data) {
        data.forEach((el, i) => {
            el.id = i;
            el.likesCount = false;
        })
        window.createSmallImg(data);
        window.smallImgClickListener();
        window.sortSmallImg();
        window.cloneData = data;
    };

    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 3000;
    let dataLink = 'https://javascript.pages.academy/kekstagram/data';

    xhr.addEventListener('load', function() {
        switch (xhr.status) {
            case 200:
                onSuccess(xhr.response);
                break;
            default:
                onError('Статус ответа:' + xhr.status + xhr.statusText);
        }
    })

    xhr.addEventListener('error', function() {
        onError('Произошла ошибка');
    });
    xhr.addEventListener('timeout', function() {
        onError('Запрос не выполнился за ' + xhr.timeout + 'мс')
    });
    xhr.open('GET', dataLink);
    xhr.send();
})();

//
// small-img-create.js

(function() {
    window.createSmallImg = function(data) {
        let newData = [],
            photoPattern = document.querySelector('#picture').content.querySelector('.picture__link'),
            picturesBlock = document.querySelector('.pictures');
            
        data.forEach(el => newData.push(el));

        function createDomElementPhoto(obj) {
            let photoElement = photoPattern.cloneNode(true);
            photoElement.querySelector('.picture__img').setAttribute('src', obj.url);
            photoElement.querySelector('.picture__img').setAttribute('data-id', obj.id);
            photoElement.querySelector('.picture__stat--likes').textContent = obj.likes;
            photoElement.querySelector('.picture__stat--comments').textContent = obj.comments.length;
            return photoElement;
        };

        newData.forEach(el => picturesBlock.appendChild(createDomElementPhoto(el)));

        window.smallImgClickListener = function() {
            picturesBlock.addEventListener('click', function (evt) {
                if (evt.target.classList.contains('picture__img')) {
                    window.showBigPhoto(newData.find(elem => elem.id == +evt.target.getAttribute('data-id')));
                }
            });
        }
    };
})();


//
// show-big-photo.js

(function() {
    window.showBigPhoto = function(obj) {
        let bigElementPhoto = document.querySelector('.big-picture');
        let commentBigPicturePattern = document.querySelector('#social__comment').content.querySelector('.social__comment');
        let commentsBlock = document.querySelector('.social__comments');
        let likesCount = document.querySelector('.likes-count');
        function createBigPhotoComments(obj, j) {
            let commentElement = commentBigPicturePattern.cloneNode(true);
            commentElement.querySelector('.social__picture').setAttribute('src', obj.comments[j].avatar);
            commentElement.querySelector('.social__text').textContent = obj.comments[j].name + ' : ' + obj.comments[j].message;
            return commentElement;
        };
    
        bigElementPhoto.classList.remove('hidden');
        bigElementPhoto.querySelector('img').setAttribute('src', obj.url);
        bigElementPhoto.querySelector('.likes-count').textContent = obj.likes;
        bigElementPhoto.querySelector('.comments-count').textContent = obj.comments.length;
        if (obj.likesCount) {likesCount.classList.add('likes-count-active')}
        for (let j = 0; j < obj.comments.length; j++) {
            commentsBlock.appendChild(createBigPhotoComments(obj, j));
        }
        bigElementPhoto.querySelector('.social__caption').textContent = obj.description;
        bigElementPhoto.querySelector('.social__comment-count').classList.add('visually-hidden');
        bigElementPhoto.querySelector('.social__comment-loadmore').classList.add('visually-hidden');

        function closeBigPhoto() {
            bigElementPhoto.classList.add('hidden');
            commentsBlock.querySelectorAll('.social__comment').forEach(elem => elem.parentNode.removeChild(elem));
            likesCount.classList.remove('likes-count-active');
            bigElementPhoto.removeEventListener('click', clickBigPhoto);
            // commentsBlock.textContent = '';
        }

        function smallPhotoLikes(obj) {
            let smallList = document.querySelectorAll('.picture__img');
            for (let i = 0; i < smallList.length; i++) {
                if (smallList[i].getAttribute('data-id') == obj.id) {
                    smallList[i].parentElement.querySelector('.picture__stat--likes').textContent = obj.likes;
                }
            }
        }

        function likeClick(like) {
            if (obj.likesCount) {
                obj.likesCount = false;
                like.classList.remove('likes-count-active');
                like.textContent = +like.textContent - 1;
                obj.likes--;
                smallPhotoLikes(obj);
            } else {
                obj.likesCount = true;
                like.classList.add('likes-count-active');
                like.textContent = +like.textContent + 1;
                obj.likes++;
                smallPhotoLikes(obj);
            }
        }

        let clickBigPhoto = function(evt) {
            if (evt.target.classList.contains('big-picture__cancel') || evt.target.classList.contains('overlay')) {
                closeBigPhoto();
            } else if (evt.target.classList.contains('likes-count')) {
                likeClick(evt.target);
                // likes and show more comments script
            }
        }
        bigElementPhoto.addEventListener('click', clickBigPhoto);
    };
})();


//
// upload.js

//upload-photo
(function() {
    let uploadPhotoInput = document.querySelector('#upload-file');
    let imgActive = document.querySelector(".img-upload__preview img");

    uploadPhotoInput.addEventListener('change', function () {
        document.querySelector('.img-upload__overlay').classList.remove('hidden');
        let selectedFile = document.querySelector('#upload-file').files[0];
        if (selectedFile.type === "image/jpeg" || selectedFile.type === "image/png") {
            let reader = new FileReader();
            reader.onload = function (evt) {
                imgActive.setAttribute('src', evt.target.result);
            }
            reader.readAsDataURL(selectedFile);
        }
    });

    //effects + scale
    function effectAdd(rangeValue, effectName) {
        switch (effectName) {
            case 'effect-chrome':
            imgActive.setAttribute('style', "-webkit-filter: grayscale(" + (rangeValue / 100) + "); filter: grayscale(" + (rangeValue / 100) + "); transform: scale(" + (newValueScale / 100) + ");");
            break;
            case 'effect-sepia':
            imgActive.setAttribute('style', "-webkit-filter: sepia(" + (rangeValue / 100) + "); filter: sepia(" + (rangeValue / 100) + "); transform: scale(" + (newValueScale / 100) + ");");
            break;
            case 'effect-marvin':
            imgActive.setAttribute('style', "-webkit-filter: invert(" + rangeValue + "%); filter: invert(" + rangeValue + "%); transform: scale(" + (newValueScale / 100) + ");");
            break;
            case 'effect-phobos':
            imgActive.setAttribute('style', "-webkit-filter: blur(" + (rangeValue / 20) + "px); filter: blur(" + (rangeValue / 20) + "px); transform: scale(" + (newValueScale / 100) + ");");
            break;
            case 'effect-heat':
            imgActive.setAttribute('style', "-webkit-filter: brightness(" + (rangeValue / 100 * 3) + "); filter: brightness(" + (rangeValue / 100 * 3) + "); transform: scale(" + (newValueScale / 100) + ");");
            break;
            default:
            imgActive.setAttribute('style', "transform: scale(" + (newValueScale / 100) + ");");
        }
    };
    
    let rangeValue = 20;
    let effectName = "effect-none";
    
    function moveRange(evt) {
        rangeValue = evt.target.value;
        effectAdd(rangeValue, effectName);
    }
    
    document.querySelector(".effects__list").addEventListener("click", function(evt) {
        if (evt.target.getAttribute('type') === 'radio') {
            effectName = evt.target.getAttribute("id");
        }
        effectAdd(rangeValue, effectName);
    });
    
    document.querySelector("#effect_level").addEventListener("input", moveRange);
    
    let resizeInput = document.querySelector(".resize__control--value");
    let newValueScale = 100;

    function changeResizeValue(evt) {
        let resizeValue = resizeInput.getAttribute("value");
        newValueScale = resizeValue.replace('%', '');
        if (evt) {
            newValueScale = +newValueScale + 5;
        } else {
            newValueScale = +newValueScale - 5;
        }
        resizeInput.setAttribute("value", newValueScale + '%');
        effectAdd(rangeValue, effectName);
    }
    
    document.querySelector('.img-upload__resize').addEventListener('click', function(evt) {
        if (evt.target.getAttribute('type') === 'button') {
            if (evt.target.classList.contains('resize__control--minus')) {
                changeResizeValue(false);
            } else if (evt.target.classList.contains('resize__control--plus')) {
                changeResizeValue(true);
            }
        }
    })
    
    window.hashTag = document.querySelector('.text__hashtags');
    window.formComment = document.querySelector('.text__description');


    
    window.closeUploadForm = function () {
        document.querySelector('.img-upload__overlay').classList.add('hidden');
        rangeValue = 20;
        effectName = "effect-none";
        newValueScale = 100;
        resizeInput.setAttribute("value", newValueScale + '%');
        effectAdd(rangeValue, effectName);
        window.hashTag.value = '';
        window.formComment.value = '';
        uploadPhotoInput.type = '';
        uploadPhotoInput.type = 'file';
    }
    
    document.querySelector('.img-upload__cancel').addEventListener('click', window.closeUploadForm);
})();



// CHECK INPEUT TEXT

(function() {
    let url = 'https://echo.htmlacademy.ru';

    window.uploadForm = function(data, onSuccess) {
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'json';

        xhr.addEventListener('load', function() {
            onSuccess(xhr.response);
        });

        try {
            xhr.open('POST', url);
            xhr.send(data);
        } catch (err) {
            console.log(err.message);
        }
    }
})();

(function() {
    let sumitFormButton = document.getElementById('upload-select-image');
    sumitFormButton.addEventListener('submit', function(evt) {
        evt.preventDefault();
        let textByHashtagsInput = window.hashTag.value;
        let checkHashTags = textByHashtagsInput.split(/\s{1,}/);
        if (checkHashTags[checkHashTags.length - 1] === "") {
            checkHashTags.pop();
        }
    
        let successTagFlag = true;
    
        for (let i = 0; i < checkHashTags.length; i++) {
            let tag = checkHashTags[i];
            let tagSymbols = tag.split('');
            if (tagSymbols[0] !== '#') {
                alert('Хеш-тег должен начинаться с #');
                successTagFlag = false;
                window.hashTag.value = "";
            } else if (tagSymbols.length > 20) {
                alert('Хеш-тег не должен привышать 20 символов, включая символ #');
                successTagFlag = false;
                window.hashTag.value = "";
            }
        }
        if (successTagFlag) {
            window.uploadForm(new FormData(sumitFormButton), function(response) {
                window.closeUploadForm();
            })
        }
    });
})();


(function() {
    function deleteSmallImg() {
        document.querySelectorAll('.picture__link').forEach(elem => elem.parentNode.removeChild(elem));
    }
    function createNewRandomNumArr(arrLength) {
        let arr = [];
        for(let i = 0; i < arrLength; i++) arr.push(i);
        arr.sort(() => Math.random() - 0.5);
        return arr;
    }

    function createNewSmallImgList(data) {
        let arr = [],
            newData = [],
            i;
        arr = createNewRandomNumArr(data.length);
        for (i = 0; i < 10; i++) newData[i] = data[arr[i]];
        window.createSmallImg(newData);
    }

    function createNewSortedImgList(data) {
        let sortedData = [];
        data.forEach(el => sortedData.push(el));
        sortedData.sort((a, b) => b.comments.length - a.comments.length);
        window.createSmallImg(sortedData);
    }

    let lastId;
    function resortImgs(id) {
        if (lastId !== id) {
            switch (id) {
                case 'filter-popular':
                    deleteSmallImg();
                    window.createSmallImg(window.cloneData);
                    break;
                case 'filter-new':
                    deleteSmallImg();
                    createNewSmallImgList(window.cloneData);
                    break;
                case 'filter-discussed':
                    deleteSmallImg();
                    createNewSortedImgList(window.cloneData);
                    break;
            }
            lastId = id;
        }
    }
    window.sortSmallImg = function() {
        document.querySelector('.img-filters').classList.remove('img-filters--inactive');
        let battons = document.querySelectorAll('.img-filters__button');
        
        document.querySelector('.img-filters__form').addEventListener('click', function(evt) {
            if (evt.target.classList.contains('img-filters__button')) {
                battons.forEach( el => el.classList.remove('img-filters__button--active'))
                evt.target.classList.add('img-filters__button--active');
                resortImgs(evt.target.id);
            }
        })
    }
})();