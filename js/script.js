
document.fonts.load('1em "VintageHat"').then(function () {

    canvas = new fabric.Canvas('logoCanvas');
    let loadedObject;
    let topText, bottomText;

    fabric.loadSVGFromURL('SVG.svg', function (objects, options) {
        loadedObject = fabric.util.groupSVGElements(objects, options);
        const scaleFactor = 182.598 / loadedObject.height;
        loadedObject.set({
            left: canvas.width / 2,
            top: canvas.height / 2,
            scaleX: scaleFactor,
            scaleY: scaleFactor,
            originX: 'center',
            originY: 'center'
        });
        canvas.add(loadedObject);

        // Initialize default text for top and bottom
        topText = addTopText(110, "TEAM", "#000000");
        canvas.add(topText);

        bottomText = addBottomText(195, "LACROSSE", "#000000");
        canvas.add(bottomText);

        canvas.renderAll();
    });

    function generateColorOptions(elementId, colors, callback) {
        const container = document.getElementById(elementId);
        colors.forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.classList.add('color-option');
            colorOption.style.backgroundColor = color.value;
            colorOption.title = color.label;
            colorOption.addEventListener('click', () => {
                callback(color.value);
            });
            container.appendChild(colorOption);
        });
    }

    const colorOptions = [
        { value: '#ffffff', label: 'White' },
        { value: '#a2a9ad', label: 'Grey' },
        { value: '#0D131A', label: 'Black' },
        { value: '#373a36', label: 'Dark Grey' },
        { value: '#513629', label: 'Brown' },
        { value: '#d0b787', label: 'Vegas Khaki' },
        { value: '#85714D', label: 'Metallic Gold' },
        { value: '#12284b', label: 'Navy Blue' },
        { value: '#114734', label: 'Forest Green' },
        { value: '#007940', label: 'Kelly Green' },
        { value: '#006271', label: 'Deep Teal' },
        { value: '#00b1bd', label: 'Light Teal' },
        { value: '#6fa2e4', label: 'Nike Carolina' },
        { value: '#418fde', label: 'Hopkins Blue' },
        { value: '#174293', label: 'Nike Cobalt' },
        { value: '#6dd6ff', label: 'Cascade Carolina' },
        { value: '#80fff3', label: 'Seafoam' },
        { value: '#93d500', label: 'Lime Green' },
        { value: '#03db48', label: 'Electric Green' },
        { value: '#ffb71b', label: 'Athletic Gold' },
        { value: '#fff200', label: 'Yellow' },
        { value: '#ee3724', label: 'Nike Orange' },
        { value: '#ff5219', label: 'Cascade Orange' },
        { value: '#FF8200', label: 'Tennesee Orange' },
        { value: '#592d82', label: 'Purple' },
        { value: '#f732a1', label: 'Hot Pink' },
        { value: '#ffa5d8', label: 'Light Pink' },
        { value: '#6e0624', label: 'Burgundy' },
        { value: '#50131f', label: 'Deep Burgundy' },
        { value: '#A41034', label: 'Crimson' },
        { value: '#d00120', label: 'Scarlet Red' },
        { value: '#CD5A13', label: 'Texas Orange' }
    ];


    generateColorOptions('fontColorPicker', colorOptions, (color) => {
        if (topText) {
            topText.set({ fill: color });
        }
        if (bottomText) {
            bottomText.set({ fill: color });
        }
        canvas.renderAll();
    });


    generateColorOptions('lineColorPicker', colorOptions, (color) => {
        if (loadedObject) {
            loadedObject.set({ fill: color });
            canvas.renderAll();
        }
    });


    // Adding top text
    function addTopText(position, text, color) {
        const newText = new fabric.Text(text, {
            left: canvas.width / 2,
            top: position,
            fill: color,
            fontSize: 107,
            fontFamily: 'VintageHat',
            originX: 'center',
            originY: 'center'
        });
        return newText;
    }

    document.getElementById('topText').addEventListener('input', function () {
        if (topText) {
            canvas.remove(topText);
        }
        topText = addTopText(110, this.value, '#000000');
        canvas.add(topText);
        canvas.renderAll();
    });

    // Adding bottom text
    function addBottomText(position, text, color) {
        const newText = new fabric.Text(text, {
            left: canvas.width / 2,
            top: position,
            fill: color,
            fontSize: 66.6757,
            fontFamily: 'VintageHat',
            originX: 'center',
            originY: 'center'
        });
        return newText;
    }

    document.getElementById('bottomText').addEventListener('input', function () {
        if (bottomText) {
            canvas.remove(bottomText);
        }
        bottomText = addBottomText(195, this.value, '#000000');
        canvas.add(bottomText);
        canvas.renderAll();
    });

    document.getElementById('svgWidthSlider').addEventListener('input', function () {
        if (loadedObject) {
            const newWidth = parseFloat(this.value);
            const scaleFactor = newWidth / loadedObject.getScaledWidth();

            loadedObject.set({
                scaleX: loadedObject.scaleX * scaleFactor
            });

            canvas.renderAll();
        }
    });


    // function textToPath(textObject, callback) {
    //     if (!textObject) return;

    //     const textAsSVG = textObject.toSVG();
    //     fabric.loadSVGFromString(textAsSVG, function (objects, options) {
    //         const pathObject = fabric.util.groupSVGElements(objects, options);
    //         pathObject.set({
    //             left: textObject.left,
    //             top: textObject.top,
    //             fill: textObject.fill,
    //             originX: 'center',
    //             originY: 'center'
    //         });
    //         callback(pathObject);
    //     });
    // }

    function textToPath(textObject, callback) {
        if (!textObject) return;

        textObject.setCoords(); // Ensure that the text object's coordinates are up to date

        const textBoundingBox = textObject.getBoundingRect();
        const textWidth = textBoundingBox.width;
        const textHeight = textBoundingBox.height;
        const centerX = textBoundingBox.left + textWidth / 2;
        const centerY = textBoundingBox.top + textHeight / 2;

        const textAsSVG = textObject.toSVG();
        fabric.loadSVGFromString(textAsSVG, function (objects, options) {
            const pathObject = fabric.util.groupSVGElements(objects, options);
            pathObject.set({
                left: centerX, // Center the path horizontally
                top: centerY,  // Center the path vertically
                fill: textObject.fill,
                originX: 'center',
                originY: 'center',
            });
            callback(pathObject);
        });
    }


    function convertAllTextsToPaths(callback) {
        const textsToConvert = [];
        canvas.forEachObject((obj) => {
            if (obj.type === 'text') {
                textsToConvert.push(obj);
            }
        });

        let convertedCount = 0;
        textsToConvert.forEach((textObj) => {
            textToPath(textObj, (pathObj) => {
                canvas.remove(textObj);
                canvas.add(pathObj);
                convertedCount++;
                if (convertedCount === textsToConvert.length) {
                    callback();
                }
            });
        });
    }
    const downloadLink = document.getElementById('downloadLink');

    // Function to convert an image to SVG
    async function imageToSVG(imageData, width, height) {
        return new Promise((resolve) => {
            const svgNS = 'http://www.w3.org/2000/svg';
            const svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('width', width);
            svg.setAttribute('height', height);

            const image = new Image();
            image.src = imageData;

            image.onload = function () {
                const imageElement = document.createElementNS(svgNS, 'image');
                imageElement.setAttribute('x', '0');
                imageElement.setAttribute('y', '0');
                imageElement.setAttribute('width', width);
                imageElement.setAttribute('height', height);
                imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imageData);

                svg.appendChild(imageElement);
                resolve(svg);
            };
        });
    }

    // Function to convert canvas to SVG and download as a file
    async function convertAndDownload() {
        const canvasDataURL = canvas.toDataURL();
        const svg = await imageToSVG(canvasDataURL, canvas.width, canvas.height);

        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);

        const a = document.createElement('a');
        a.href = svgUrl;
        a.download = 'custom_logo.svg';
        a.style.display = 'none';
        document.body.appendChild(a);

        a.click();
        URL.revokeObjectURL(svgUrl);
        document.body.removeChild(a);
    }

    // Attach the click event handler to the download button
    document.getElementById('downloadBtn').addEventListener('click', convertAndDownload);

});

