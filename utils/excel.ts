import ExcelJS from 'exceljs';
import path from 'path';
import Product from '../models/Product';
function createPath(fileName: string) {
  return path.resolve('static', 'sheets', fileName);
}

const exportProductColumnsPromUa = [
  { header: 'Код_Товару', key: 'code' },
  { header: 'Назва_Позиції', key: 'name' },
  { header: 'Назва_Позиції_укр', key: 'nameUkr' },
  { header: 'Пошукові_запити', key: 'searchQueries' },
  { header: 'Пошукові_запити_укр', key: 'searchQueriesUkr' },
  { header: 'Опис', key: 'description' },
  { header: 'Опис_укр', key: 'descriptionUkr' },
  { header: 'Тип_товару', key: 'productType' },
  { header: 'Ціна', key: 'price' },
  { header: 'Валюта', key: 'currency' },
  { header: 'Одиниця_виміру', key: 'unit' },
  { header: 'Мінімальний_обсяг_замовлення', key: 'minOrderAmount' },
  { header: 'Оптова_ціна', key: 'wholesalePrice' },
  { header: 'Мінімальне_замовлення_опт', key: 'minWholesaleOrder' },
  { header: 'Посилання_зображення', key: 'imageLink' },
  { header: 'Наявність', key: 'availability' },
  { header: 'Кількість', key: 'amount' },
  { header: 'Номер_групи', key: 'groupNumber' },
  { header: 'Назва_групи', key: 'groupName' },
  { header: 'Посилання_підрозділу', key: 'subdivisionLink' },
  { header: 'Можливість_поставки', key: 'deliveryPossibility' },
  { header: 'Термін_поставки', key: 'deliveryTime' },
  { header: 'Спосіб_пакування', key: 'packagingMethod' },
  { header: 'Спосіб_пакування_укр', key: 'packagingMethodUkr' },
  { header: 'Унікальний_ідентифікатор', key: 'uniqueIdentifier' },
  { header: 'Ідентифікатор_товару', key: 'productId' },
  { header: 'Ідентифікатор_підрозділу', key: 'subdivisionId' },
  { header: 'Ідентифікатор_групи', key: 'groupId' },
  { header: 'Виробник', key: 'manufacturer' },
  { header: 'Країна_виробник', key: 'manufacturerCountry' },
  { header: 'Знижка', key: 'discount' },
  { header: 'ID_групи_різновидів', key: 'variationGroupId' },
  { header: 'Особисті_нотатки', key: 'personalNotes' },
  { header: 'Продукт_на_сайті', key: 'productOnSite' },
  { header: 'Термін_дії_знижки_від', key: 'discountStartDate' },
  { header: 'Термін_дії_знижки_до', key: 'discountEndDate' },
  { header: 'Ціна_від', key: 'priceFrom' },
  { header: 'Ярлик', key: 'tag' },
  { header: 'HTML_заголовок', key: 'htmlTitle' },
  { header: 'HTML_заголовок_укр', key: 'htmlTitleUkr' },
  { header: 'HTML_опис', key: 'htmlDescription' },
  { header: 'HTML_опис_укр', key: 'htmlDescriptionUkr' },
  { header: 'Код_маркування_(GTIN)', key: 'gtinCode' },
  { header: 'Номер_пристрою_(MPN)', key: 'mpnNumber' },
  { header: 'Вага,кг', key: 'weight' },
  { header: 'Ширина,см', key: 'width' },
  { header: 'Висота,см', key: 'height' },
  { header: 'Довжина,см', key: 'length' },
  { header: 'Де_знаходиться_товар', key: 'productLocation' },
];

export const createExcelPromUa = async (): Promise<void> => {
  // const data = [
  //   { name: 'John Doe test test', age: 30 },
  //   { name: 'Jane Doe vay \n vau', age: 25 },
  // ];
  const data = (await Product.find().lean()).map((product) => {
    const htmlDescription =
      (product.description &&
        product.description
          .split('\n')
          .map((line) => `<p>${line}</p>`)
          .join('')) ||
      '<p>Опис відсутній</p>';
    const searchQueries = product.name.split(' ').join(', ');

    return {
      code: product.article,
      name: product.name,
      nameUkr: product.name,
      searchQueries,
      searchQueriesUkr: searchQueries,
      // description: product.description,
      // descriptionUkr: product.description,
      productType: 'Товар',
      price: product.priceRetailRecommendation,
      currency: 'UAH',
      unit: 'шт.',
      minOrderAmount: 1,
      // wholesalePrice: product.price,
      // minWholesaleOrder: 1,
      imageLink: 'https://be-ingco.store' + product.image,
      availability: 'в наявності',
      amount: product.countInStock,
      groupNumber: 1,
      groupName: 'Товари',
      // subdivisionLink: 'https://prom.ua/ua/p' + product._id,
      deliveryPossibility: 'Так',
      // deliveryTime: '2-3 дні',
      // packagingMethod: 'Пакет',
      // packagingMethodUkr: 'Пакет',
      uniqueIdentifier: product._id,
      productId: product.article,
      // subdivisionId: product._id,
      groupId: 1,
      manufacturer: 'INGCO',
      manufacturerCountry: 'Китай',
      discount: 0,
      variationGroupId: 1,
      personalNotes: '',
      productOnSite: 'Так',
      discountStartDate: '',
      discountEndDate: '',
      priceFrom: '',
      tag: '',
      htmlTitle: '<h1>' + product.name + '</h1>',
      htmlTitleUkr: '<h1>' + product.name + '</h1>',
      htmlDescription,
      htmlDescriptionUkr: htmlDescription,
      gtinCode: '',
      mpnNumber: '',
      weight: 0.5,
      width: 10,
      height: 10,
      length: 10,
      productLocation: 'Чернівці',
    };
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');
  worksheet.columns = exportProductColumnsPromUa;
  worksheet.addRows(data);

  await workbook.xlsx.writeFile(createPath('productsProm.xlsx'));
};
