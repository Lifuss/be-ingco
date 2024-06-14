import ExcelJS from 'exceljs';
import path from 'path';

const pathToFile = path.resolve('static', 'sheets', 'products.xlsx');

const exportProductColumns = [
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

export const createExcel = async (): Promise<void> => {
  const data = [
    { name: 'John Doe test test', age: 30 },
    { name: 'Jane Doe vay \n vau', age: 25 },
  ];

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');
  worksheet.columns = exportProductColumns;
  worksheet.addRows(data);

  await workbook.xlsx.writeFile(pathToFile);
};
