const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false, args: ['--ignore-certificate-errors'] });
    const page = await browser.newPage();

    // Configura o User Agent para evitar bloqueios
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36');

    // Acessa a página com tempo limite ajustado
    await page.goto('https://www.ratatype.com.br/typing-test/pt_br_new/', {
        waitUntil: 'domcontentloaded',
        timeout: 60000, // Aumenta o limite para 60 segundos
    });

    // Aguarda o carregamento do texto
    const textSelector = '#testText';
    await page.waitForSelector(textSelector);

    const textToType = await page.$eval(textSelector, (el) => el.innerText.replace(/\n/g, ' '));
    console.log('Texto para digitar:', textToType);

    const inputSelector = '#virtualInput';
    await page.waitForSelector(inputSelector);

    for (const word of textToType.split(' ')) {
        for (const char of word) {
            await page.type(inputSelector, char, { delay: 50 });
        }
        await page.type(inputSelector, ' ', { delay: 100 });
    }

    console.log('Texto digitado com sucesso!');
})();
