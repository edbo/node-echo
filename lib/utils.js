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

//From http://howtonode.org/prototypical-inheritance
Object.defineProperty(Object.prototype, "spawn", {value: function (props) {
  var defs = {}, key;
  for (key in props) {
    if (props.hasOwnProperty(key)) {
      defs[key] = {value: props[key], enumerable: true};
    }
  }
  return Object.create(this, defs);
}});