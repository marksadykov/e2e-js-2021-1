import {strict as assert} from "assert";

export default class DefaultPage {
	constructor(name, container) {
		this.name = name;
		this.container = container;
	}

	get locators() {
		return {
			container: 'body'
		};
	}

	get location() {
		return '/';
	}

	get page() {
		return browser;
	}

	waitForContainer() {
		this.page.waitForVisible(this.container);
	}

	waitForButton(path) {
		this.page.waitForVisible(path);
	}

	clickForButton(path) {
		this.page.click(path);
	}

	clickForSpam(path) {
		this.page.click(path);
	}

	checkForForm(path) {
		this.page.waitForVisible(path);
	}

	clickForToSpam(path) {
		this.page.click(path);
	}

	checkForIfSpam(path) {
		this.page.waitForVisible(path);
		return this.page.getText(path);
	}

	waitForUrl(value, timeout, revert) {
		let url, actual;
		try {
			return browser.waitUntil(() => {
				url = browser.getUrl();

				// Возвращаем адрес без / на конце, который добавляет Selenium
				// Было бы проще получить адрес через window.location.href,
				// но если страница недоступна, то тест упадет, а нам нужно именно проверить переход
				if (typeof value === 'string' && !value.endsWith('/')) {
					url = url.replace(/\/$/, '');
				}

				actual = value === url;

				if (typeof value === 'function') {
					actual = value(url);
				} else if (value[Symbol.match]) {
					actual = value.test(url);
				}

				if (revert) {
					actual = !actual;
				}

				return value && actual;
			}, timeout, '');
		} catch (error) {
			let message = 'Could not wait for required url:';
				message += `\n\tActual: ${url}`;
				message += `\n\tExpected: ${value}`;

			throw new Error(message);
		}
	}

	hasClass(selector, name) {
		let attribute;

		if (selector && name) {
			attribute = browser.getAttribute(selector, 'class');
		} else if (selector) {
			// получение из контекста, для chained вызова element.hasClass()
			attribute = browser.elementIdAttribute(this.lastResult.ELEMENT, 'class').value;

			name = selector;
		}

		if (!attribute) {
			throw new Error('Element not found');
		}

		const actual = attribute.split(' ');

		return actual.includes(name);
	}
}
