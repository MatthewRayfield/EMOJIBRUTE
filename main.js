var canvasA = document.createElement('canvas'),
    contextA = canvasA.getContext('2d'),
    canvasB = document.createElement('canvas'),
    contextB = canvasB.getContext('2d'),
    canvasC = document.createElement('canvas'),
    contextC = canvasC.getContext('2d'),
    dataA,
    dataB,
    width,
    height,
    image,
    currentDiff,
    total = 0,
    count = 0,
    controlsBox,
    iconsSelect,
    timelapseCheckbox,
    statusDisplay,
    startButton,
    startTime;

function calculateDifference() {
    var diff = 0,
        i;

    dataB = contextB.getImageData(0, 0, width, height).data;

    for (i = 0; i < dataA.length; i += 4) {
        //diff += Math.abs(dataB[i] - dataA[i]);
        diff += Math.sqrt(
            Math.pow(dataB[i+0] - dataA[i+0], 2) +
            Math.pow(dataB[i+1] - dataA[i+1], 2) +
            Math.pow(dataB[i+2] - dataA[i+2], 2) +
            Math.pow(dataB[i+3] - dataA[i+3], 2)
        );
    }

    return diff;
}

function rand(min, max) {
    return Math.floor(Math.random()*(max-min)) + min;
}

function loop() {
    var r = rand(0, 256),
        g = rand(0, 256),
        b = rand(0, 256),
        size,
        newDiff,
        a;

    var emojiImage = new Image();

    emojiImage.addEventListener('load', function () {
        var minutes, a;

        contextB.drawImage(emojiImage, rand(-64, width), rand(-64, height));

        newDiff = calculateDifference();

        if (currentDiff - newDiff > 0) {
            currentDiff = newDiff;
            contextC.drawImage(canvasB, 0, 0);

            count ++;

            if (timelapseCheckbox.checked) {
                a = document.createElement('a');
                a.download = 'emojibrute-' + ('00000'+count).substr(-5) + '.png';
                a.href = canvasB.toDataURL('image/png');
                a.click();
            }
        }
        else {
            contextB.drawImage(canvasC, 0, 0);
        }

        total ++;

        minutes = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
        statusDisplay.innerHTML = 'hits: '+count +' total: '+total+' minutes: '+ minutes;

        setTimeout(loop, 0);
    });

    switch (iconsSelect.value) {
        case 'all-emoji':
            size = ['20x20', '32x32', '64x64'][rand(0, 3)];
            emojiImage.src = 'images/'+size+'/'+rand(1, 2175)+'.png';
            break;
        case 'small-emoji':
            emojiImage.src = 'images/20x20/'+rand(1, 2175)+'.png';
            break;
        case 'pokemon':
            emojiImage.src = 'pokemon/'+rand(1, 151)+'.png';
            break;
    }
}

function start() {
    controlsBox.style.display = 'none';

    width = image.width;
    height = image.height;

    canvasA.width = width;
    canvasA.height = height;
    contextA.fillRect(0, 0, width, height);
    contextA.drawImage(image, 0, 0);

    canvasB.width = width;
    canvasB.height = height;

    canvasC.width = width;
    canvasC.height = height;
    contextC.drawImage(canvasB, 0, 0);

    dataA = contextA.getImageData(0, 0, width, height).data;

    currentDiff = calculateDifference();
    startTime = Date.now();
    loop();
}

window.addEventListener('load', function () {
    var fileInput = document.getElementById('file');

    controlsBox = document.getElementById('controls');
    iconsSelect = document.getElementById('icons');
    timelapseCheckbox = document.getElementById('timelapse');
    statusDisplay = document.getElementById('status');
    startButton = document.getElementById('start');

    fileInput.addEventListener('change', function(event) {
        var reader = new FileReader();

        reader.addEventListener('load', function (event) {
            image = new Image();

            image.addEventListener('load', function () {
                startButton.style.display = 'inline';
            });

            image.src = event.target.result;
        });

        if (fileInput.files && fileInput.files[0]) {
            reader.readAsDataURL(fileInput.files[0]);
        }
    });

    timelapseCheckbox.addEventListener('change', function () {
        if (timelapseCheckbox.checked) {
            alert('WARNING! Timelapse will download a gazillion images automatically. Prepare yourself.');
        }
    });

    startButton.addEventListener('click', start);

    document.body.appendChild(canvasA);
    document.body.appendChild(canvasC);
});
