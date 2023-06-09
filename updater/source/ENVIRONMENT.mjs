
import path    from 'path';
import process from 'process';
import url     from 'url';



const isArray   = (obj) => Object.prototype.toString.call(obj) === '[object Array]';
const isBoolean = (obj) => Object.prototype.toString.call(obj) === '[object Boolean]';
const isString  = (obj) => Object.prototype.toString.call(obj) === '[object String]';


const action = (() => {

	let value = Array.from(process.argv).slice(2).filter((v) => v.startsWith('--') === false).shift() || '';

	if (/^([clean]{5})$/.test(value) === true) {
		return 'clean';
	} else if (/^([export]{6})$/.test(value) === true) {
		return 'export';
	} else if (/^([update]{6})$/.test(value) === true) {
		return 'update';
	}

	return 'help';

})();

const folder = (() => {

	let value = Array.from(process.argv).slice(2).filter((v) => v.startsWith('--') === false).pop() || '';

	if (value.startsWith('/') === true) {
		return value;
	} else if (value.startsWith('./') === true) {
		return path.resolve(process.env.PWD, value);
	}

	return '/tmp/vulnerabilities';

})();

const flags = (() => {

	let flags = {
		debug:    false,
		insecure: false,
		trackers: []
	};

	Array.from(process.argv).filter((v) => v.startsWith('--') === true).forEach((flag) => {

		let tmp = flag.substr(2).split('=');
		if (tmp.length === 2) {

			let key = tmp[0];
			let val = tmp[1];

			if (val.startsWith('"') && val.endsWith('"')) {
				val = val.substr(1, val.length - 2);
			} else if (val.startsWith('\'') && val.endsWith('\'')) {
				val = val.substr(1, val.length - 2);
			}

			if (isArray(flags[key]) === true) {

				if (val.includes(',') === true) {
					flags[key] = val.split(',').filter((v) => v.trim() !== '');
				} else {
					flags[key] = [ val ];
				}

			} else if (isBoolean(flags[key]) === true) {

				if (val === 'true') {
					flags[key] = true;
				} else if (val === 'false') {
					flags[key] = false;
				}

			} else {

				if (val === 'null') {
					flags[key] = null;
				} else {
					flags[key] = val;
				}

			}

		}

	});

	return flags;

})();

const root = (() => {

	return path.resolve(url.fileURLToPath(import.meta.url), '../../../');

})();



const ENVIRONMENT = {

	action: action,
	flags:  flags,
	folder: folder,
	root:   root

};


export { ENVIRONMENT };
