import ExcelJS, { Workbook } from 'exceljs';
import path from 'path';
import Product from '../models/Product';
import sharp from 'sharp';
import { IOrder } from '../types/express';

function createPath(fileName: string) {
  return path.resolve('static', 'sheets', fileName);
}

async function convertWebpToPng(sourcePath: string): Promise<Buffer> {
  return sharp(sourcePath)
    .toFormat('png')
    .png({
      quality: 80,
      compressionLevel: 6,
      progressive: true,
    })
    .toBuffer();
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

export const createExcelPromUa = async (fileName: string): Promise<void> => {
  const products = await Product.find();
  const data = products.map((product) => {
    const htmlDescription = product.characteristics
      .map((char) =>
        char.value !== '-'
          ? `<p><strong>${char.name}</strong>: ${char.value}</p>`
          : `<p><strong>${char.name}</strong></p>`
      )
      .join('');

    const searchQueries = product.seoKeywords
      ? product.seoKeywords
      : product.name.split(' ').join(', ');

    return {
      code: product.article,
      name: product.name,
      nameUkr: product.name,
      searchQueries,
      searchQueriesUkr: searchQueries,
      description: product.description,
      descriptionUkr: product.description,
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
      // weight: 0.5,
      // width: 10,
      // height: 10,
      // length: 10,
      productLocation: 'Чернівці',
    };
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');
  worksheet.columns = exportProductColumnsPromUa;
  worksheet.addRows(data);

  await workbook.xlsx.writeFile(createPath(fileName));
};

const exportProductColumnsPrice = [
  {
    header: 'Код_Товару',
    key: 'code',
  },
  {
    header: 'Назва_Позиції',
    key: 'name',
  },
  {
    header: 'Опис',
    key: 'description',
  },
  {
    header: 'Ціна',
    key: 'price',
  },
  {
    header: 'Валюта',
    key: 'currency',
  },
  {
    header: 'РРЦ',
    key: 'priceRetailRecommendation',
  },
  {
    header: 'Валюта РРЦ',
    key: 'currencyRetailRecommendation',
  },
  {
    header: 'Наявність',
    key: 'availability',
  },
  {
    header: 'Кількість',
    key: 'amount',
  },
];

export const createExcelPrice = async (fileName: string): Promise<void> => {
  const products = await Product.find();

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Прайс ingco ua');
  worksheet.columns = exportProductColumnsPrice;

  const imageColumnIndex = 9; // Індекс колонки для зображень (починаючи з 0)
  let rowIndex = 2; // Початковий індекс рядка для даних (1 - заголовок)

  for (const product of products) {
    const rowValues = {
      code: product.article,
      name: product.name,
      description: product.description,
      price: product.price,
      currency: 'USD',
      priceRetailRecommendation: product.priceRetailRecommendation,
      currencyRetailRecommendation: 'UAH',
      availability: 'в наявності',
      amount: product.countInStock,
    };

    worksheet.addRow(rowValues);

    const columnKey = 'name'; // Ключ колонки, для якої ви хочете встановити ширину
    let maxWidth = 10; // Мінімальна ширина колонки

    worksheet.eachRow({ includeEmpty: true }, (row) => {
      const cellValue = row.getCell(columnKey).value;
      const cellValueString = cellValue ? cellValue.toString() : '';
      maxWidth = Math.max(maxWidth, cellValueString.length);
    });

    const currentRow = worksheet.getRow(rowIndex);
    currentRow.height = 65;
    currentRow.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };

    worksheet.getColumn(columnKey).width = maxWidth / 2;
    worksheet.getColumn('description').width = maxWidth / 3;
    worksheet.getColumn('description').alignment = {
      vertical: 'justify' as const,
    };
    worksheet.getColumn('availability').width = 10;
    if (product.image) {
      // const imagePath = path.join(__dirname, product.image); // Шлях до зображення webp

      const imagePath = path.resolve('static', product.image.split('static/')[1]); // Шлях до зображення webp
      const imageBuffer = await convertWebpToPng(imagePath); // Конвертація зображення
      const imageId = workbook.addImage({
        buffer: imageBuffer,
        extension: 'png',
      });

      worksheet.addImage(imageId, {
        tl: { col: imageColumnIndex, row: rowIndex - 1 },
        ext: { width: 75, height: 75 },
      });
    }

    rowIndex++;
  }

  try {
    await workbook.xlsx.writeFile(createPath(fileName));
  } catch (error) {
    console.error('Error writing the file:', error);
  }
};

/**
 * Генерує Excel‑файл замовлення із вбудованими зображеннями продуктів.
 * Зображення обрізається/масштабується до 60x60 пікселів і конвертується до формату PNG.
 *
 * @param order Замовлення типу IOrder. Поле products.product повинно містити повний об'єкт IProduct.
 * @returns Буфер файлу Excel.
 */
export const generateOrderExcel = async (order: IOrder): Promise<Buffer> => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet(`Замовлення ${order.orderCode}`);

  worksheet.columns = [
    { header: '№', key: 'no', width: 5 },
    {
      header: 'Артикул',
      key: 'article',
      width: 15,
    },
    {
      header: 'Найменування',
      key: 'name',
      width: 40,
    },
    {
      header: 'К-сть',
      key: 'quantity',
      width: 10,
    },
    {
      header: 'ціна$',
      key: 'price',
      width: 10,
    },
    {
      header: 'сума$',
      key: 'total',
      width: 10,
    },
    {
      header: 'РРЦ₴',
      key: 'rrc',
      width: 10,
    },
    {
      header: 'Фото',
      key: 'photo',
      width: 10,
    },
  ];

  const headerRow = worksheet.getRow(1);

  headerRow.eachCell((cell) => {
    cell.font = { bold: true, size: 12 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  for (let index = 0; index < order.products.length; index++) {
    const prod = order.products[index];

    const row = worksheet.addRow({
      no: index + 1,
      article: prod.product.article,
      name: prod.product.name,
      quantity: prod.quantity,
      price: prod.price,
      total: prod.totalPriceByOneProduct,
      rrc: prod.product.priceRetailRecommendation,
      photo: '', // зображення буде додано окремо
    });

    row.height = 45;
    row.alignment = { vertical: 'middle', horizontal: 'center' };

    const nameCell = row.getCell('name');
    nameCell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'centerContinuous' };

    const rowNumber = row.number;

    if (prod.product.image) {
      try {
        const imageFilePath = path.join(process.cwd(), prod.product.image);

        const imageBuffer = await sharp(imageFilePath).resize(60, 60).png().toBuffer();

        const imageId = workbook.addImage({
          buffer: imageBuffer,
          extension: 'png',
        });

        // Розташовуємо зображення у клітинці колонки "Фото".
        // Нумерація колонок починається з 0: номер 7 відповідає восьмій колонці (ключ "photo").
        // Також зауважте, що координати (row, col) при позиціюванні зображення в ExcelJS починаються з 0.
        worksheet.addImage(imageId, {
          tl: { col: 7, row: rowNumber - 1 }, // top-left: колонки: 8-1, рядки: rowNumber - 1
          ext: { width: 60, height: 60 },
        });
      } catch (error) {
        console.error(
          `Помилка при обробці зображення для продукту ${prod.product.article}:`,
          error
        );
      }
    }
  }

  worksheet.addRow({});
  const summaryRow = worksheet.addRow({
    name: 'Загальна сума',
    total: order.totalPrice,
  });
  summaryRow.getCell('name').font = { bold: true };
  summaryRow.getCell('total').font = { bold: true };

  const data = await workbook.xlsx.writeBuffer();

  return Buffer.from(data);
};
