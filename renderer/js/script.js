// Some JavaScript to load the image and show the form. There is no actual backend functionality. This is just the UI
const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

const loadImage = (e) => {
	const file = e.target.files[0];
	if (!isImage(file)) {
		alertError('Please select an image');
		return;
	}

	// original dimensions
	const image = new Image();
	image.src = URL.createObjectURL(file);
	image.onload = () => {
		widthInput.value = image.width;
		heightInput.value = image.height;
	};
	form.style.display = 'block';
	filename.innerText = file.name;
	outputPath.innerText = path.join(os.homedir(), 'imageresizer');
};
const sendImage = (e) => {
	const width = widthInput.value;
	const height = heightInput.value;
	const imgPath = img.files[0].path;

	e.preventDefault();
	if (!img.files[0]) {
		alertError('Please select an image');
		return;
	}
	if (width === '' || height === '') {
		alertError('Please fill height or width');
		return;
	}
	// Send IPC renderer
	ipcRenderer.send('image:resize', { imgPath, width, height });
};

ipcRenderer.on('image:saved', () => {
	alertSuccess('Resize is done');
});
const isImage = (file) => {
	const mimesTypes = ['image/gif', 'image/png', 'image/jpg', 'image/jpeg'];
	return file && mimesTypes.includes(file['type']);
};

const alertError = (msg) => {
	Toastify.toast({
		text: msg,
		duration: 5000,
		close: false,
		style: {
			background: 'red',
			color: '#fff',
			textAlign: 'center',
		},
	});
};

const alertSuccess = (msg) => {
	Toastify.toast({
		text: msg,
		duration: 5000,
		close: false,
		style: {
			background: 'green',
			color: '#fff',
			textAlign: 'center',
		},
	});
};

img.addEventListener('change', loadImage);
form.addEventListener('submit', sendImage);
