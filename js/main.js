'use strict'

const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// cart

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const modalClose = document.querySelector('.modal-close');

const openModal = function() {
  modalCart.classList.add('show');
}

const closeModal = function() {
  modalCart.classList.remove('show');
}

buttonCart.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
modalCart.addEventListener('click', function(event) {
  target = event.target;
  if(target.classList.contains('overlay' || 'modal-close')) {
    closeModal();
  }
});

//scroll smooth


{
const scrollLinks = document.querySelectorAll('a.scroll-link');
  for (const scrollLink of scrollLinks) {
    scrollLink.addEventListener('click', function(event) {
      event.preventDefault();
      const id = scrollLink.getAttribute('href');
      document.querySelector(id).scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
  }
}


//goods

const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');

const getGoods = async function() {
  const result = await fetch('db/db.json');
  if(!result.ok) {
    throw 'Ошибка: ' + result.status;
  }
  return await result.json();
};

/*getGoods().then(function (data) {
  console.log(data);
});*/

const createCard = function (objCard) {
  const card = document.createElement('div');
  card.className = 'col-lg-3 col-sm-6';

  card.innerHTML = `
        <div class="goods-card">
            ${objCard.label ? 
              `<span class="label">${objCard.label}</span>` : 
              ''}
						<img src="db/${objCard.img}" alt="${objCard.name}" class="goods-image">
						<h3 class="goods-title">${objCard.name}</h3>
						<p class="goods-description">${objCard.description}</p>
						<button class="button goods-card-btn add-to-cart" data-id="${objCard.id}">
						<span class="button-price">$${objCard.price}</span>
						</button>
				</div>
  `;
  return card;
};

const renderCards = function (data) {
  longGoodsList.textContent = '';
  const cards = data.map(createCard);
  longGoodsList.append(...cards);
  document.body.classList.add('show-goods');
};


more.addEventListener('click', function(event) {
  event.preventDefault();
  getGoods().then(renderCards);
});

const filterCards = function (field, value) {
  getGoods().then(function (data) {
    const filteredGoods = data.filter(function(good){
      return good[field] === value;
    });
    return filteredGoods;
  })
  .then(renderCards);
};

navigationLink.forEach(function (link) {
  link.addEventListener('click', function(event) {
    event.preventDefault();
    if(link.textContent == 'All') {
      getGoods().then(renderCards);
    } else {
      const field = link.dataset.field;
      const value = link.textContent;
      filterCards(field, value);
    }
  });
});