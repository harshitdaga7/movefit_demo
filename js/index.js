
var publicInterface = window.PublicInterface = window.PublicInterface || {};
publicInterface.onUnityInitialized = function () {
    console.log('Unity WebGL online');
};

publicInterface.Load = async function (xValues, yValues) {

    // Define a model for linear regression.
    var model = publicInterface.model = await LoadTFModel();
    console.log(model);
    publicInterface.Predict();
};

publicInterface.Predict =async function () {
    var prediction = 0;
    if (publicInterface.model) {
        // Use the model to do inference on a data point the model hasn't seen before:
        prediction = await Infer(threshold = 0.3);
    }
    publicInterface.prediction = prediction[0];
};

publicInterface.getResult = function(){
    if(publicInterface.prediction){
        // console.log(JSON.stringify(publicInterface.prediction)) ;
        publicInterface.prediction["keypoints"] = poseDetection.calculators.keypointsToNormalizedKeypoints(publicInterface.prediction["keypoints"], {height: publicInterface.capture.height, width:publicInterface.capture.width});
        return publicInterface.prediction;
    }
    else
        return {"keypoints": [], "score": 0.0};
}

function setup(){
    publicInterface.capture = createCapture(VIDEO);
    //publicInterface.capture.size(192, 144)
    publicInterface.capture.hide();
}

async function LoadTFModel() {
    const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING };
    let model = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    return model;
}

async function Infer(threshold) {
    let pred = await publicInterface.model.estimatePoses(publicInterface.capture.elt);
    return pred;
  }
