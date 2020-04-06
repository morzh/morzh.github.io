
function Slider(thecanvas, numImgs){

    this.num_imgs = numImgs;
    this.canvas = thecanvas;
    this.counter = 0;

    this.imgs  = new Array(numImgs);
    this.flowX = new Array(numImgs);
    this.flowY = new Array(numImgs);
    this.X;
    this.Y;


    this.placeimg = placeimg;
    this.width = 512;
    this.height = 512;
    this.imageData;
    this.flowXData;
    this.flowYData;
    this.XData;
    this.YData;
    this.imageDst;

    this.initImgsLoad = 0;
    this.currentImgsLoad = 0;

}

const carousel = new Slider("screen", 11);

function initCallback(){
    if (carousel.initImgsLoad === 5){

            carousel.imageDst = new cv.Mat();
            // carousel.XData = new cv.Mat();
            // carousel.YData = new cv.Mat();
    
            carousel.imageData = cv.imread(carousel.imgs[0]);
            carousel.flowXData = cv.imread(carousel.flowX[0]);
            carousel.flowYData = cv.imread(carousel.flowY[0]);
    
            carousel.XData = cv.imread(carousel.X, 5);
            carousel.YData = cv.imread(carousel.Y, 5);

            // XData.convertTo(carousel.XData, 5);
            // YData.convertTo(carousel.YData, 5);

            console.log("Image data loaded");
        }
}


function init(){

    for (i=0; i < carousel.num_imgs; i++){
        carousel.imgs[i] =  new Image();
        carousel.flowX[i]=  new Image();
        carousel.flowY[i]=  new Image();
    }

    carousel.X = new Image();
    carousel.Y = new Image();

    let data_script = document.createElement('script');
    data_script.src = 'data.js';
    document.head.append(data_script);

    /*
    let opencv_script = document.createElement('script');
    opencv_script.src = 'opencv.js';
    opencv_script.type = 'text/javascript';
    opencv_script.async = true;
    document.head.append(opencv_script);


    opencv_script.onload = function(){
        carousel.initImgsLoad +=1;
        initCallback();
    }
    */

    data_script.onload = function(){

        carousel.imgs[0].src  = imgs_data[0]["img"];        
        carousel.flowX[0].src = imgs_data[0]["vfieldX"];        
        carousel.flowY[0].src = imgs_data[0]["vfieldY"];
        carousel.X.src  = "./imgs/X.bmp";       
        carousel.Y.src  = "./imgs/Y.bmp";       

        carousel.imgs[0].onload  = function(){
            carousel.placeimg(carousel.imgs[0], 0,0, carousel.width, carousel.height);
            carousel.imgs[1].src = imgs_data[1]["img"];   
            carousel.imgs[imgNum-1].src = imgs_data[imgNum-1]["img"];
            
            slideroptflow.value = 0;
            carousel.initImgsLoad +=1;
            initCallback();
        }

        carousel.flowX[0].onload  = function(){
            carousel.flowX[1].src = imgs_data[1]["vfieldX"];   
            carousel.flowX[imgNum-1].src = imgs_data[imgNum-1]["vfieldX"];
            carousel.initImgsLoad +=1;
            initCallback();
        }

        carousel.flowY[0].onload  = function(){
            carousel.flowY[1].src = imgs_data[1]["vfieldY"];   
            carousel.flowY[imgNum-1].src = imgs_data[imgNum-1]["vfieldY"];
            carousel.initImgsLoad +=1;
            initCallback();
        }

        carousel.X.onload = function(){
            carousel.initImgsLoad +=1;
            initCallback();
        }
        carousel.Y.onload = function(){
            carousel.initImgsLoad +=1;
            initCallback();
        }
    }
}


function prev(){
    carousel.counter--;

    if (carousel.counter === -1)
        carousel.counter=carousel.num_imgs-1;

    carousel.counter=carousel.counter % carousel.num_imgs;

    if ( carousel.counter-1 >0 && carousel.counter-1 < carousel.num_imgs-1){
        if ( carousel.imgs[carousel.counter-1].src === "")
            carousel.imgs[carousel.counter-1].src = imgs_data[carousel.counter-1]["img"];
    }
    
    carousel.placeimg(carousel.imgs[carousel.counter], 0,0, carousel.width, carousel.height);
    carousel.imageData = cv.imread(carousel.imgs[carousel.counter]);
    slideroptflow.value = 0;
}


function next(){
    carousel.counter++;
    carousel.counter=carousel.counter % carousel.num_imgs;

    if ( carousel.counter+1 >0 && carousel.counter+1 < carousel.num_imgs-1){
        if ( carousel.imgs[carousel.counter+1].src === "" )
            carousel.imgs[carousel.counter+1].src = imgs_data[carousel.counter+1]["img"];
    }

    carousel.placeimg(carousel.imgs[carousel.counter], 0,0, carousel.width, carousel.height);
    carousel.imageData = cv.imread(carousel.imgs[carousel.counter]);
    slideroptflow.value = 0;
}


function placeimg(theimage, x,y,swidth,sheight){
    var canvas  = document.getElementById(this.canvas);
    var context = canvas.getContext('2d');
    context.drawImage(theimage, x,y, swidth, sheight);
}


slideroptflow.oninput = function (){
    // val = Number(slideroptflow.value) / 50.0+1.0;
    // cv.convertScaleAbs(carousel.imageData, carousel.imageDst, val, 1.0);

    console.log(carousel.XData.type());
    console.log(carousel.XData.channels());

    val = Number(slideroptflow.value) / 100.0;
    cv.remap(carousel.imageData, carousel.imageDst, carousel.XData, carousel.YData, cv.INTER_CUBIC);
    // cv.remap(carousel.imageData, carousel.imageDst, carousel.XData+val*carousel.flowXData, carousel.YData+val*carousel.flowXData, cv.INTER_CUBIC);
    cv.imshow(carousel.canvas, carousel.imageDst);
}
