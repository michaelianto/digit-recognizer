async function loadModel() {
    model = undefined;
    model = await tf.loadLayersModel("models/model.json");
    console.log("model loaded")
}
loadModel();

function erase(){
    const canvas = document.querySelector("#responsive-canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function grayscale(imageData){
    const data = imageData.data;
    let pixels = [];
    for (var i = 0; i < data.length; i += 4) {
        console.log(data[i])
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3.0;
        // if(avg != 0) console.log(avg);
        data[i]     = avg; 
        data[i + 1] = avg; 
        data[i + 2] = avg; 
        pixels.push(Math.ceil(avg));
    }
    return pixels;
}

function predict(){
    const canvas = document.querySelector("#responsive-canvas");
    const ctx = canvas.getContext("2d");

    var imageSize = 28;
    var canvasSize = canvas.width;
    // var originalImage = ctx.getImageData(0, 0, 500, 500);
    ctx.drawImage(canvas, 0, 0, canvasSize, canvasSize, 0, 0, imageSize, imageSize);
    var resizedImage = ctx.getImageData(0, 0, imageSize, imageSize);

    let listPixels = [];
    for (var i = 0; i < resizedImage.data.length; i += 4) {
        var avg = (resizedImage.data[i] + resizedImage.data[i + 1] + resizedImage.data[i + 2]) / 3.0;
        if(Number.isNaN(avg)) avg = 0;
        listPixels.push(resizedImage.data[i-1]/255.0);
    }

    var x = tf.tensor2d([listPixels]);
    x = x.reshape([1, 28, 28, 1])

    result = model.predict(x).dataSync();

    var predicted = 0;
    var possibillity = 0
    for(var i = 0 ; i < result.length ; i++){
        if(result[i] > result[predicted]) {
            predicted = i;
            possibillity = result[i]
        }
    }

    alert("Predicted = " + predicted + "\n" + "Possibility = " + possibillity);
}

$(function() {
    var letsdraw = false;
    var theCanvas = document.getElementById('responsive-canvas');
    var ctx = theCanvas.getContext('2d');

    theCanvas.width = 500;
    theCanvas.height = 500;
    
    var canvasOffset = $('#responsive-canvas').offset();

    $('#responsive-canvas').mousemove(function(e) {
        if (letsdraw === true) {
            ctx.lineTo(e.pageX - canvasOffset.left, e.pageY - canvasOffset.top);
            ctx.stroke();
        }
    });

    $('#responsive-canvas').mousedown(function(e) {
        letsdraw = true;
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 25;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(e.pageX - canvasOffset.left, e.pageY - canvasOffset.top);
    });

    $(window).mouseup(function() {
        letsdraw = false;
    });
});