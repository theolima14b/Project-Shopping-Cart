const loading = document.querySelector('.loading');
const totalPrice = document.querySelector('.total-price'); 
const ol = document.querySelector('ol');

const removeLoading = () => {
  setTimeout(() => {
    loading.remove();
  }, 1490);
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

const totalPriceToList = async () => {
  const carItem = document.querySelectorAll('.cart__item');
  let result = 0;
  console.log(carItem);
  carItem.forEach((price) => {
    const priceString = price.innerHTML.split('$')[1];
    result += Number(priceString);
    Math.floor(result);
  });

  totalPrice.innerText = `Preço total: R$ ${result.toFixed(2)}`;
};

const localStorageSave = () => {
  localStorage.setItem('product', ol.innerHTML);
  totalPriceToList();
};

const localStorageItem = () => {
  ol.innerHTML = localStorage.getItem('product');
};

const cartItemClickListener = (event) => {
  event.target.remove();
  localStorageSave();
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: R$ ${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}; 

const mapPrice = (element) => {
  const productPrice = createCartItemElement({
    sku: element.id,
    name: element.title,
    salePrice: element.price,
  });
  ol.appendChild(productPrice);
  totalPriceToList();
}; 

const addProductById = async (event) => {
  const id = event.target.parentElement.firstChild.innerText;
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const responseJson = await response.json()
  .then((object) => mapPrice(object));
  localStorageSave();
  return responseJson;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const buttonAdd = document.querySelectorAll('.item__add');
  buttonAdd.forEach((button) => button.addEventListener('click', addProductById));
  return section;
};

function emptyCart() {
  const btnClear = document.querySelector('.empty-cart');
  btnClear.addEventListener('click', () => {
    const carListItem = document.querySelector('.cart__items');
    carListItem.innerHTML = '';
    totalPrice.innerText = '';
  });
}

const listProduct = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const list = await response.json();
  return list;
};

const addProduct = (searchResult) => {
  setTimeout(() => {
    const productElement = createProductItemElement({
      sku: searchResult.id,
      name: searchResult.title,
      image: searchResult.thumbnail,
    });
    const item = document.querySelector('.items');
    item.appendChild(productElement);
  }, 1500);
};

window.onload = async () => {
  listProduct()
  .then((product) => product.results.forEach((element) => {
    addProduct(element);
  }));
  localStorageItem();
  emptyCart();
  removeLoading();
};
