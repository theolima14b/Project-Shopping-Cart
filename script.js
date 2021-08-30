const cartItems = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price'); 
const loading = document.querySelector('.loading');
const clearCartButton = document.querySelector('.empty-cart');
const currentCartItems = [];
const currentCartPrices = [];

const removeLoading = () => {
 setTimeout(() => { loading.remove(); }, 1200);
};

const localStorageUpdate = () => {
  const currentItens = document.querySelector('.cart__items');
  localStorage.setItem('currentInfo', currentItens.innerHTML);
};

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const createTotalPrice = async () => {
  let sumOfPrices = null;
  currentCartPrices.forEach((price) => {
    sumOfPrices += price;
  });
  totalPrice.innerText = sumOfPrices;
};

const clearCart = () => clearCartButton.addEventListener('click', () => { 
  cartItems.innerHTML = '';
  totalPrice.innerHTML = '';
});
clearCart();

const cartItemClickListener = (event) => {
  const itemText = event.target.innerText;
  for (let index = 0; index < currentCartItems.length; index += 1) {
    if (itemText === currentCartItems[index]) {
      currentCartPrices[index] = 0;
    }
  }
  createTotalPrice();
  event.target.remove('li');
  localStorageUpdate();
};
cartItems.addEventListener('click', cartItemClickListener);

const createCartItemElement = ({ id, title, price }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = `${id}`;
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  currentCartItems.push(li.innerText);
  currentCartPrices.push(price);
  return li;
}; 

const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const askedItem = ({ id, title, thumbnail }, key1, key2, key3) => ({ 
  [key1]: id,
  [key2]: title,
  [key3]: thumbnail,
});

const fetchApi = async (urlApi) => {
  const response = await fetch(urlApi);
  const responseJson = await response.json();
  return responseJson.results.map((eachItem) => askedItem(eachItem, 'sku', 'name', 'image'));
};

const fetchId = async (event) => {
  const buttonParent = event.target.parentElement;
  const skuReturn = getSkuFromProductItem(buttonParent);
  return fetch(`https://api.mercadolibre.com/items/${skuReturn}`)
  .then((response) => response.json())
  .then((askedJson) => cartItems.appendChild(createCartItemElement(askedJson)))
  .then(() => localStorageUpdate())
  .then(() => createTotalPrice());
};

const addButtonForItems = () => {
  const eachItem = document.querySelectorAll('.item__add');
  eachItem.forEach((button) => button.addEventListener('click', fetchId));
};

const createElement = async (promise) => {
  const resultado = await promise.then((result) => result);
  const fatherElement = document.querySelector('.items');
  resultado.forEach((item) => fatherElement.appendChild(createProductItemElement(item)));
  addButtonForItems();
};

const getLocalStorage = () => {
  cartItems.innerHTML += localStorage.getItem('currentInfo');
};

window.onload = async () => {
  setTimeout(() => { createElement(fetchApi(url)); }, 1200);
  getLocalStorage();
  removeLoading();
};
