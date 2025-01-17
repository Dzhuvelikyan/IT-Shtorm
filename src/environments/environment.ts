export const environment = {
  production: false,
  api: "http://localhost:3000/api",

  apiPath: {
    users: "/users",
    categories: "/categories",
    articles: "/articles",
    relatedArticles: "/articles/related",//путь для получения связанных статей с текущей статьей
    comments: "/comments",
    requests: "/requests", //путь на заказ услуги или консультации
  },

  //путь до данных на фронте
  frontendDB: "assets/data-base",

  //путь до картинок
  staticImgPath: "assets/images",

  phone: "+74993431334",
  email: "info@itstorm.com",
  address: "Главный офис компании АйтиШторм находится по адресу Пресненская наб., 12, Москва, Россия, 123317.",
  vk: "https://vk.com/",
  instagram: "https://www.facebook.com/",
  facebook: "https://www.instagram.com/",
};

