document.addEventListener('DOMContentLoaded', function () {
    var canvas = new fabric.Canvas('logoCanvas');

    // Load the custom font
    var font = new FontFace('VintageHat', 'url(https://res.cloudinary.com/laxdotcom/raw/upload/v1706991845/VintageHat_uu0o5b.otf)');
    font.load().then(function (loadedFont) {
        document.fonts.add(loadedFont);
        initCanvas();
    }).catch(function (error) {
        console.error('Font loading failed: ', error);
    });

    function initCanvas() {
        // Load SVG and initialize the canvas with it
        fabric.loadSVGFromURL('SVG.svg', function (objects, options) {
            var loadedObject = fabric.util.groupSVGElements(objects, options);
            var scaleFactor = 182.598 / loadedObject.height;
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
            var topText = addTopText(110, "TEAM", "#000000");
            canvas.add(topText);

            var bottomText = addBottomText(195, "LACROSSE", "#000000");
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

      loadOpentypeLibrary().then(() => {
            // Attach event listener to the download button after opentype.js has loaded
            document.getElementById('downloadBtn').addEventListener('click', downloadSVGWithOutlines);
        }).catch((error) => {
            console.error('Failed to load opentype.js library:', error);
        });
    }

    function addTopText(position, text, color) {
        return new fabric.Text(text, {
            left: canvas.width / 2,
            top: position,
            fill: color,
            fontSize: 107,
            fontFamily: 'VintageHat',
            originX: 'center',
            originY: 'center'
        });
    }

    function addBottomText(position, text, color) {
        return new fabric.Text(text, {
            left: canvas.width / 2,
            top: position,
            fill: color,
            fontSize: 66.6757,
            fontFamily: 'VintageHat',
            originX: 'center',
            originY: 'center'
        });
    }

    function downloadSVGWithOutlines() {
        // Assuming opentype.js is now loaded, we can use it to convert text to paths
        opentype.load('https://res.cloudinary.com/laxdotcom/raw/upload/v1706991845/VintageHat_uu0o5b.otf', function (err, font) {
            if (err) {
                console.error('Font could not be loaded:', err);
                return;
            }

            canvas.getObjects().forEach(obj => {
                if (obj.type === 'text') {
                    var paths = font.getPaths(obj.text, 0, 0, obj.fontSize);
                    var pathData = paths.map(path => path.toSVG()).join('');
                    var pathObject = new fabric.Path(pathData, {
                        left: obj.left,
                        top: obj.top,
                        fill: obj.fill,
                        originX: 'center',
                        originY: 'center'
                    });
                    canvas.remove(obj);
                    canvas.add(pathObject);
                }
            });

            canvas.renderAll();

            // Now export the canvas as SVG
            var svg = canvas.toSVG();
            var blob = new Blob([svg], {type: 'image/svg+xml'});
            var url = URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = url;
            link.download = 'custom_design.svg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    function loadOpentypeLibrary() {
        return new Promise((resolve, reject) => {
            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/opentype.js@latest/dist/opentype.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
});
