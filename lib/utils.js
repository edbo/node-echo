exports.mergeOptions = function(objectToSet,acceptableOptions,newOptions){
    for(var key in newOptions){
        if(acceptableOptions.indexOf(key) !== -1){
            if(typeof newOptions[key] === 'function'){
                objectToSet[key] = newOptions[key];
            }
            else if(newOptions[key] instanceof Object){
                for(var subKey in newOptions[key]){
                    objectToSet[key][subKey] = newOptions[key][subKey];
                }
            }
        }
    }
};
